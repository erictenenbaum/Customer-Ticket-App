var express = require("express");
var app = express();
// var http = require('http').Server(app);
var bodyParser = require("body-parser");
require("dotenv").config();





// Socketio Stuff
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on("connection", function(socket){
	console.log("someone connected");

	 var addedUser = false;

    socket.on('new user', function(newUser) {
    	console.log(newUser);    
        if (addedUser) return;
 
        
        socket.username = newUser.customer_first_name
        socket.room = newUser.id
        socket.join(socket.room);
        
        addedUser = true;     

        console.log(socket.username + " Connected");

    });

    socket.on('chat message', function(msg) {
        io.to(socket.room).emit('chat message', (socket.username + ": " + msg));
        console.log(socket.username + ": " + msg);        
    });

    socket.on('disconnect', function() {
        console.log(socket.username, ' disconnected');
    });
});



var PORT = process.env.PORT || 3000;

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("./public"));


// I don't think we want to use handlebars 
// var exphbs = require("express-handlebars");
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");


var db = require("./models");

// Import routes and give the server access to them.
var routes = require("./controllers/customer_controller.js");


app.use(routes);




// Because of socket.io we need to use server.listen
db.sequelize.sync({force: true}).then(function() {
  server.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
