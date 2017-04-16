$(function() {
    var socket = io();
    $('#adminForm').submit(function(){
      if ($_POST['actionUsr'] == "GET USER INFO") {
        socket.emit('getUserAcc', $('#userID').val());
      }
      else if ($_POST['actionUsr'] == "DELETE USER") {
        socket.emit('delUserAcc', $('#userID').val());
      }
      else if ($_POST['actionUsr'] == "TOGGLE USER ACCESS") {
        socket.emit('togUserAcc', $('#userID').val());
      }
      $('#userID').val('');
      return false;
    });
    socket.on('getUserAcc', function(email, name){
      // Display user information on page
      $('#user-name').val(name);
      $('#user-mail').val(email);
    });
    socket.on('delUserAcc', function(msg){
      // Display deletion result
    });
    socket.on('togUserAcc', function(msg){
      // Display toggle result
    });
});
