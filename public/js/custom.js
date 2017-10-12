$(function() {
  var socket = io();

  function scrollToBottom() {
    var messages = $("#messages");
    var newMessage = messages.children("li:last-child");

    var clientHeight = messages.prop("clientHeight");
    var scrollTop = messages.prop("scrollTop");
    var scrollHeight = messages.prop("scrollHeight");
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    console.log('scrolling');
    if (
      clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
      scrollHeight
    ) {
      messages.scrollTop(scrollHeight);
    }
  }

  $("#message-form").on("submit", function(e) {
    e.preventDefault();
    console.log("push");
    var messsage = $("[name=message]");
    socket.emit(
      "createMessage",
      {
        text: messsage.val()
      },
      function() {
        messsage.val("");
      }
    );
  });

  socket.on("connect", function() {
    const params = $.deparam(window.location.search);
    const name = params.name.toLowerCase();
    console.log("name=>", name);
    socket.emit("join", name, function(err) {
      if (err) {
        alert(err);
        window.location.href = "/";
      } else {
        console.log("No error");
      }
    });
  });

  socket.on("newMessage", function(message) {
    var template = $("#message-template").html();
    var time = moment(message.createdAt).format("H:MM:ss");
    var html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: time
    });
    $("#messages").append(html);
    scrollToBottom();
  });
});
