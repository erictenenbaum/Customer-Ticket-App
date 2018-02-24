var keys = require("./keys.js");
const accountSid = keys.accountSid;
const authToken = keys.authToken;

const client = require('twilio')(accountSid, authToken);

module.exports = function(recipient, tNumber, randomText) {

    client.messages
        .create({
            to: recipient,
            from: tNumber,
            body: randomText
        })
        .then(message => console.log(message.sid));
    console.log("success");
}