var dataValidate = require("../src/srcfile.js").dataValidate;
var expect = require("chai").expect;

describe("dateValidate", function() {
  
    it("should work perfectly fine with those inputs", function() {
        expect(dataValidate("test", "test", "999", "test@test.com")).to.equal(true);
    })
    it("this is too long")
});
