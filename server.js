var express = require("express");
var app = express();
var bodyParser = require("body-parser");
require("dotenv").config();

console.log(process.env);

// Agent Authentication
var cors = require('cors');
var session = require('express-session');
app.use(cors());


app.use(session({
    // secret: process.env.SESSIONSECRET || config.sessionSecret || "cat",
    secret: "cat",
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

// Socketio Stuff Needs to be on the server page and needs to use server.listen
// Logging Users
var connectedUsers = {};

function noAgent(user) {
    console.log(user);
    return user.agent === undefined;
}

function hasAgent(user) {
    console.log(user);
    return user.agent !== undefined;
}

function filter(predicate) {
    var list = [];
    var rooms = Object.keys(connectedUsers);
    console.log(rooms);
    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        console.log(room);
        console.log(connectedUsers[room]);
        if (room !== "0" && predicate(connectedUsers[room])) {
            list.push(connectedUsers[room]);
        }
    }
    return list;
}

var db = require("./models");

var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on("connection", function(socket) {
    console.log("someone connected");

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
            if (newUser.id !== undefined) {
                db.Ticket
                    .update({ agent_id: newUser.id }, { where: { id: parseInt(newUser.room) } })
                    .then(function() {});
            }
        } else {
            connectedUsers[socket.room].user = socket.username;
            require("./texts/texts.js")(recipientNumber,
                twilioNumber,
                socket.username + " Connected" + " in Room: " + socket.room);
        }

        console.log(connectedUsers);

        var activeTickets = filter(hasAgent);
        var openTickets = filter(noAgent);

        io.to("0").emit("active tickets", activeTickets);
        io.to("0").emit("open tickets", openTickets);
    });

    socket.on('chat message', function(msg) {
        io.to(socket.room).emit('chat message', (socket.username + ": " + msg));
        console.log(socket.username + ": " + msg);
    });

    socket.on('disconnect', function() {
        console.log(socket.username, ' disconnected from Room: ' + socket.room);
        var activeTickets = filter(hasAgent);
        var openTickets = filter(noAgent);
        io.to("0").emit("active tickets", activeTickets);
        io.to("0").emit("open tickets", openTickets);
    });

    socket.on("assign agent", function(agent_info) {
        var user = connectedUsers[agent_info.room];
        if (user !== undefined) {
            user.agent = agent_info.agent;
            db.Ticket.update({
                agent_id: agent_info.id
            }, {
                where: {
                    id: parseInt(agent_info.room)
                }
            }).then(function() {});
        }
        var activeTickets = filter(hasAgent);
        var openTickets = filter(noAgent);
        io.to("0").emit("active tickets", activeTickets);
        io.to("0").emit("open tickets", openTickets);
    });

    // For initial log on by agent. All other instances come from if Number.isInteger
    socket.on("open tickets", function() {
        var openTickets = filter(noAgent);
        io.to("0").emit("open tickets", openTickets);
    });

    // For initial log on by agent. All other instances come from if Number.isInteger
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