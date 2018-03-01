var express = require("express");

var router = express.Router();
var db = require("../models/");
var path = require("path");

//bringing in the bcrypt npm module
var bcrypt = require('bcrypt');
var globalVariable = {};

// Homepage/Sign up page for customers
router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/user.html"));
});

router.get("/agent", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/agent.html"));
});

router.post("/agent/login", function(req, res) {
    //will show our user data from front end
    console.log(req.body);
    //will see the currently formatted session object with user data
    console.log(req.session);
    //initalizing user data variable to an empty object. this will hold our user data on this endpoint
    var user = {};
    db.Agent.findOne({
        where: {
            username: req.body.username
        }
    }).then(function(dbData) {
        //if the database does not find a user with that username we will revice a null value from our database. null values are a little "special" in relation to JS.
        //this is how we would correctly do a check for a null value if recieved
        if (!dbData && typeof dbData === "object") {
            //this will send an error code to our front end for the user not existing
            res.status(404).send('Invalid username or password. Please try again');
        } else {
            //here we bring in bcrypt. bcrypt's compare method asks for a few things. it asks for the first parameter you send in a plain text password. 
            //AKA: our users password coming in from the front end. the second parameter bcrypt wants us to pass in the hashed password that we stored in the db. lastly it wants a callback funtion
            //bcrypt will hash the pasword coming in from the front end and compaire it to the users hashed password from our database it will give us a boolean value to let us know if the 
            //passwords were the same
            bcrypt.compare(req.body.password, dbData.dataValues.password, function(err, bcryptRes) {
                // bcryptRes == true or false

                //if the response is false send an error to the front end letting the user know that the passwords did not match.
                if (!bcryptRes) {
                    res.status(404).send("Invalid username or password. Please try again");
                } else {
                    //if the response from bcrypt was true we know our users password matched and we can now format the user data coming from the database to be sent to the font end
                    var userObj = {
                        id: dbData.dataValues.id,
                        agent_first_name: dbData.dataValues.agent_first_name,
                        agent_last_name: dbData.dataValues.agent_last_name,
                        username: dbData.dataValues.username,
                        email: dbData.dataValues.email
                    };
                    //we update the loggedIn key to have a true value. we can use this value on the fron end to see if the user is logged in or not.
                    req.session.user.loggedIn = true;
                    //here the session's user object is updated with the users data. we can hit our /session endpoing witha  get request from the front end and get our user object.
                    req.session.user.currentUser = userObj;

                    console.log(dbData.dataValues);
                    res.json(dbData);
                }
            });
        }
    });
});

router.post("/agent/signup", function(req, res) {
    console.log(req.body);
    //to store a hased password into the database we need to first salt our password.
    // this will tell bcrypt how many time to pass through the users password to generate the hash
    bcrypt.genSalt(10, function(err, salt) {
        //the bcrypt hash method will then
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB.
            req.body.password = hash;
            console.log(req.body.password);
            // Create our agent insert for our database
            db.Agent
                .create(req.body)
                .then(function(dbData) {
                    var userObj = {
                        id: dbData.dataValues.id,
                        agent_first_name: dbData.dataValues.agent_first_name,
                        agent_last_name: dbData.dataValues.agent_last_name,
                        username: dbData.dataValues.username,
                        email: dbData.dataValues.email
                    };
                    req.session.user.loggedIn = true;
                    req.session.user.currentUser = userObj;
                    res.json(dbData);
                }).catch(function(err) {
                    res.status(400).send("Unable to create account. Please check your data");
                });
        });
    });
});


router.post("/user/login", function(req, res) {
    db.Customers
        .findOne({
            where: {
                customer_email: req.body.email
            }
        })
        .then(function(customer) {
            if (customer !== null) {
                globalVariable[customer.dataValues.id] = customer.dataValues.customer_first_name;
                db.Ticket.create({
                    customer_id: customer.dataValues.id
                }).then(function(ticketResults) {
                    ticketResults.dataValues.firstName = globalVariable[ticketResults.dataValues.customer_id];
                    res.json(ticketResults);
                });
            } else {
                res.status(404).send("User does not exist");
            }
        });
});

router.post("/user/signup", function(req, res) {
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
        }).catch(function(err) {
            res.status(400).send("Unable to create account. Please check your data");
        });
    });
});

module.exports = router;