var express = require("express");

var router = express.Router();
var db = require("../models/");
var path = require("path");

var globalVariable;


// SocketIO Stuff
// var app = express();
// var server = require('http').Server(app);
// var io = require('socket.io')(server);
// io.on("connection", function(socket){
// 	console.log("someone connected");
// });




// Scratch paper, not sure this stuff works
// var express = require("express");
// var server = require('http').Server(app);
// var io = require('socket.io')(server);



router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/sign-up.html"));
});

router.get("/agent", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/agent.html"));
});

router.get("/chat", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/chat.html"));

});



router.post("/signup", function(req, res) {
    console.log(req.body);
    db.Customers.create({
        customer_first_name: req.body.firstName,
        customer_last_name: req.body.lastName,
        customer_phone: req.body.phone,
        customer_email: req.body.email
    }).then(function(results) {

        globalVariable = results

        console.log("THIS IS RESULTS OUTSIDE GET*************************", globalVariable);
        res.json({ id: results.insertId });

        router.get("/chatuser", function(req, res) {

            console.log("THIS IS results INSIDE GET*************************", globalVariable);
            
            db.Customers.findOne({ where: { id: globalVariable.dataValues.id } }).then(data => {
                // console.log("THIS IS DATA: ", data);
                res.json(data);

            });
        });
    });

});


module.exports = router;