# Customer-Ticket-App

App created to facilitate the service for Agents and Clients by using chat rooms and text messages. This is a bare-bones version of our app, and this app has the potential be customized to serve a variety of purposes. This could be used as a customer ticketing app, in which users log in and able to speak with a live agent to troubleshoot their problem. 

This could also be used as a lead capture portal for a lead generation campaign, in which sales prospects log on to the site to get more information about your product or service. They are then able to chat with a live sales rep to discuss you product or service in greater detail. All Customer/Client information is logged to a database, so email addresses can be then used for drip marketing campaigns down the road. 

# Getting Started
To get a copy of the project please visit: https://github.com/erictenenbaum/Customer-Ticket-App

# Prerequisites
In your command line you will need to run NPM Install and Sequelize Init (assuming you have the sequelize CLI installed)
You will also need to have access to a SQL database to interact with Sequelize. We used MySQL, but there are other "dialect" options.


** do NPM install with the package.json that will have all the dependencies necessary to make the APP work.

# Installing
After the installation of all npm dependencies and you are on your local machine, please type the following:
	NODE SERVER.JS
After running the server.js file, go to your browser and type “localhost:3000” to start the server and have access to the client side, type ““localhost:3000/agent” to have access to the client side.


# Running the tests
There is an automatization created with MOCHA and will check about the system working properly with the 4 minimum inputs of the login function for the client, as well as a second test on the 


# Deployment
Deployment was done directly to Heroku using JawsDB.
Our app is deployed here: https://esm-customer-support-app.herokuapp.com/
To view the Agent side go here: https://esm-customer-support-app.herokuapp.com/agent

# Please note: 
The agent page is in testing and we have it up right now to show the full functionality of the app (password encryption and user authentication). However, if this were truly "live" we would disable the agent sign up functionality and there would only be an agent login. 

# Built With
 - Node.js -Server Framework
 - NPM – Package Management for JS
 - Twilio – package to received and send text mgs
 - Sequelize – promise base package to manage MySQL
 - Socket.IO – package that enables real-time bidirectional communication
 - Express – Web Frame package
 - Karma – package to test JS in multiple real browsers.
 - Mocha – JS test framework.

# Authors
 - Shirley Ramirez - https://github.com/shirleymramirez
 - Eric Tenenbaum https://github.com/erictenenbaum
 - Martin Gaxiola - https://github.com/kaktuxmx

# License
This project is currently on review for final licensing. So far, MIT License will apply to this Application.



