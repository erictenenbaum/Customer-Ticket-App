$(document).ready(function() {
    var me = {};
    me.avatar = "http://www.petsworld.in/blog/wp-content/uploads/2014/09/funny-cat.jpg";

    var you = {};
    you.avatar = "http://media.graytvinc.com/images/810*456/Dog380.jpg";

    var socket = io();
    var currentAgent;

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
                // send data to the server 
                socket.emit("new user", userInfo);
                // make the server send open and active tickets
                socket.emit("active tickets");
                socket.emit("open tickets");
            },
            error: function(data) {
                alert(data.responseText);
            }
        });
    });

    $(".signUpButton").on("click", function(event) {
        $.ajax({
            url: "/agent/signup",
            type: "POST",
            data: $(".agentSignupForm").serialize(),
            // response from the server
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

    // chat messages properties
    function insertChat(room, who, text, time) {
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
            $("#" + room + ".chatBoard").append(control);
        }, time);
    }

    // event listener for chat messages
    socket.on("chat message", function(msg) {
        var values = msg.split(":");
        var info = values[0].split(",");
        // info[1] is the user, info[0] is the room number, values[1] is the message
        if (info[0] !== currentAgent.agent_first_name) {
            insertChat(info[1], "other", info[0] + ":" + values[1]);
        }
    });

    // populate data to our Active Call dashboard from the server
    socket.on("active tickets", function(data) {
        $("#activeCallLists").empty();
        var hasAgentActiveTickets = false;

        for (var i = 0; i < data.length; i++) {
            if (data[i].agent === currentAgent.agent_first_name) {
                hasAgentActiveTickets = true;
            }
            // html updates for the active dashboard
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
        // this will fade out when there are no more active tickets from the agents
        if (!hasAgentActiveTickets) {
            $(".chatPanel").fadeOut("slow");
        }
    });

    // populate data to our Open Call dashboard from the server
    socket.on("open tickets", function(data) {
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

    socket.on("user disconnected", function(room) {
        var currentSelected = $(".list-group > .list-group-item.selected");
        var itemToRemove = $("#" + room + ".list-group-item");
        itemToRemove.remove();
        // if the item to be removed is the current selected, 
        // the first room on the list will be selected
        if (currentSelected[0] === itemToRemove[0]) {
            $(".list-group > .list-group-item:first").trigger("click");
        }
        // chat window will be removed
        $("#" + room + ".chatContainer").remove();
    });

    // reload when agent sign out, this would refresh the connection and all the event-listener
    $(".signOutButton").on("click", function(event) {
        $(".loginForm").show();
        $(".signUpPanel").fadeIn("slow");
        $(".chatPanel").fadeOut("slow");
        $(".dashboard").fadeOut("slow");
        $(".signOutButton").hide();
        location.reload();
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

        socket.emit("assign agent", userInfo);

        // generates html for the the chat board
        $(".list-group").append('<li class="list-group-item" id="' + room + '">' + room + '</li>');
        $(".multipleChatContainer").append(
            '<div class="chatContainer" id="' + room + '">' +
            '<ul class="chatBoard" id="' + room + '"></ul>' +
            '<div>' +
            '<div class="msj-rta macro">' +
            '<div class="text text-r">' +
            '<input class="mytext" id="' + room + '" placeholder="Type a message"/>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');

        // agent chat messages on key up event
        $("#" + room + ".mytext").on("keyup", function(e) {
            var room = $(this).attr("id");
            if (e.which == 13) {
                var text = $(this).val();
                if (text !== "") {
                    insertChat(room, "me", text);
                    socket.emit("room chat message", text, room);
                    $(this).val("");
                }
            }
        });

        if ($(".chatPanel").css("display") === "none") {
            showChatContainer(room);
        }

        $(".list-group > #" + room + ".list-group-item").trigger("click");
        $(".chatPanel").fadeIn("slow");
    });

    $(".list-group").on("click", ".list-group-item", function(event) {
        $(".list-group > .list-group-item").each(function() {
            $(this).removeClass("selected");
        });
        var room = $(this).attr("id");
        $(this).addClass("selected");
        showChatContainer(room);
    });

    // this part is for the chat display 
    function showChatContainer(room) {
        $(".chatContainer").each(function() {
            $(this).css("display", "none");
        });
        $("#" + room + ".chatContainer").css("display", "block");
    }
});