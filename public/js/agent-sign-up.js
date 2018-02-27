// THIS FILE IS FOR TESTING PURPOSES ONLY. 
// This will not be up when the site goes "live", as we wouldn't want to give the public the ability to sign up new agents

$(function() {
    $("#sign-up").on("click", () => {
        let firstName = $("#firstName").val().trim();
        let lastName = $("#lastName").val().trim();       
        let email = $("#email").val().trim();
        let username = $("#username").val().trim();
        let password = $("#password").val().trim();

        let newAgentObj = {
            agent_first_name: firstName,
            agent_last_name: lastName,
            email: email,
            username: username,
            password: password
            
        }


        console.log(newAgentObj);

        // function dataValidate(firstName, lastName, phone, email) {
        //     if (firstName !== "" && lastName !== "" && phone !== "" && email !== "") {
        //         if (firstName.length <= 225 && lastName.length <= 225 && phone.length <= 225 && email.length <= 225) {
        //          	return true;
        //         } else {
        //             alert("input too long");
        //         }                
        //     } else {
        //         alert("please fill out form entirely");
        //     }
        // }


        // if (dataValidate(firstName, lastName, phone, email)) {
        // 	console.log(newUserObj);

        // 	$.post("/signup", newUserObj).then(data =>{
        // 		console.log("this is data", data);
        // 		location.assign("/chat/" + data.id);
        // 	})
        // }

        $.post("/agentSignUp", newAgentObj).then(data =>{
            console.log(data);
        })
        


    });
});