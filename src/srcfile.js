function dataValidate(firstName, lastName, phone, email) {
  if (firstName !== "" && lastName !== "" && phone !== "" && email !== "") {
    if (
      firstName.length <= 225 &&
      lastName.length <= 225 &&
      phone.length <= 225 &&
      email.length <= 225
    ) {
      return true;
    } else {
      console.log("input too long");
    }
  } else {
    console.log("please fill out form entirely");
  }
};

module.exports.dataValidate = dataValidate;