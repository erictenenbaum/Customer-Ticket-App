 $(function()  {
      $('body').bootstrapMaterialDesign();
       const socket = io();
    


      // FOR AGENT STUFF

      // With Modal use this:

      // $("#exampleModal").modal("show");

      //   $(".user-button").on("click", function() {
      //       var user = $("#user-name").val().trim();
      //       var room = $("#room-name").val().trim();

      //       var userObj = {
      //           username: user,
      //           room: room
      //       }       

      //       socket.emit('new user', userObj);
           
      //       $("#exampleModal").modal("hide");
      //   });


         var userObj = {
                username: "Agent",
                room: "0"
            }       

            socket.emit('new user', userObj);           
           // socket.emit("show users");

           function continuousUpdate() {            
              socket.emit("show users");
              setInterval(continuousUpdate, 5000);
           }

           continuousUpdate();
      




        // $("#showUsers").on("click", function(){
        //   socket.emit("show users");
        // })

        socket.on("show users", function(data){
          $("#dashboardDiv").html("");
          // console.log(data);

            for(let i = 0; i < data.length; i++){
              var newDiv = $("<div>");

              newDiv.html("<ul><li>" + "Name: " + data[i].user + "</li> <li> Room: " + 
                "<a href='/agent/"+data[i].room + "' target='blank_'>" + data[i].room + "</a>" + "</li></ul>");

              $("#dashboardDiv").append(newDiv);
            }
        });




    
      

      
       
  });