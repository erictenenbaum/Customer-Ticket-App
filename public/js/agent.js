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

      $("#exampleModal").modal("show");

        $(".user-button").on("click", function() {
            var user = $("#user-name").val().trim();
            var room = $("#room-name").val().trim();

            var userObj = {
                customer_first_name: user,
                id: room
            }

            // $.post("/chat", userObj).then(function(data){
            //     console.log(data);
            // })

            socket.emit('new user', userObj);

            // location.assign("/chat");

            $("#exampleModal").modal("hide");
        });


    
      

      
       
  });