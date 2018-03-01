$(document).ready(function() {
    var me = {};
    me.avatar = "http://www.petsworld.in/blog/wp-content/uploads/2014/09/funny-cat.jpg";

    var you = {};
    you.avatar = "http://media.graytvinc.com/images/810*456/Dog380.jpg";

    var socket = io();
    var chatSocket = io();
    var currentAgent;

    // once clicked, call jquery ajax method
    $(".loginButton").on("click", function(event) {
        $.ajax({
            url: "/agent/login",
            type: "POST",
            data: $(".loginForm").serialize(),
            success: function(agent) {
                $(".loginForm").hide();
                $(".signOutButton").show();
                $(".signUpPanel").fadeOut("slow");
                $(".dashboard").fadeIn("slow");

                currentAgent = agent;
                var userInfo = {
                    username: agent.agent_first_name,
                    room: 0,
                    agent: true
                };
                socket.emit("new user", userInfo);
                socket.emit("active tickets");
                socket.emit("open tickets");
            },
            error: function(data) {
                alert(data.responseText);
            }
        });
    });

    // once clicked, call jquery ajax method
    $(".signUpButton").on("click", function(event) {
        $.ajax({
            url: "/agent/signup",
            type: "POST",
            data: $(".agentSignupForm").serialize(),

            success: function(agent) {
                $(".loginForm").hide();
                $(".signOutButton").show();
                $(".signUpPanel").fadeOut("slow");
                $(".dashboard").fadeIn("slow");

                currentAgent = agent;
                var userInfo = {
                    username: agent.agent_first_name,
                    room: 0,
                    agent: true
                };
                socket.emit("new user", userInfo);
                socket.emit("active tickets");
                socket.emit("open tickets");
            },
            error: function(data) {
                alert(data.responseText);
            }
        });
    });

    // chat messages 
    function insertChat(who, text, time) {
        if (time === undefined) {
            time = 0;
        }
        var control = "";
        var date = moment().format("LT");

        if (who == "me") {
            control =
                '<li style="width:100%">' +
                '<div class="msj macro">' +
                '<div class="avatar"><img class="img-circle" style="width:100%;" src="' +
                me.avatar +
                '" /></div>' +
                '<div class="text text-l">' +
                "<p>" +
                text +
                "</p>" +
                "<p><small>" +
                date +
                "</small></p>" +
                "</div>" +
                "</div>" +
                "</li>";
        } else {
            control =
                '<li style="width:100%;">' +
                '<div class="msj-rta macro">' +
                '<div class="text text-r">' +
                "<p>" +
                text +
                "</p>" +
                "<p><small>" +
                date +
                "</small></p>" +
                "</div>" +
                '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' +
                you.avatar +
                '" /></div>' +
                "</li>";
        }
        setTimeout(function() {
            $("ul").append(control);
        }, time);
    }

    function resetChat() {
        $("ul").empty();
    }

    // agent chat messages
    $(".mytext").on("keyup", function(e) {
        if (e.which == 13) {
            var text = $(this).val();
            if (text !== "") {
                insertChat("me", text);
                chatSocket.emit("chat message", text);
                $(this).val("");
            }
        }
    });

    // customer chat messages
    chatSocket.on("chat message", function(msg) {
        var values = msg.split(":");
        if (values[0] !== currentAgent.agent_first_name) {
            insertChat("other", msg);
        }
    });

    // populate data to our Active Call dashboard
    socket.on("active tickets", function(data) {
        console.log("data", data);
        $("#activeCallLists").empty();
        for (var i = 0; i < data.length; i++) {
            $("#activeCallLists").append(
                "<tr>" +
                '<td id="agentName">' +
                data[i].agent +
                "</td>" +
                '<td id="clientName">' +
                data[i].user +
                "</td>" +
                '<td id="ticketNumber">' +
                data[i].room +
                "</td>" +
                "</tr>"
            );
        }
    });

    // populate data to our Open Call dashboard
    socket.on("open tickets", function(data) {
        console.log("data", data);
        $("#openCallLists").empty();
        for (var i = 0; i < data.length; i++) {
            $("#openCallLists").append(
                "<tr>" +
                '<td id="ticketNumber">' +
                data[i].room +
                "</td>" +
                '<td id="clientName">' +
                data[i].user +
                "</td>" +
                '<td id="ticketNumber"><button type="button" id="' +
                data[i].room +
                '"class="btn-default assignButton">Assign To Me</button></td>' +
                "</tr>"
            );
        }
    });

    // disconnect from the server once button is pressed
    $(".signOutButton").on("click", function(event) {
        socket.disconnect();
        chatSocket.disconnect();
        $(".loginForm").show();
        $(".signUpPanel").fadeIn("slow");
        $(".chatContainer").fadeOut("slow");
        $(".dashboard").fadeOut("slow");
        $(".signOutButton").hide();
    });

    // transfer data to the active call from the open call dashboard once assigned button is click
    $("#openCallLists").on("click", ".assignButton", function(event) {
        var room = $(this).attr("id");
        var userInfo = {
            username: currentAgent.agent_first_name,
            room: parseInt(room),
            agent: true,
            id: currentAgent.id
        };
        chatSocket.emit("new user", userInfo);
        resetChat();
        $(".chatContainer").fadeIn("slow");
    });

    $("#openCallLists").on("click", ".assignedButton", function(event) {
        var room = $(this).attr("id");
        var userInfo = {
            username: currentAgent.agent_first_name,
            room: parseInt(room),
            agent: true,
            id: currentAgent.id
        };
        chatSocket.emit("assign agent", userInfo);
        resetChat();
        $(".chatContainer2").fadeIn("slow");
    });



});