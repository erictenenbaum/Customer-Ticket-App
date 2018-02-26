var express = require("express");

var router = express.Router();
var db = require("../models/");
var path = require("path");

var globalVariable;

router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/sign-up.html"));
});

router.get("/agent/:id?", function(req, res) {

    if (req.params.id) {
        res.sendFile(path.join(__dirname, "../public/html/agent.html"));
    } else {
        res.sendFile(path.join(__dirname, "../public/html/agent-dashboard.html"));
    }

});

router.post("/agent/:id?", function(req, res) {
    console.log(req.body);
});


router.get("/chat/:id?", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/chat.html"));
});

router.post("/api/:id?", function(req, res) {
    if (req.params.id) {
        db.Customers.findAll({
            include: [{
                model: db.Ticket,
                where: { id: req.params.id }
            }]
        }).then(data => {
            res.json(data);
        });
    } else {
        db.Customers.findAll({}).then(data => {

            res.json(data);

        });
    }
});


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


module.exports = router;