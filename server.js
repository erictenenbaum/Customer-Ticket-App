var express = require("express");
var app = express();
var bodyParser = require("body-parser");
require("dotenv").config();

// Agent Authentication
var cors = require('cors');
var session = require('express-session');
app.use(cors());


app.use(session({
    // secret: process.env.SESSIONSECRET || config.sessionSecret || "cat",
    secret: process.env.SESSIONSECRET || "cat",    
    resave: false,
    saveUninitialized: true
}));

//middleware for setting up a user object when anyone first come to the appplication
function userSetup(req, res, next) {
    if (!req.session.user) {
        req.session.user = {};
        req.session.user.loggedIn = false;
    }
    next();
}

app.use(userSetup);

// TWILIO APP STUFF:
var keys = require("./texts/keys.js");
var twilioNumber = keys.TWILIO_PHONE_NUMBER;
var recipientNumber = keys.recipientNumber;

// var list of all available rooms and users/agents connected to a room
// each room would only have one user/agent
var connectedUsers = {};

function noAgent(user) {
    return user.agent === undefined;
}

function hasAgent(user) {
    return user.agent !== undefined;
}

// function to filter the connected users, allow us to check which tickets are open/active
function filter(predicate) {
    var list = [];
    var rooms = Object.keys(connectedUsers);
    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        if (room !== "0" && predicate(connectedUsers[room])) {
            list.push(connectedUsers[room]);
        }
    }
    return list;
}

function updateAgents() {
    // tickets with agents are active
    var activeTickets = filter(hasAgent);
    // tickets without an agents are open
    var openTickets = filter(noAgent);

    // send to all agents open and active tickets
    io.to("0").emit("active tickets", activeTickets);
    io.to("0").emit("open tickets", openTickets);
}

// removes connected user from the list when a user refresh the browser
// or click the signout button
function removeUser(socket) {
    if (socket) {
        if (connectedUsers[socket.room]) {
            if (connectedUsers[socket.room].user === socket.username) {
                delete connectedUsers[socket.room];
                io.to(socket.room).emit("user disconnected", socket.room);
            }
        }
    }
}

var db = require("./models");

var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on("connection", function(socket) {
    console.log("someone connected");

    // this is trigger when an agent or user signs in
    socket.on('new user', function(newUser) {
        console.log(JSON.stringify(newUser, null, 2));

        socket.username = newUser.username;
        socket.room = newUser.room;
        socket.join(socket.room);

        console.log(socket.username + " Connected" + " in Room: " + socket.room);

        if (connectedUsers[socket.room] === undefined) {
            connectedUsers[socket.room] = {};
        }

        connectedUsers[socket.room].room = socket.room;
        if (newUser.agent) {
            connectedUsers[socket.room].agent = socket.username;
        } else {
            connectedUsers[socket.room].user = socket.username;
            require("./texts/texts.js")(recipientNumber,
                twilioNumber,
                socket.username + " Connected" + " in Room: " + socket.room);
        }

        console.log(connectedUsers);
        updateAgents();
    });

    socket.on('chat message', function(msg) {
        io.to(socket.room).emit('chat message', (socket.username + "," + socket.room + ": " + msg));
        console.log(socket.username + ": " + msg);
    });

    // is triggered by an agent sending a message to a room
    socket.on('room chat message', function(msg, room) {
        io.to(room).emit('chat message', (socket.username + "," + socket.room + ": " + msg));
        console.log(socket.username + ": " + msg);
    });

    // is triggered when user refresh the browser
    socket.on('disconnect', function() {
        console.log(socket.username, ' disconnected from Room: ' + socket.room);
        removeUser(socket);
        updateAgents();
    });

    // is triggered when user signs out
    socket.on('leave room', function() {
        console.log(socket.username, " left Room: " + socket.room);
        removeUser(socket);
        socket.leave(socket.room);
        updateAgents();
    });


    // is triggered when assigning an agent to a ticket
    socket.on("assign agent", function(agent_info) {
        socket.username = agent_info.username;
        socket.room = agent_info.room;
        socket.join(socket.room);

        var user = connectedUsers[agent_info.room];
        if (user !== undefined) {
            user.agent = agent_info.username;
            db.Ticket.update({
                agent_id: agent_info.id
            }, {
                where: {
                    id: parseInt(agent_info.room)
                }
            }).then(function() {});
        }
        updateAgents();
    });

    socket.on("open tickets", function() {
        var openTickets = filter(noAgent);
        io.to("0").emit("open tickets", openTickets);
    });

    socket.on("active tickets", function() {
        var activeTickets = filter(hasAgent);
        io.to("0").emit("active tickets", activeTickets);
    });
    // End of socket IO
});

var PORT = process.env.PORT || 3000;

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("./public"));


// Import routes and give the server access to them.
var routes = require("./controllers/customer_controller.js");
app.use(routes);


// Because of socket.io we need to use server.listen     
db.sequelize.sync({ force: false }).then(function() {
    server.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});