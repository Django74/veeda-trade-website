$(function() {

	var selectedFile;
	var postArray;
	var noImage = true;

	// Check for if a user is signed in
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			$("#accountElem").removeAttr('hidden');
			$("#logoutElem").removeAttr('hidden');

			$("#welcome-txt").append(user.displayName + '.');
			$("#welcomeElem").removeAttr('hidden');
		} else {
			$("#loginElem").removeAttr('hidden');
		}
	});

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("login-form").trigger("reset");
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

	/* Debugging purposes
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
	*/

  $('#logout-button').click(function(e) {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("Sign out successful.");
			location.reload();
    }).catch(function(error) {
      // An error happened.
      console.log("An error occurred with signing out.");
    });
  });

 	$('#searchButton').click(function(e) {
		var searchText = $('#searchBox').val();
		searchInfo(searchText);
		e.preventDefault();
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
			location.reload();
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

	/* For debugging
	firebase.auth().onAuthStateChanged(function(user) {
	if(user) {
		console.log(user);
		console.log("Email: " + user.email);
	}
	else {
		console.log("No user signed in.");
	}
});*/

	$('#createVehiclePost').click(function(e){
		var status;
		var url;
		var downloadURL;
		var postCategory = "Vehicle";
		var sellerPhone = $('#sellerPhone').val();
		var sellerAddress = $('#sellerAddress').val();
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
				Phone: sellerPhone,
				Category: postCategory,
				Address: sellerAddress,
				Year:year,
				Title:title,
				Kilometers:km,
				Status:status,
				Make:make,
				Model:model,
				Color:color,
				Description:description,
				User: user.uid,
				Price: price,
			});
			});
		}
		else{
			downloadURL = "";
			firebase.database().ref('Posts/Cars/'+ newPostKey).set({
				Source: downloadURL,
				Phone: sellerPhone,
				Category: postCategory,
				Address: sellerAddress,
				Year:year,
				Title:title,
				Kilometers:km,
				Status:status,
				Make:make,
				Model:model,
				Color:color,
				Description:description,
				User: user.uid,
				Price: price,
			});
		}
		e.preventDefault();

		// Display success message
		alert('Post has been successfully created!');
		$('#createVehiclePost-modal').modal('toggle');
	});

	$('#createFurniturePost').click(function(e){
		var status;
		var url;
		var postCategory = "Furniture";
		var downloadURL;
		var sellerPhone = $('#sellerFurniturePhone').val();
		var sellerAddress = $('#sellerFurnitureAddress').val();
		var title = $('#furnitureTitle').val();
		var price = $('#furniturePrice').val();
		var used = document.getElementById('furniture-1').checked;
		var newFurniture = document.getElementById('furniture-0').checked;
		var damage = document.getElementById('furniture-1').checked;
		var description = $('#furnitureDescription').val();
		var newPostKey = firebase.database().ref().child('post').push().key;
		var user = firebase.auth().currentUser;
		if (used == true){
			status = $('#furniture-1').val();
		} else if( newFurniture == true){
			status = $('#furniture-0').val();
		} else {
			status = $('#furniture-2').val();
		}

		if(noImage == false){
			var filename = selectedFile.name;
			var storageRef = firebase.storage().ref('Posts/Furniture/' + newPostKey +'/' + filename);
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
			firebase.database().ref('Posts/Furniture/'+ newPostKey).set({
				Source: downloadURL,
				Phone: sellerPhone,
				Category: postCategory,
				Address: sellerAddress,
				Title:title,
				Status:status,
				Description:description,
				User: user.uid,
				Price: price,
			});
			});
		}
		else{
			downloadURL = "";
			firebase.database().ref('Posts/Furniture/'+ newPostKey).set({
				Source: downloadURL,
				Phone: sellerPhone,
				Category: postCategory,
				Address: sellerAddress,
				Title:title,
				Status:status,
				Description:description,
				User: user.uid,
				Price: price,
			});
		}
		e.preventDefault();

		// Display success message
		alert('Post has been successfully created!');
		$('#createFurniturePost-modal').modal('toggle');


	});
	$('#cancelVehiclePost').click(function(e){
		$('#createVehiclePost-modal').modal('toggle');
	});

	$('#cancelFurniturePost').click(function(e){
		$('#createFurniturePost-modal').modal('toggle');
	});

	$('#vehicleFile').on("change", function(e) {
		selectedFile = e.target.files[0];
		noImage = false;
	});

	$('#furnitureFile').on("change", function(e) {
		selectedFile = e.target.files[0];
		noImage = false;
	});

	$('#viewFurniturePosts').click(function(e) {
		$('#recentPosts').empty();
		var database = firebase.database();
		database.ref('Posts/Furniture').once('value').then(function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var key = "" + childSnapshot.key;
				var childData = childSnapshot.val();//get car data
				$('#postsText').text("Furniture posts");
				//retrieve car post info
				var title = childData.Title;
				var description = childData.Description;
				var imageSource = childData.Source;
				var phone = childData.Phone;
				var postCategory = childData.Category;
				var price = childData.Price;
				addRecentPosts(title, description, imageSource, phone, postCategory, price);

			});
		});

	});

	$('#viewVehiclePosts').click(function(e) {
		$('#recentPosts').empty();
		var database = firebase.database();
		database.ref('Posts/Cars').once('value').then(function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var key = "" + childSnapshot.key;
				var childData = childSnapshot.val();//get car data
				$('#postsText').text("Vehicle posts");
				//retrieve car post info
				var title = childData.Title;
				var description = childData.Description;
				var imageSource = childData.Source;
				var phone = childData.Phone;
				var postCategory = childData.Category;
				var price = childData.Price;
				addRecentPosts(title, description, imageSource, phone, postCategory, price);
			});
		});

	});



	$( "#viewPost-modal" ).on('show.bs.modal', function(e){
		console.log(currentTitle);
		populatePost(currentTitle); //populate post with our data
	});

	$( "#viewFurniturePost-modal" ).on('show.bs.modal', function(e){
		console.log(currentTitle + "this is the furniturepost modal show function");
		populateFurniturePost(currentTitle); //populate post with our data
	});
});

//current title of post to be viewed
var currentTitle;

//saves title of post to be viewed
function saveTitle(title){
	currentTitle = title;
}

//reads data from database and adds to recent posts
function retrieveData(){
	var database = firebase.database();

	database.ref('Posts/Cars').once('value').then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var key = "" + childSnapshot.key;
			childData = childSnapshot.val();//get car data

			//retrieve car post info
			var title = childData.Title;
			var description = childData.Description;
			var imageSource = childData.Source;
			var phone = childData.Phone;
			var postCategory = childData.Category;
			var price = childData.Price;
			//add to recent posts
			addRecentPosts(title, description, imageSource, phone, postCategory, price);
		});
	});

	database.ref('Posts/Furniture').once('value').then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var key = "" + childSnapshot.key;
			childData = childSnapshot.val();//get car data

			//retrieve car post info
			var title = childData.Title;
			var description = childData.Description;
			var imageSource = childData.Source;
			var phone = childData.Phone;
			var postCategory = childData.Category;
			var price = childData.Price;

			//add to recent posts
			addRecentPosts(title, description, imageSource, phone, postCategory, price);
		});
	});


}

//adds one recent post to recent post section
function addRecentPosts(title, description, imageSource, phone, postCategory, price){
	//if no picture, use default
	if(imageSource == "")
		imageSource = "images/samplePostImg.png";

	var postType;

	if (postCategory =="Vehicle")
	{
		postType = "#viewPost-modal";
	}
	else if(postCategory =="Furniture")
	{
		postType = "#viewFurniturePost-modal";
	}

	$('#recentPosts').append(
		// Post container
		$('<div/>')
			.addClass("brdr bgc-fff pad-10 box-shad btm-mrg-20 item-listing")
			// Image Display
			.append(
				$('<div/>')
					.addClass("media")
					.append(
						$('<a/>')
							// Image link
							.addClass("pull-left")
							.attr("href", "#")
							.attr("target", "_parent")
							// Image Source
							.append(
								$('<img>')
									.attr("alt", "image")
									.attr("src", imageSource)
									.attr("style", "cursor:default;pointer-events: painted;")
									.addClass("img-responsive")
							)
					)
					.append(
						$('<div/>')
							.addClass("clearfix visible-sm")
					)
					// Text Display
					.append(
						$('<div/>')
							.addClass("media-body fnt-smaller")
							.append(
								$('<a/>')
									.attr("href", "#")
									.attr("target", "_parent")
							)
							// Post Title

							.append(
								$('<h4>')
									.addClass("media-heading")
									.append(
										$('<a/>')
										.attr("href", postType)
										.attr("id", "postTitle")
										.attr("target", "_parent")
										.attr("onclick", "saveTitle(this.text);")
										.attr("data-toggle", "modal")
										.attr("data-target", postType)
										.html(title)
									)
							)
							// Location
							.append(
								$('<ul>')
									.addClass("list-inline mrg-0 btm-mrg-10 clr-535353")
									.append(
										$('<li/>')
										.html('<font color="green">' + "$" + numberWithCommas(price) + '</font>')
									)
							)
							//Description
							.append(
								$('<p/>')
									.addClass("hidden-xs")
									.html(description)
							)
							// Contact Info
							.append(
								$('<span/>')
									.addClass("fnt-smaller fnt-lighter fnt-arial")
									.html("Contact: " + phone)
							)
					)
			)
	)
}

//search function for site
function searchInfo(search){
	$('#recentPosts').empty();
	var foundResult = false;
	var database = firebase.database();
	database.ref('Posts/Cars').once('value').then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var key = "" + childSnapshot.key;
			var childData = childSnapshot.val();//get car data

			//retrieve car post info
			var title = childData.Title;
			var description = childData.Description;
			var imageSource = childData.Source;
			var phone = childData.Phone;
			var make = childData.Make;
			var model = childData.Model;
			var postCategory = childData.Category;
			var price = childData.Price;

			var text = search.toLowerCase();
			if(title.toLowerCase().includes(text) || description.toLowerCase().includes(text) || make.toLowerCase().includes(text) || model.toLowerCase().includes(text)){
				//add to recent posts
				foundResult = true;
				addRecentPosts(title, description, imageSource, phone, postCategory, price);
			}
			if (foundResult == false){
				$('#postsText').text("No search results");
			}
			else{
				$('#postsText').text("Search results");
			}
		});
	});

	database.ref('Posts/Furniture').once('value').then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var key = "" + childSnapshot.key;
			var childData = childSnapshot.val();//get car data

			//retrieve car post info
			var title = childData.Title;
			var description = childData.Description;
			var imageSource = childData.Source;
			var phone = childData.Phone;
			var postCategory = childData.Category;
			var price = childData.Price;

			var text = search.toLowerCase();
			if(title.toLowerCase().includes(text) || description.toLowerCase().includes(text)){
				//add to recent posts
				foundResult = true;
				addRecentPosts(title, description, imageSource, phone, postCategory, price);
			}
			if (foundResult == false){
				$('#postsText').text("No search results");
			}
			else{
				$('#postsText').text("Search results");
			}
		});
	});
}

//fills data for post to be viewed
function populatePost(currentTitle){
	var database = firebase.database();

	database.ref('Posts/Cars').once('value').then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var key = "" + childSnapshot.key;
			var childData = childSnapshot.val();//get car data
			var title = childData.Title;

			//if post we want matches post to be viewed
			if(currentTitle == title)
			{
				//retrieve car post info
				var description = childData.Description;
				var imageSource = childData.Source;
				var phone = childData.Phone;
				var address =childData.Address;
				var	year = childData.Year;
				var km = childData.Kilometers;
				var status = childData.Status;
				var	make = childData.Make;
				var model = childData.Model;
				var color = childData.Color;
				var price = childData.Price;

				//populate post
				$('#viewPost-modal h2').text(title);
				$('#description p').text(description);
				$('#image img').attr('src', imageSource);
				$('#carPrice td:nth-child(2)').text("$" + numberWithCommas(price));
				$('#carStatus td:nth-child(2)').text(status);
				$('#carYear td:nth-child(2)').text(year);
				$('#carMake td:nth-child(2)').text(make);
				$('#carModel td:nth-child(2)').text(model);
				$('#carColor td:nth-child(2)').text(color);
				$('#carKm td:nth-child(2)').text(km);

				//populate username and email
				database.ref('Users/' + childData.User).on('value', function(snapshot) {
					$('#sellerName td:nth-child(2)').text(snapshot.val().Name);
					$('#sellerEmail td:nth-child(2)').text(snapshot.val().Email);
					$('#sellerPhone td:nth-child(2)').text(phoneNumberWithDashes(phone));
				});
				//end loop
				return true;
			}
		});
	});

}


//fills data for  furniture post to be viewed
function populateFurniturePost(currentTitle){
	var database = firebase.database();

	database.ref('Posts/Furniture').once('value').then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var key = "" + childSnapshot.key;
			var childData = childSnapshot.val();//get car data
			var title = childData.Title;

			//if post we want matches post to be viewed
			if(currentTitle == title)
			{
				//retrieve car post info
				var description = childData.Description;
				var imageSource = childData.Source;
				var phone = childData.Phone;
				var address =childData.Address;
				var status = childData.Status;
				var price = childData.Price;

				//populate post
				$('#viewFurniturePost-modal h2').text(title);
				$('#description p').text(description);
				$('#image img').attr('src', imageSource);
				$('#furniturePrice td:nth-child(2)').text("$" + numberWithCommas(price));
				$('#furnitureStatus td:nth-child(2)').text(status);

				//populate username and email
				database.ref('Users/' + childData.User).on('value', function(snapshot) {
					$('#sellerName td:nth-child(2)').text(snapshot.val().Name);
					$('#sellerEmail td:nth-child(2)').text(snapshot.val().Email);
					$('#sellerPhone td:nth-child(2)').text(phoneNumberWithDashes(phone));
				});
				//end loop
				return true;
			}
		});
	});



}

//function to replace number with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function phoneNumberWithDashes(phone){
	return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}
