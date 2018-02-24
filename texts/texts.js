var keys = require("./texts/keys.js");
const accountSid = keys.apikeys.accountSid;
const authToken = keys.apikeys.authToken;

const client = require('twilio')(accountSid, authToken);

module.exports = function (recipient, tNumber, randomText) {

	client.messages
  .create({
    to: recipient,
    from: tNumber,
    body: randomText
  })
  .then(message => console.log(message.sid));
  	console.log("success");
}
