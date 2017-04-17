//Autofills field based on previous data in database for user settings
$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function(user){
      if (user) {
        var user = firebase.auth().currentUser;
        var name;

        name = user.displayName;

        $("#username-display").html(name);

		//Showing user posts

		var userId = user.uid;
		var database = firebase.database();
		database.ref('Posts/Cars').once('value').then(function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var key = "" + childSnapshot.key;
				var childData = childSnapshot.val();//get car data
				var category = childSnapshot.val().Category;
				if (childData.User == userId){
					// populate myaccount with user posts
					var newRowData = "<tr> <td>"+ key +"</td> <td>" + childSnapshot.val().Title+ "</td><td>" + category + "</td> <td><a onclick='editPost(\""+key+"\")'>Edit</a></td> <td><a onclick='deletePost(\""+key+"\")'>Delete</a></td> </tr>"
					$('#items').append(newRowData);
				}
			});
		});
		database.ref('Posts/Furniture').once('value').then(function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var key = "" + childSnapshot.key;
				var childData = childSnapshot.val();//get car data
				var category = childSnapshot.val().Category;
				if (childData.User == userId){
					// populate myaccount with user posts
					var newRowData = "<tr> <td>"+ key +"</td> <td>" +childSnapshot.val().Title + "</td><td>"+ category+"</td> <td><a onclick='editPost(\""+key+"\")'>Edit</a></td> <td><a onclick='deletePost(\""+key+"\")'>Delete</a></td> </tr>"
					$('#items').append(newRowData);
				}
			});
		});

      }
      else {
        console.log(error);
      }
    });

});

var currentPostToEdit;

function editPost(currentKey){
	var database = firebase.database();

	database.ref('Posts/Cars').once('value').then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var key = "" + childSnapshot.key;
			childData = childSnapshot.val();//get car data
        
            //
            if (currentKey == key)
            {
                currentPostToEdit = currentKey;
                $('#editVehiclePost-modal').modal('toggle');
                
                //end loop
                return true;
            }
            
            
		});
	});

	database.ref('Posts/Furniture').once('value').then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var key = "" + childSnapshot.key;
			childData = childSnapshot.val();//get car data

            if (currentKey == key)
            {
                currentPostToEdit = currentKey;
                $('#editFurniturePost-modal').modal('toggle');
                //end loop
                return true;
            }
            
            
		});
	});
}

$( "#editVehiclePost-modal" ).on('show.bs.modal', function(e){
    console.log("TEST");
    
    var database = firebase.database();

    database.ref('Posts/Cars/' + currentPostToEdit).once('value').then(function(snapshot){
        console.log(currentPostToEdit);
        var key = "" + snapshot.key;
        var childData = snapshot.val();//get car data
        
        var title = childData.Title;
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
        
        $("#editVehiclePost-modal h1").html("Edit " + '<span style="font-size:25px">' + '"' + title + '"' + "</span>")
        $("#editVehiclePost-modal #sellerPhone").val(phone);
        $("#editVehiclePost-modal #title").val(title);
        $("#editVehiclePost-modal #price").val(price);
        $("#editVehiclePost-modal #year").val(year);
        $("#editVehiclePost-modal #kilometers").val(km);
        $("#editVehiclePost-modal #sellerAddress").val(address);

        if(status == "New")
        {
            $("#editVehiclePost-modal #radio-0").attr('checked',true);
        }
        
        else if(status == "Used")
        {
            $("#editVehiclePost-modal #radio-1").attr('checked',true);
        }   
        else if(status == "Lease Takeover")
        {
            $("#editVehiclePost-modal #radio-2").attr('checked',true);
        }
        
        //make and models
        if(make == "Acura")
        {
            $("#editVehiclePost-modal #selectMake option[value='Acura']").attr('selected',true);
            if(model=="ILX")
            {
                $("#editVehiclePost-modal #selectAcuraModel").show();
                $("#editVehiclePost-modal #selectAModel option[value='ILX']").attr('selected',true);
                
            }
            else if(model=="NSX")
            {
                $("#editVehiclePost-modal #selectAcuraModel").show();
                $("#editVehiclePost-modal #selectAModel option[value='NSX']").attr('selected',true);
            }
            
            else if(model=="MDX")
            {  
                $("#editVehiclePost-modal #selectAcuraModel").show();
                $("#editVehiclePost-modal #selectAModel option[value='MDX']").attr('selected',true);
            }
        }
        
        else if(make == "Honda")
        {   
            $("#editVehiclePost-modal #selectMake option[value='Honda']").attr('selected',true);
            if(model=="HR-V")
            {
                $("#editVehiclePost-modal #selectHondaModel").show();
                $("#editVehiclePost-modal #selectHModel option[value='HR-V']").attr('selected',true);
                
            }
            else if(model=="Accord Sedan")
            {
                $("#editVehiclePost-modal #selectHondaModel").show();
                $("#editVehiclePost-modal #selectHModel option[value='Accord Sedan']").attr('selected',true);
            }
            else if(model=="Odyssey")
            {
                $("#editVehiclePost-modal #selectHondaModel").show();
                $("#editVehiclePost-modal #selectHModel option[value='Odyssey']").attr('selected',true);
            }
        
        
        }
        
        if(color=="Black")
        {
            $("#editVehiclePost-modal #selectcolor option[value='Black']").attr('selected',true);
        }
        
        else if(color=="Silver")
        {
            $("#editVehiclePost-modal #selectcolor option[value='Silver']").attr('selected',true);
        }
        
        else if(color=="Red")
        {
            $("#editVehiclePost-modal #selectcolor option[value='Red']").attr('selected',true);
        }
        
        else if(color=="Blue")
        {
            $("#editVehiclePost-modal #selectcolor option[value='Blue']").attr('selected',true);
        }
        
        else if(color=="White")
        {
            $("#editVehiclePost-modal #selectcolor option[value='White']").attr('selected',true);
        }
        
        $("#editVehiclePost-modal #description").val(description);
       
        
    });

        
});

$("#editFurniturePost-modal").on('show.bs.modal', function(e){
    var database = firebase.database();

    database.ref('Posts/Furniture/' + currentPostToEdit).once('value').then(function(snapshot){
        var key = "" + snapshot.key;
        var childData = snapshot.val();//get car data
    
        //retrieve furniture post info
        var title = childData.Title;
        var description = childData.Description;
        var imageSource = childData.Source;
        var phone = childData.Phone;
        var postCategory = childData.Category;
        var price = childData.Price;
        var address = childData.Address;
       
        $("#editFurniturePost-modal-modal h1").html("Edit " + '<span style="font-size:25px">' + '"' + title + '"' + "</span>")
        $("#editFurniturePost-modal #sellerFurniturePhone").val(phone);
        $("#editFurniturePost-modal #furnitureTitle").val(title);
        $("#editFurniturePost-modal #furniturePrice").val(price);
        $("#editFurniturePost-modal #furnitureDescription").val(description);
        $("#editFurniturePost-modal #sellerFurnitureAddress").val(address);
		
        if(status == "New")
        {
            $("#editFurniturePost-modal #furniture-0").attr('checked',true);
        }
        
        else if(status == "Used")
        {
            $("#editFurniturePost-modal #furniture-1").attr('checked',true);
        }   
        else if(status == "Damaged")
        {
            $("#editFurniturePost-modal #furniture-2").attr('checked',true);
        }
		});
});

$('#editVehiclePost').click(function(e){
    console.log("hello");
        var noImage = false;
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
        if (make == "Honda")
            var model = $('#selectHModel').val();
        else
            var model = $('#selectAModel').val();

		var color = $('#selectcolor').val();
		var description = $('#description').val();
		var user = firebase.auth().currentUser;
		var database = firebase.database();
        //var newPostKey = firebase.database().ref().child('post').push().key;
		if (used == true){
			status = $('#radio-1').val();
		} else if( newCar == true){
			status = $('#radio-0').val();
		} else {
			status = $('#radio-2').val();
		}

        firebase.database().ref('Posts/Cars/'+ currentPostToEdit).update({
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
            Price: price,
        });
        
		e.preventDefault();

		// Display success message
		alert('Post has been successfully created!');
		$('#editVehiclePost-modal').modal('toggle');
});

$('#editFurniturePost').click(function(e){
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

        firebase.database().ref('Posts/Furniture/'+ currentPostToEdit).update({
            Phone: sellerPhone,
            Category: postCategory,
            Address: sellerAddress,
            Title:title,
            Status:status,
            Description:description,
            Price: price,
        });
		
		e.preventDefault();

		// Display success message
		alert('Post has been successfully created!');
		$('#editFurniturePost-modal').modal('toggle');


});

$("#cancelEditVehiclePost").click(function(e){
    $('#editVehiclePost-modal').modal('toggle');
});

$("#cancelEditFurniturePost").click(function(e){
    $('#editFurniturePost-modal').modal('toggle');
});
function deletePost(key){
	var r = confirm("Are you sure you want to delete?");
	if (r == true){
		var database = firebase.database();
		database.ref('Posts/Cars').once('value').then(function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var postKey = "" + childSnapshot.key;
				if (postKey == key){
					childSnapshot.ref.remove();
					alert("You have deleted the post");
					location.reload();
				}
			});
		});
		database.ref('Posts/Furniture').once('value').then(function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var postKey = "" + childSnapshot.key;
				if (postKey == key){
					childSnapshot.ref.remove();
					alert("You have deleted the post");
					location.reload();
				}
			});
		});
	}
	else {
	
	}
}

//Saves user data to the data base
$(function() {
    $('#account-info-btn').click(function(e){
        var user = firebase.auth().currentUser;

        // Retrieve updated information
        var newName = document.getElementById('name_field').value;
        var newEmail = document.getElementById('email_field').value;
        var newPass = document.getElementById('password_field').value;
        var verPass = document.getElementById('password2_field').value;
        var userProvidedPassword = document.getElementById('authPassword').value;

        // Re-authenticate user
        var credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          userProvidedPassword
        );

        user.reauthenticate(credential).then(function() {
          // Update user info along with the database
          if (newName != "") {
            user.updateProfile({
              displayName: newName
            }).then(function() {
              var userNameData = {
                Email: user.email,
                Name: user.displayName
              };
              var updates = {};
              updates['/Users/' + user.uid] = userNameData;
              firebase.database().ref().update(updates);
              alert("User updated");
        			location.reload();
            }), function(error) {
              alert("User could not be updated");
            }
          }
          if (newEmail != "") {
            user.updateEmail(newEmail).then(function() {
              var userEmailData = {
                Email: user.email,
                Name: user.displayName
              };
              var updates = {};
              updates['/Users/' + user.uid] = userEmailData;
              firebase.database().ref().update(updates);
              alert("User updated");
        			location.reload();
            }, function(error) {
              alert("Email could not be updated");
            });
          }
          if (newPass != "" && newPass == verPass) {
            user.updatePassword(newPass).then(function() {
              alert("User updated");
        			location.reload();
            }, function(error) {
              alert("Password could not be updated");
            });
          }
          $("#registrationForm")[0].reset()
        }, function(error) {
          console.log("Re-Authentication failed.");
          $("#registrationForm")[0].reset()
        });

        e.preventDefault();
    });
});

