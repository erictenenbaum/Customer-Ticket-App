var express = require("express");

var router = express.Router();
var db = require("../models/");
var path = require("path");

//bringing in the bcrypt npm module
var bcrypt = require('bcrypt');

// Homepage/Sign up page for customers
router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/sign-up.html"));
});

// Agent routing
router.get("/agent/:id?", function(req, res) {    
    console.log(req.session.user.loggedIn);

    // the agent needs to be signed in to access any of the agent routes:
    if (req.session.user.loggedIn) {
        // If there is a req.params.id the agent will be sent to the corresponding chat room to assist the customer (req.params.id)
        if (req.params.id) {
            res.sendFile(path.join(__dirname, "../public/html/agent.html"));
        } 
        // if there is no req.params.id the agent will be sent to the agent dashboard. 
        // This is the default path from the agent-sign-in page
        else {
            res.sendFile(path.join(__dirname, "../public/html/agent-dashboard.html"));
        }
    } 
    // If the agent/user is not logged in, they will be redirected back to the agent-sign-in page
    else {
        res.sendFile(path.join(__dirname, "../public/html/agent-sign-in.html"));
    }
});

router.post("/agent/:id?", function(req, res) {
    // console.log(req.body);
    // console.log(req.session.user);
    res.json(req.session.user);
});


// Get request that is called at sign-up.js once signUp post request returns data
// req.params.id = the res.json from the ticket id when the ticket is created
router.get("/chat/:id?", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/chat.html"));
});

// post route from our customer chat (chat.js) 
// This will get data back to the front end to set up the username and chat room for socket.io
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
    } 
// Some additional functionality down the road could be to use this as an api endpoint to look up or display all customers
// This feature is not currently being used
    else {
        db.Customers.findAll({}).then(data => {
            res.json(data);
        });
    }
});

// This is a sign up post route for a new customer
router.post("/signup", function(req, res) {
    console.log(req.body);
    // creates (inserts) into our customer table
    db.Customers.create({
        customer_first_name: req.body.firstName,
        customer_last_name: req.body.lastName,
        customer_phone: req.body.phone,
        customer_email: req.body.email
    }).then(function(customerResults) {
        // Creates a new ticket in our ticket table
        db.Ticket.create({
            customer_id: customerResults.dataValues.id
        }).then(function(ticketResults) {
            res.json(ticketResults);
        });
    });

});

// Agent Authentication:

router.get("/agent-sign-up", function(req, res) {
    console.log(req.session)
    res.sendFile(path.join(__dirname, "../public/html/agent-sign-up.html"));
});

// Get request for the agent sign in page
router.get("/agent-sign-in", function(req, res) {
    // console.log(req.session)
    res.sendFile(path.join(__dirname, "../public/html/agent-sign-in.html"));
});


// Post router for an agent account sign up/creation. This for testing purposes only. 
// This would not be up and running if we were "live"
router.post("/agentSignUp", function(req, res, next) {
    console.log(req.body);
    //to store a hased password into the database we need to first salt our password. 
    // this will tell bcrypt how many time to pass through the users password to generate the hash
    bcrypt.genSalt(10, function(err, salt) {
        //the bcrypt hash method will then 
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB.
            req.body.password = hash;
            console.log(req.body.password);
            // Create our agent insert for oor database
            db.Agent.create(req.body).then(function(dbData) {
                var userObj = {
                    id: dbData.dataValues.id,
                    agent_first_name: dbData.dataValues.agent_first_name,
                    agent_last_name: dbData.dataValues.agent_last_name,
                    username: dbData.dataValues.username,
                    agent_email: dbData.dataValues.email
                }
                req.session.user.loggedIn = true;
                req.session.user.currentUser = userObj;
                res.json(dbData);
            });
        });
    });
});


//login endpoint
router.post("/agentSignIn", function(req, res) {
    //will show our user data from front end
    console.log(req.body)
    //will see the currently formatted session object with user data
    console.log(req.session)
    //initalizing user data variable to an empty object. this will hold our user data on this endpoint
    var user = {};
    //using our users model to query our MySQL database for user info where ther username equals the username we passed in from the front end
    db.Agent.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(function(dbData) {
            //if the database does not find a user with that username we will revice a null value from our database. null values are a little "special" in relation to JS.
            //this is how we would correctly do a check for a null value if recieved
            if (!dbData && typeof dbData === "object") {
                //this will send an error code to our front end for the user not existing
                res.status(404).send('ohhh no, there is a problem with the username or password!')
            } else {
                //here we bring in bcrypt. bcrypt's compare method asks for a few things. it asks for the first parameter you send in a plain text password. 
                //AKA: our users password coming in from the front end. the second parameter bcrypt wants us to pass in the hashed password that we stored in the db. lastly it wants a callback funtion
                //bcrypt will hash the pasword coming in from the front end and compaire it to the users hashed password from our database it will give us a boolean value to let us know if the 
                //passwords were the same
                bcrypt.compare(req.body.password, dbData.dataValues.password, function(err, bcryptRes) {
                    // bcryptRes == true or false

                    //if the response is false send an error to the front end letting the user know that the passwords did not match.
                    if (!bcryptRes) {
                        res.status(404).send('ohhh no, there is a problem with the username or password!')
                    } else {
                        //if the response from bcrypt was true we know our users password matched and we can now format the user data coming from the database to be sent to the font end
                        var userObj = {
                            id: dbData.dataValues.id,
                            agent_first_name: dbData.dataValues.agent_first_name,
                            agent_last_name: dbData.dataValues.agent_last_name,
                            username: dbData.dataValues.username,
                            email: dbData.dataValues.email
                        }
                        //we update the loggedIn key to have a true value. we can use this value on the fron end to see if the user is logged in or not.
                        req.session.user.loggedIn = true;
                        //here the session's user object is updated with the users data. we can hit our /session endpoing witha  get request from the front end and get our user object.
                        req.session.user.currentUser = userObj;

                        console.log(dbData.dataValues)
                        res.status(200).send('Successful login')
                    }
                });
            }
        });
});



module.exports = router;