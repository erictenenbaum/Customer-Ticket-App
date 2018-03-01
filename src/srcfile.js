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
      return false;

    }
  } else {
    console.log("please fill out form entirely");
    return false;
  }
};

module.exports.dataValidate = dataValidate;