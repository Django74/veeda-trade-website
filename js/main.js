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
	
	$('#register-form').on('submit', function () {
		var email = document.getElementById('register-email').value;
		console.log(email);
		var password = document.getElementById('register-password').value;
		console.log(password);
		const promise = firebase.auth().createUserWithEmailAndPassword(email, password);
		promise
			.catch(e => console.log(e.message));
		
		firebase.auth().onAuthStateChanged(function(user) {
			if(user) {
				var user = firebase.auth().currentUser;	
				
				var database = firebase.database();
				database.ref('Users/' + user.uid).set({
					email: email,
					password: password
				});
			}
			else {
				console.log("No user signed in.")
			}
		});
			
		
		return false;
	});

});
