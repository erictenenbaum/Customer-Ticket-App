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

      // })


      // FOR AGENT STUFF

         var path = location.pathname.split("");


       var chatIndex = path.lastIndexOf("/");

       var chatRoom = path.slice(chatIndex + 1).join("");

       console.log(chatRoom);



      $("#exampleModal").modal("show");

        $(".user-button").on("click", function() {
            var user = $("#user-name").val().trim();
            // var room = $("#room-name").val().trim();

            console.log(window.location);

            var userObj = {
                username: user,
                room: chatRoom.toString()
            }

            $.post("/agent/" + chatRoom, userObj).then(function(data){
                console.log(data);
            })

            socket.emit('new user', userObj);

            // $.post("/agent", userObj).then(function(agentData){
            //   console.log(agentData);
            // });

            // location.assign("/chat");

            $("#exampleModal").modal("hide");
        });


        $("#showUsers").on("click", function(){
          socket.emit("show users");
        })

        socket.on("show users", function(data){
          console.log(data);
        });




    
      

      
       
  });