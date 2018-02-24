$(function() {
    $("#sign-up").on("click", () => {
        let firstName = $("#firstName").val().trim();
        let lastName = $("#lastName").val().trim();
        let phone = $("#phone").val().trim();
        let email = $("#email").val().trim();

        let newUserObj = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email
        }

        function dataValidate(firstName, lastName, phone, email) {
            if (firstName !== "" && lastName !== "" && phone !== "" && email !== "") {
                if (firstName.length <= 225 && lastName.length <= 225 && phone.length <= 225 && email.length <= 225) {
                 	return true;
                } else {
                    alert("input too long");
                }                
            } else {
                alert("please fill out form entirely");
            }
        }


        if (dataValidate(firstName, lastName, phone, email)) {
        	console.log(newUserObj);

        	$.post("/signup/", newUserObj).then(data =>{
        		console.log("this is data", data);
        		location.assign("/chat");
        	})
        }
        


    });
});