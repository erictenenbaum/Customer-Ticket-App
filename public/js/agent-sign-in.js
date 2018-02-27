 $("#exampleModal").modal("show");
 $(".user-button").on("click", function() {
     var username = $("#user-name").val().trim();
     var password = $("#password").val().trim();

     var agentObj = {
         username: username,
         password: password
     }

     // Post to our router to check if the username and password are a match to log in
     $.post("/agentSignIn", agentObj).then(function(data) {
         console.log(data);

         // If the login was successful the server will send a 200 status with "Successful login"
         if (data === "Successful login") {
             // We then route the agent to the agent dashboard
             location.assign("/agent");
         }
     });

     $("#exampleModal").modal("hide");
 });