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

      // Puts user in correct chat room
      var path = location.pathname.split("");
      var chatIndex = path.lastIndexOf("/");
      var chatRoom = path.slice(chatIndex + 1).join("");
      console.log(chatRoom);


      $.post("/api/" + chatRoom, {}).then(data => {
          console.log(data);

          var userObj = {
              username: data[0].customer_first_name,
              room: data[0].Tickets[0].id
          };

          socket.emit("new user", userObj);
      });
  });