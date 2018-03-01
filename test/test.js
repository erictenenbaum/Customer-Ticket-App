var dataValidate = require("../src/srcfile.js").dataValidate;
var expect = require("chai").expect;

describe("dateValidate", function() {
  
    it("If the input equals to First Name, Last Name, Phone and EMail should be correct", function() {
        expect(dataValidate("test", "test", "999", "test@test.com")).to.equal(true);
    });
    it("If length is greater than 225 characters should be correct.", function(){
        expect(dataValidate.length>226).to.equal(false)
    });

});

