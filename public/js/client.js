$(function() {
    var socket = io();
    $('#adminForm button').click(function(e){
      e.preventDefault()
      if ($(this).attr("value") == "get-button") {
        socket.emit('getUserAcc', $('#userID').val());
      }

      if ($(this).attr("value") == "del-button") {
        socket.emit('delUserAcc', $('#userID').val());
      }

      if ($(this).attr("value") == "tog-button") {
        socket.emit('togUserAcc', $('#userID').val());
      }

      $('#userID').val('');
      return false;
    });
    socket.on('getUserAcc', function(email, name){
      // Display user information on page
      $('#user-name').html(name);
      $('#user-mail').html(email);
    });
    socket.on('delUserAcc', function(uid){
      // Display deletion result
      alert("Account with uid " + uid + " deleted!");
    });
    socket.on('togUserAcc', function(msg){
      // Display toggle result
      alert("User has been successfully " + msg + "!");
    });
});
