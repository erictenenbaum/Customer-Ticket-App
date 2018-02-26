console.log(process.cwd());
require("dotenv").config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");


// TWILIO APP STUFF:
var keys = require("./texts/keys.js");

const accountSid = keys.apikeys.accountSid;
const authToken = keys.apikeys.authToken;

var twilioNumber = keys.apikeys.TWILIO_PHONE_NUMBER;
var recipientNumber = keys.apikeys.recipientNumber;

// console.log({ accountSid, authToken, twilioNumber, recipientNumber });

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);


function sendText(recipient, tNumber, randomText) {

    client.messages
        .create({
            to: recipient,
            from: tNumber,
            body: randomText
        })
        .then(message => console.log(message.sid));
    console.log("success");
}


// Socketio Stuff Needs to be on the server page and needs to use server.listen

// Logging Users
var connectedUsers = [];

var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on("connection", function(socket) {
    console.log("someone connected");

    var addedUser = false;

    socket.on('new user', function(newUser) {
        console.log(JSON.stringify(newUser, null, 2));
        if (addedUser) return;

        socket.username = newUser.username
        socket.room = newUser.room
        socket.join(socket.room);

        addedUser = true;

        console.log(socket.username + " Connected" + " in Room: " + socket.room);

        if (Number.isInteger(socket.room)) {
            connectedUsers.push({ user: socket.username, room: socket.room });
            sendText(recipientNumber, twilioNumber, socket.username + " Connected" + " in Room: " + socket.room);

        }

    });

    socket.on('chat message', function(msg) {
        io.to(socket.room).emit('chat message', (socket.username + ": " + msg));
        console.log(socket.username + ": " + msg);
    });

    socket.on('disconnect', function() {
        console.log(socket.username, ' disconnected from Room: ' + socket.room);

    });

    socket.on('show users', function() {
        // console.log(connectedUsers);
        io.to(socket.room).emit("show users", connectedUsers);
    })
});





var PORT = process.env.PORT || 3000;

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("./public"));


var db = require("./models");

// Import routes and give the server access to them.
var routes = require("./controllers/customer_controller.js");


app.use(routes);


// Because of socket.io we need to use server.listen
db.sequelize.sync({ force: false }).then(function() {
    server.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});