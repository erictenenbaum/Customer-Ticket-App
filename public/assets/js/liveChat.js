$(document).ready(function() {
    console.log("ready!");

    $(".liveChatButton").on("click", function() {
        $(".userMessage").fadeOut("slow");

        $(".chatPanel").fadeIn("slow");
    });
});