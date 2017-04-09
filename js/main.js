$(function() {

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
			else {
				alert(errorMessage);
			}
			console.log(error);
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
			if (errorCode == 'auth/email-already-in-use') {
				alert('Email is already in use.');
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
        console.log("running");
		var year = $('#year').val();
		firebase.database().ref('Posts/').set({
			Year:year
		});
		e.preventDefault();
	});

});
