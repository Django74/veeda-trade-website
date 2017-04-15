// Add Firebase Admin SDK
var admin = require("firebase-admin");

// Initialize the SDK
var serviceAccount = require("veeda-8bc58-firebase-adminsdk-1qjy6-70120435dd.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://veeda-8bc58.firebaseio.com"
});

// Delete a user
$('#deleteUser').click(function(e) {
  // TODO: Retrieve uid
  var uid = document.getElementById('user-id').value;

  admin.auth().deleteUser(uid)
    .then(function() {
      console.log("Successfully deleted user");
    })
    .catch(function(error) {
      console.log("Error deleting user: ", error);
    });
})
