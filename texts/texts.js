var keys = require("./keys.js");
var accountSid = keys.accountSid;
var authToken = keys.authToken;

var client = require('twilio')(accountSid, authToken);

module.exports = function(recipient, tNumber, randomText) {

    client.messages
        .create({
            to: recipient,
            from: tNumber,
            body: randomText
        })
        .then(message => console.log(message.sid));
    console.log("success");
};