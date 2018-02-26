 $(function()  {
      $('body').bootstrapMaterialDesign();
       const socket = io();     


         var userObj = {
                username: "Agent",
                room: "0"
            }       

            socket.emit('new user', userObj);  
                     
           socket.emit("show users");


        socket.on("show users", function(data){
          $("#dashboardDiv").html("");
          console.log(data);

            for(let i = 0; i < data.length; i++){
              var newDiv = $("<div>");

              newDiv.html("<ul><li>" + "Name: " + data[i].user + "</li> <li> Room: " + 
                "<a href='/agent/"+ data[i].room + "'target='blank_'" + 
                "class='roomButton'" +
                "data-id='" + [i] + "'>" 
                + data[i].room + "</a>" 
                + "</li></ul>");

              $("#dashboardDiv").append(newDiv);
            }
        });

        // $("<a>").on("click", function(){
        //   console.log("click!")
        // });




    // PHASED OUT FUNCTIONALITY

           // Old function for continuously updating the dashboard. Phased out
           // function continuousUpdate() {            
           //    socket.emit("show users");
           //    setInterval(continuousUpdate, 5000);
           // }

           // continuousUpdate();  

           // Button with click even has been phased out too
        // $("#showUsers").on("click", function(){
        //   socket.emit("show users");
        // })
      

      
       
  });