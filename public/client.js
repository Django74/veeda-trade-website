// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    var presetNick = '';
    if (document.cookie != '') {
        presetNick = document.cookie.substring(9);
    }
    socket.emit('new user', presetNick);

    $('form').submit(function(){
	    socket.emit('chat', $('#m').val());
	    $('#m').val('');
	    return false;
    });

    socket.on('chat', function(msg, nickname, hour, min, nameColor, flag){
        if (flag == 'bold') {
            $('#messages').append($('<li>').html('[' + hour + ":" + min + '] ' +
                '<span style="color:#' + nameColor + '">' + nickname + '</span>' +  ': ' + '<b>' + msg + '</b>'));
        }
        else {
            $('#messages').append($('<li>').html('[' + hour + ":" + min + '] ' +
                '<span style="color:#' + nameColor + '">' + nickname + '</span>' +  ': ' + msg));
        }
        $('#messagesWrap').scrollTop($('#messagesWrap')[0].scrollHeight);
    });

    socket.on('usernames', function(data){
        $('#users').html('');
        for(i = 0; i < data.length; i++) {
            $('#users').append($('<li>').text(data[i]));
        }
    });

    socket.on('sys msg', function(msg){
        $('#messages').append($('<li>').text('SYSTEM: ' + msg));
        $('#messagesWrap').scrollTop($('#messagesWrap')[0].scrollHeight);
    });

    socket.on('update username', function(data){
        $('#nickWrapper').html(data);
        document.cookie = 'username=' + data;
    })
});
