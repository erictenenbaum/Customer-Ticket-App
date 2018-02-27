var express = require("express");

var router = express.Router();
var db = require("../models/");
var path = require("path");

var globalVariable = {};
var agentId;

router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/user.html"));
});

router.get("/agent", function(req, res) {

    res.sendFile(path.join(__dirname, "../public/html/agent.html"));
    // } else {
    //     res.sendFile(path.join(__dirname, "../public/html/dashboard.html"));
    // }


});

router.post("/agent", function(req, res) {
    console.log("req.body", req.body.agentName);
    db.Agent.findOne({
        where: {
            agent_name: req.body.agentName
        }
    }).then(function(agent) {
        console.log(agent);
        agentId = agent.dataValues.id;
        console.log(agentId);
        db.Ticket.findOne({
            where: {
                agent_id: null
            }
        }).then(function(ticket) {
            db.Ticket.update({
                agent_id: agentId
            }, { where: { id: ticket.dataValues.id } }).then(function() {});
            res.json(ticket.dataValues.id);
        });
    });
});

router.post("/login", function(req, res) {
    db.Customers
        .findOne({
            where: {
                customer_email: req.body.email
            }
        })
        .then(function(customer) {
            globalVariable[customer.dataValues.id] = customer.dataValues.customer_first_name;
            db.Ticket.create({
                customer_id: customer.dataValues.id
            }).then(function(ticketResults) {
                ticketResults.dataValues.firstName = globalVariable[ticketResults.dataValues.customer_id];
                res.json(ticketResults);
            });
        });
});


router.post("/signup", function(req, res) {
    console.log(req.body);
    db.Customers.create({
        customer_first_name: req.body.firstName,
        customer_last_name: req.body.lastName,
        customer_phone: req.body.phone,
        customer_email: req.body.email
    }).then(function(customerResults) {
        db.Ticket.create({
            customer_id: customerResults.dataValues.id
        }).then(function(ticketResults) {
            res.json(ticketResults);
        });
    });

});


module.exports = router;