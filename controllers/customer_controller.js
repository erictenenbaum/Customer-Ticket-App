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
//  console.log("someone connected");
// });




// Scratch paper, not sure this stuff works
// var express = require("express");
// var server = require('http').Server(app);
// var io = require('socket.io')(server);




// paramaterize so socket io can be passed in. 

// module.exports = function(io, socket) {
//     // io.on("connection", function(socket){

//     // })


//     // Start HERE
// router.get("/", function(req, res) {
//     res.sendFile(path.join(__dirname, "../public/html/sign-up.html"));
// });

// router.get("/agent", function(req, res) {
//     res.sendFile(path.join(__dirname, "../public/html/agent.html"));
// });

// router.get("/chat", function(req, res) {
//     res.sendFile(path.join(__dirname, "../public/html/chat.html"));

// });



// // Not done this is for agent dashboard purposly commented out
// // router.post("/agent", function(req, res){
// //     console.log(req.body);
// //     db.Customers.findOne({where: {id: req.body.id}}).then(function(data){

// //     })

// // });

// // ENDS HERE



// router.post("/api/new", function(req, res) {
//     console.log(req.body);
//     db.Customers.create({
//         customer_first_name: req.body.firstName,
//         customer_last_name: req.body.lastName,
//         customer_phone: req.body.phone,
//         customer_email: req.body.email
//     }).then(function(customerResults) {

//         db.Ticket.create({
//             customer_id: results.id
//         }).then(function(ticketResults){

//             res.redirect("/chat/:" + ticketResults.id)

//         });
//         // globalVariable = results      
//         // res.json({ id: results.insertId });       
//     });

// });

// //  router.get("/chat/:id", function(req, res) {



// //             db.Customers.findOne({ include: db.Ticket}, 
// //                 {where: {db.Ticket.id: req.params.id}}).then(data => {

// //                 res.json(data);

// //             });
// // });



// }
































// // Start HERE
// Not done this is for agent dashboard purposly commented out
// router.post("/agent", function(req, res){
//     console.log(req.body);
//     db.Customers.findOne({where: {id: req.body.id}}).then(function(data){

//     })

// });

// ENDS HERE





router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/sign-up.html"));
});

router.get("/agent/:id?", function(req, res) {

    if (req.params.id){
        res.sendFile(path.join(__dirname, "../public/html/agent.html"));
    }
    else{
        res.sendFile(path.join(__dirname, "../public/html/agent-dashboard.html"));
    }
    
     
});

router.post("/agent/:id?", function(req, res){
    console.log(req.body);
})

// router.get("/chat", function(req, res) {
//     res.sendFile(path.join(__dirname, "../public/html/chat.html"));

// });

router.get("/chat/:id?", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/chat.html"));

});

router.post("/api/:id?", function(req, res) {

    if (req.params.id) {
        // db.Customers.findOne({ where: { id: req.params.id } }).then(data => {

        //     res.json(data);

        // });

        db.Customers.findAll({
            include: [{
                model: db.Ticket,
                where: {id: req.params.id}
            }]
        }).then(data => {
            res.json(data);
        })

    }
    else {
         db.Customers.findAll({}).then(data => {

        res.json(data);

    });
    }


})










// START ********************************************88
// router.post("/signup", function(req, res) {
//     console.log(req.body);
//     db.Customers.create({
//         customer_first_name: req.body.firstName,
//         customer_last_name: req.body.lastName,
//         customer_phone: req.body.phone,
//         customer_email: req.body.email
//     }).then(function(results) {

//         globalVariable = results


//         res.json({ id: results.insertId });

//         router.get("/chatuser", function(req, res) {



//             db.Customers.findOne({ where: { id: globalVariable.dataValues.id } }).then(data => {

//                 res.json(data);

//             });
//         });
//     });

// });

// END ****************************************


router.post("/signup", function(req, res) {
    console.log(req.body);
    db.Customers.create({
        customer_first_name: req.body.firstName,
        customer_last_name: req.body.lastName,
        customer_phone: req.body.phone,
        customer_email: req.body.email
    }).then(function(customerResults) {

        globalVariable = customerResults
        // res.json({ id: results.insertId });

        db.Ticket.create({
            customer_id: customerResults.dataValues.id
        }).then(function(ticketResults) {
            // res.redirect("/chat/" + ticketResults.dataValues.id);
            res.json(ticketResults);
        });
    });

});

// router.get("/chatuser", function(req, res) {

//     console.log("THIS IS REQ*****: ", req.params);



//     db.Customers.findOne({ where: { id: globalVariable.dataValues.id } }).then(data => {

//         res.json(data);

//     });
// });


module.exports = router;

// END HERE