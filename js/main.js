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
		var year = $('#year').val();
		var title = $('#title').val();
		var price = $('#price').val();
		var km = $('#kilometers').val();
		var status = $('#radio').val();
		var make = $('#selectbasic').val();
		var model = $('#selectmodel').val();
		var color = $('#selectcolor').val();
		var description = $('#description').val();
		var newPostKey = firebase.database().ref().child('post').push().key;
		firebase.database().ref('Posts/Cars/'+ newPostKey).set({
			Year:year,
			Title:title,
			Kilometers:km,
			Status:status,
			Make:make,
			Model:model,
			Color:color,
			Description:description
		});
		e.preventDefault();
	});

});

$(document).ready(function(e) {
    $("#login-link").hide();
});

