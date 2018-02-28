$(document).ready(function() {
    var me = {};
    me.avatar = "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";

    var you = {};
    you.avatar = "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";

    var socket = io();
    var myUser;

    // 
    $(".loginButton").on("click", function(event) {
        $.ajax({
            url: "/user/login",
            type: "POST",
            data: $(".loginForm").serialize(),
            success: function(data) {
                myUser = data.firstName;
                var chatInfo = { username: data.firstName, room: data.id, agent: false };

                socket.emit("new user", chatInfo);
                $(".loginForm").hide();
                $(".signOutButton").show();
                $(".signUpPanel").fadeOut("slow");
                $(".chatContainer").fadeIn("slow");
            },
            error: function() {
                console.log("error");
            }
        });
    });

    // 
    $(".signUpButton").on("click", function(event) {
        $.ajax({
            url: "/user/signup",
            type: "POST",
            data: $(".userMessageForm").serialize(),

            success: function(data) {
                myUser = $("#userFirstName").val().trim();
                var chatInfo = { username: myUser, room: data.id, agent: false };
                socket.emit("new user", chatInfo);

                $(".loginForm").hide();
                $(".signOutButton").show();
                $(".signUpPanel").fadeOut("slow");
                $(".chatContainer").fadeIn("slow");
            },
            error: function() {
                console.log("error");
            }
        });
    });

    function insertChat(who, text, time) {
        if (time === undefined) {
            time = 0;
        }
        var control = "";
        var date = moment().format("LT");

        if (who == "me") {
            control = '<li style="width:100%">' +
                '<div class="msj macro">' +
                '<div class="avatar"><img class="img-circle" style="width:100%;" src="' +
                me.avatar + '" /></div>' + '<div class="text text-l">' + "<p>" + text +
                "</p>" + "<p><small>" + date + "</small></p>" + "</div>" + "</div>" + "</li>";
        } else {
            control = '<li style="width:100%;">' +
                '<div class="msj-rta macro">' +
                '<div class="text text-r">' + "<p>" + text +
                "</p>" + "<p><small>" + date + "</small></p>" + "</div>" +
                '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' +
                you.avatar + '" /></div>' + "</li>";
        }
        setTimeout(function() {
            $("ul").append(control);
        }, time);
    }

    function resetChat() {
        $("ul").empty();
    }

    // user chat messages
    $(".mytext").on("keyup", function(e) {
        if (e.which == 13) {
            var text = $(this).val();
            if (text !== "") {
                insertChat("me", text);
                socket.emit("chat message", text);
                $(this).val("");
            }
        }
    });

    // agent chat messages
    socket.on("chat message", function(msg) {
        var values = msg.split(":");
        if (values[0] !== myUser) {
            insertChat("other", msg);
        }
    });

    $(".signOutButton").on("click", function(event) {
        socket.disconnect();
        $(".loginForm").show();
        $(".signUpPanel").fadeIn("slow");
        $(".chatContainer").fadeOut("slow");
        $(".signOutButton").hide();
        resetChat();
    });
});