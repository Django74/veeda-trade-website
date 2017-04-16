var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen(port, function() {
  console.log('Listening on port ', port);
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/admin.html');
})

io.on('connection', function(socket){
  // Add Firebase Admin SDK
  var admin = require("firebase-admin");

  // Initialize the SDK
  var serviceAccount = require("veeda-8bc58-firebase-adminsdk-1qjy6-70120435dd.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://veeda-8bc58.firebaseio.com"
  });

  socket.on('getUserAcc', function(uid){
    // Get user info
    admin.auth().getUser(uid)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully fetched user data:", userRecord.toJSON());
        var email = userRecord.email;
        var name = userRecord.displayName;
        io.emit('getUserAcc', email, name);
      })
      .catch(function(error) {
        console.log("Error fetching user data:", error);
      });
  });
});

/*
var server = http.createServer(function(req, res) {
  // Add Firebase Admin SDK
  var admin = require("firebase-admin");

  // Initialize the SDK
  var serviceAccount = require("veeda-8bc58-firebase-adminsdk-1qjy6-70120435dd.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://veeda-8bc58.firebaseio.com"
  });

  // uid for John Doe
  var uid = "etmu7YOuG1W5D3hNHnqdxIKm0853";
  admin.auth().getUser(uid)
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully fetched user data:", userRecord.toJSON());
      res.writeHead(200);
      res.write("Hello World\n");
      res.end(userRecord.displayName);
    })
    .catch(function(error) {
      console.log("Error fetching user data:", error);
    });
});

server.listen(3000);
*/
/*
  var uid = document.getElementById('some-user-id').value;

  admin.auth().deleteUser(uid)
    .then(function() {
      console.log("Successfully deleted user");
    })
    .catch(function(error) {
      console.log("Error deleting user: ", error);
    });
})
*/
