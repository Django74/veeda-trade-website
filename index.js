var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var nicknames = [];
var chatLog = [];

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

// listen to 'chat' messages
io.on('connection', function(socket){
    socket.on('chat', function(msg){
        if (msg.substring(0, 11) == '/nickcolor ') {
            socket.color = msg.substring(11);
            socket.emit('sys msg', 'Nickname color changed!');
        }
        else if (msg.substring(0,6) == '/nick ') {
            var taken = false;
            // Check if nickname is already taken
            for (let i = 0; i < nicknames.length; i++) {
                if (nicknames[i] == msg.substring(6)){
                    taken = true;
                }
            }

            if (taken == false) {
                // Update nicknames with new name
                for (let i = 0; i < nicknames.length; i++) {
                    if (socket.nickname == nicknames[i]) {
                        nicknames[i] = msg.substring(6);
                        socket.nickname = msg.substring(6);
                    }
                }
                socket.emit('update username', socket.nickname);
                socket.emit('sys msg', 'You are ' + socket.nickname + '.');
                io.emit('usernames', nicknames);
            }
            else {
                socket.emit('sys msg', 'Nickname already taken. Please try a different name.');
            }
        }
        else {
            var date = new Date();
            var timeHours = date.getHours()+'';
            while (timeHours.length < 2) timeHours = "0" + timeHours;
            var timeMinutes = date.getMinutes()+'';
            while (timeMinutes.length < 2) timeMinutes = "0" + timeMinutes;
            socket.broadcast.emit('chat', msg, socket.nickname, timeHours, timeMinutes, socket.color, 'normal');
            socket.emit('chat', msg, socket.nickname, timeHours, timeMinutes, socket.color, 'bold');

            // Store message into memory
            let msgMem = [msg, socket.nickname, timeHours, timeMinutes, socket.color];
            chatLog.push(msgMem);
        }
    });
    socket.on('new user', function(nick){
        // If cookie stored a nickname, use that
        if (nick != '') {
            socket.nickname = nick;
            nicknames.push(socket.nickname);
        }
        else {
            // Assign new user a default nickname
            do {
                var randID = Math.floor((Math.random() * 99999999) + 1);
            } while(nicknames.indexOf('guest' + randID) != -1);
            socket.nickname = 'guest' + randID;
            nicknames.push(socket.nickname);
        }

        // Load chat log history
        for (let i = 0; i < chatLog.length; i++) {
            socket.emit('chat', chatLog[i][0], chatLog[i][1], chatLog[i][2], chatLog[i][3], chatLog[i][4], 'normal');
        }

        // Add new username to list of online users and display assigned nickname to user.
        socket.emit('update username', socket.nickname);
        socket.emit('sys msg', 'You are ' + socket.nickname + '.');
        io.emit('usernames', nicknames);
        socket.color = '';
    });
    socket.on('disconnect', function(){
        var i = nicknames.indexOf(socket.nickname);
        nicknames.splice(i, 1);
        io.emit('usernames', nicknames);
    });
});
