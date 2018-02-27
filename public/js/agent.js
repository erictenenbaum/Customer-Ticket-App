 $(function() {
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

     // This places the agent in the correct chat room with socket.io
     var path = location.pathname.split("");
     var chatIndex = path.lastIndexOf("/");
     var chatRoom = path.slice(chatIndex + 1).join("");
     console.log(chatRoom);

     $.post("/agent/" + chatRoom, {}).then(function(data) {
         console.log(data);

         var userObj = {
             username: data.currentUser.agent_first_name,
             room: chatRoom.toString(),
             agent: true
         }
         socket.emit('new user', userObj);

     })


     // PHASED OUT:

     // Once agent authentication is implimented this modal will be phased out and 
     // agents sign on username with server as the username
     // $("#exampleModal").modal("show");
     // $(".user-button").on("click", function() {
     //     var user = $("#user-name").val().trim();
     //     // var room = $("#room-name").val().trim();
     //     console.log(window.location);

     // var userObj = {
     //     username: user,
     //     room: chatRoom.toString(),
     //     agent: true
     // }

     //     // $.post("/agent/" + chatRoom, userObj).then(function(data) {
     //     //     console.log(data);
     //     // })

     // socket.emit('new user', userObj);

     //     // $.post("/agent", userObj).then(function(agentData){
     //     //   console.log(agentData);
     //     // });

     //     // location.assign("/chat");

     //     $("#exampleModal").modal("hide");
     // });


     // Phased Out
     // $("#showUsers").on("click", function() {
     //     socket.emit("show users");
     // })

     // socket.on("show users", function(data) {
     //     console.log(data);
     // });
 });