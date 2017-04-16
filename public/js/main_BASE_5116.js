$(function() {
	var selectedFile;
	var postArray;
	var noImage = true;
    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

  $('#getUser').click(function(e) {
    // Get user information
    var user = firebase.auth().currentUser;
    console.log(user);
    var email, uid;
    if (user != null) {
      email = user.email;
      uid = user.uid;
    }
    console.log(email);
    console.log(uid);
  })

  $('#logout-button').click(function(e) {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("Sign out successful.");
    }).catch(function(error) {
      // An error happened.
      console.log("An error occurred with signing out.");
    });
  });

	$('#register-form').on('submit', function () {
    var username = document.getElementById('register-username').value;
		var email = document.getElementById('register-email').value;
		var password = document.getElementById('register-password').value;
    var confirm_password = document.getElementById('confirm-password').value;

    var database = firebase.database();

		if (password == confirm_password) {
			// Implementation for IF username has to be unique
	    /*
	    var uniqueName = true;
	    firebase.database().ref('/Users/').once('value').then(function(snapshot) {
	      console.log("TEST READ DATA");
	      var checkname = snapshot.val().username;
	      console.log(checkname);
	      if (username == checkname) {
	        uniqueName = false;
	      }
	    });
	    console.log(uniqueName);*/

	    // Check password matches confirm password and username is unique
	    //if (password == confirm_password && uniqueName == true)

			firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
	      var user = firebase.auth().currentUser;

	      firebase.database().ref('Users/' + user.uid).set({
	        Email: email,
	        Name: username
	      });

	      user.updateProfile({
	      displayName: username
	      }).then(function() {
	        // Update successful.
	      }, function(error) {
	        // An error happened.
	      });

				alert('Registration complete!');

	    }, function(error) {
	  			// Error Handling
	  			var errorCode = error.code;
	  			var errorMessage = error.message;
	  			if (errorCode == 'auth/email-already-in-use') {
	  				alert('Email is already in use.');
	  			}
	        else if (errorCode == 'auth/invalid-email') {
	          alert('Email address is not valid.');
	        }
	        else if (errorCode == 'auth/operation-not-allowed') {
	          alert('Email/Password Accounts currently disabled. Please try again later.');
	        }
	        else if (errorCode == 'auth/weak-password') {
	          alert('Password is not strong enough.');
	        }
	  			else {
	  				alert(errorMessage);
	  			}
	  			console.log(error);
	        console.log(error.message);
			});
		}

		else {
			alert('Passwords do not match.');
		}

    // TODO: Go to logged in page.
    return false;
	});

	$('#login-form').on('submit', function () {
		var email = document.getElementById('login-email').value;
		var password = document.getElementById('login-password').value;

		firebase.auth().signInWithEmailAndPassword(email, password)
		.then(function() {
			alert('Login successful!');
		})
		.catch(function(error) {
			// Error Handling
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode == 'auth/invalid-email') {
				alert('Email address is not valid.');
			}
      else if (errorCode == 'auth/user-disabled') {
        alert('User has been disabled.');
      }
      else if (errorCode == 'auth/user-not-found') {
        alert('No such user for given email.');
      }
      else if (errorCode == 'auth/wrong-password') {
        alert('Wrong password.');
      }
			else {
				alert(errorMessage);
			}
			console.log(error);
      console.log(error.message);
		});

    // TODO: Go to logged in page.
    return false;
	});

	firebase.auth().onAuthStateChanged(function(user) {
	if(user) {
		console.log(user);
		console.log("Email: " + user.email);
	}
	else {
		console.log("No user signed in.");
	}
	});

	$('#create').click(function(e){
		var status;
		var url;
		var downloadURL;
		var year = $('#year').val();
		var title = $('#title').val();
		var price = $('#price').val();
		var km = $('#kilometers').val();
		var used = document.getElementById('radio-1').checked;
		var newCar = document.getElementById('radio-0').checked;
		var lease = document.getElementById('radio-2').checked;
		var make = $('#selectMake').val();
		var model = $('#selectModel').val();
		var color = $('#selectcolor').val();
		var description = $('#description').val();
		var user = firebase.auth().currentUser;
		var newPostKey = firebase.database().ref().child('post').push().key;
		if (used == true){
			status = $('#radio-1').val();
		} else if( newCar == true){
			status = $('#radio-0').val();
		} else {
			status = $('#radio-2').val();
		}

		if(noImage == false){
			var filename = selectedFile.name;
			var storageRef = firebase.storage().ref('Posts/Cars/' + newPostKey +'/' + filename);
			var uploadTask = storageRef.put(selectedFile);

			// Register three observers:
			// 1. 'state_changed' observer, called any time the state changes
			// 2. Error observer, called on failure
			// 3. Completion observer, called on successful completion
			uploadTask.on('state_changed', function(snapshot){
			  // Observe state change events such as progress, pause, and resume
			  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			  console.log('Upload is ' + progress + '% done');
			  switch (snapshot.state) {
				case firebase.storage.TaskState.PAUSED: // or 'paused'
				  console.log('Upload is paused');
				  break;
				case firebase.storage.TaskState.RUNNING: // or 'running'
				  console.log('Upload is running');
				  break;
			  }
			}, function(error) {
			  // Handle unsuccessful uploads
			}, function() {
			  // Handle successful uploads on complete
			  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
			  downloadURL = uploadTask.snapshot.downloadURL;
			firebase.database().ref('Posts/Cars/'+ newPostKey).set({
				Source: downloadURL,
				Year:year,
				Title:title,
				Kilometers:km,
				Status:status,
				Make:make,
				Model:model,
				Color:color,
				Description:description,
				User: user.uid,
			});
			});
		}
		else{
			downloadURL = "";
			firebase.database().ref('Posts/Cars/'+ newPostKey).set({
				Source: downloadURL,
				Year:year,
				Title:title,
				Kilometers:km,
				Status:status,
				Make:make,
				Model:model,
				Color:color,
				Description:description,
				User: user.uid,
			});
		}
		e.preventDefault();

		// Display success message
		alert('Post has been successfully created!');
		$('#post-modal').modal('toggle');
	});

	$('#cancelPost').click(function(e){
		$('#post-modal').modal('toggle');
	});

	$('#file').on("change", function(e) {
		selectedFile = e.target.files[0];
		noImage = false;
	});


});

function retrieveData(){
	var database = firebase.database();

	database.ref('Posts/Cars').once('value').then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var key = "" + childSnapshot.key;
			var childData = childSnapshot.val();//get car data
			
			//retrieve car post info
			var title = childData.Title;
			var description = childData.Description;
			var imageSource = childData.Source;

			//add to recent posts
			addRecentPosts(title, description, imageSource);
		});
	});
}

//adds one recent post to recent post section
function addRecentPosts(title, description,imageSource){
	//if no picture, use default
	if(imageSource == "")
		imageSource = "images/samplePostImg.png";
	
	var html = 
	['<div class="col-sm-6">',
		'<div class="brdr bgc-fff pad-10 box-shad btm-mrg-20 item-listing">',
			'<div class="media">',
				'<a class="pull-left" href="#" target="_parent">',
					'<img width="365" height="365" alt="image" class="img-responsive" src=',
					imageSource,
					'></a>',

				'<div class="clearfix visible-sm"></div>',

				'<div class="media-body fnt-smaller">',
					'<a href="#" target="_parent"></a>',

					'<h4 class="media-heading">',
						'<a href="#" target="_parent">',
						//title variable
						title,
						
						//possible date variable
						//<small class="pull-right">Posted: Apr 12th 2017</small>
						'</a></h4>',


					'<ul class="list-inline mrg-0 btm-mrg-10 clr-535353">',
						'<li>Calgary</li>',

						'<li style="list-style: none">|</li>',

						'<li>Alberta</li>',

						'<li style="list-style: none">|</li>',

						'<li>Canada</li>',
					'</ul>',

					'<p class="hidden-xs">',
					description,
					'</p><span class="fnt-smaller fnt-lighter fnt-arial">Contact @: </span>',
				'</div>',
			'</div>',
		'</div>',
	'</div><!--End Column-->',]
	
	$('#recentPosts').append(html.join(''));
}