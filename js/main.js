$(function() {
	var selectedFile;
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

  /* Pseudo-code for log out.
  $('#logout-button').click(function(e) {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  });
  */

	$('#register-form').on('submit', function () {
		var email = document.getElementById('register-email').value;
		console.log(email);
		var password = document.getElementById('register-password').value;
		console.log(password);
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
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

    // TODO: Close modal and go to logged in page.
		return false;
	});

	$('#login-form').on('submit', function () {
		var email = document.getElementById('login-email').value;
		console.log(email);
		var password = document.getElementById('login-password').value;
		console.log(password);
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
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
		});

    // TODO: Close modal and go to logged in page.
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
		var make = $('#selectbasic').val();
		var model = $('#selectmodel').val();
		var color = $('#selectcolor').val();
		var description = $('#description').val();
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
			});
		}
		e.preventDefault();
	});
	
	$('#file').on("change", function(e) {
		selectedFile = e.target.files[0];
		noImage = false;
	});
	
	
});

