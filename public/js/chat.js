  $(function()  {
      $('body').bootstrapMaterialDesign();


       const socket = io();
            $('form').submit(function() {
            socket.emit('chat message', $('#m').val());
            $('#m').val('');
            return false;
        });
        socket.on('chat message', function(msg) {
            $('#messages').append($('<li>').text(msg));
        });
        console.log(socket);
     



      // $.get("/chatuser", function(data) {
      //     console.log(data);   

      //     socket.emit("new user", data)

      // });

        var path = location.pathname.split("");


       var chatIndex = path.lastIndexOf("/");

       var chatRoom = path.slice(chatIndex + 1).join("");

       console.log(chatRoom);



        $.post("/api/" + chatRoom, {}).then(data =>{
          console.log(data);

          var userObj = {
           username: data[0].customer_first_name,
           room: data[0].Tickets[0].id
          }

          socket.emit("new user", userObj)
        })


      // FOR AGENT STUFF

      // $("#exampleModal").modal("show");

      //   $(".user-button").on("click", function() {
      //       var user = $("#user-name").val().trim();
      //       var room = $("#room-name").val().trim();

      //       var userObj = [{
      //           customer_first_name: user,
      //           id: room
      //       }]

      //       // $.post("/chat", userObj).then(function(data){
      //       //     console.log(data);
      //       // })

      //       socket.emit('new user', userObj);

         

      //       $("#exampleModal").modal("hide");
      //   });


    
      

      
       
  });

