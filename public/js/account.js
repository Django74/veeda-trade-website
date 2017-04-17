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

function editPost(key){
	console.log(key);
}

function deletePost(key){
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

/* pagination */
$.fn.pageMe = function(opts){
    var $this = this,
        defaults = {
            perPage: 7,
            showPrevNext: false,
            numbersPerPage: 1,
            hidePageNumbers: false
        },
        settings = $.extend(defaults, opts);

    var listElement = $this;
    var perPage = settings.perPage;
    var children = listElement.children();
    var pager = $('.pagination');

    if (typeof settings.childSelector!="undefined") {
        children = listElement.find(settings.childSelector);
    }

    if (typeof settings.pagerSelector!="undefined") {
        pager = $(settings.pagerSelector);
    }

    var numItems = children.size();
    var numPages = Math.ceil(numItems/perPage);

    pager.data("curr",0);

    if (settings.showPrevNext){
        $('<li><a href="#" class="prev_link">«</a></li>').appendTo(pager);
    }

    var curr = 0;
    while(numPages > curr && (settings.hidePageNumbers==false)){
        $('<li><a href="#" class="page_link">'+(curr+1)+'</a></li>').appendTo(pager);
        curr++;
    }

    if (settings.numbersPerPage>1) {
        $('.page_link').hide();
        $('.page_link').slice(pager.data("curr"), settings.numbersPerPage).show();
    }

    if (settings.showPrevNext){
        $('<li><a href="#" class="next_link">»</a></li>').appendTo(pager);
    }

    pager.find('.page_link:first').addClass('active');
    if (numPages<=1) {
        pager.find('.next_link').hide();
    }
    pager.children().eq(1).addClass("active");

    children.hide();
    children.slice(0, perPage).show();

    pager.find('li .page_link').click(function(){
        var clickedPage = $(this).html().valueOf()-1;
        goTo(clickedPage,perPage);
        return false;
    });
    pager.find('li .prev_link').click(function(){
        previous();
        return false;
    });
    pager.find('li .next_link').click(function(){
        next();
        return false;
    });

    function previous(){
        var goToPage = parseInt(pager.data("curr")) - 1;
        goTo(goToPage);
    }

    function next(){
        goToPage = parseInt(pager.data("curr")) + 1;
        goTo(goToPage);
    }

    function goTo(page){
        var startAt = page * perPage,
            endOn = startAt + perPage;

        children.css('display','none').slice(startAt, endOn).show();

        if (page>=1) {
            pager.find('.prev_link').show();
        }
        else {
            pager.find('.prev_link').hide();
        }

        if (page<(numPages-1)) {
            pager.find('.next_link').show();
        }
        else {
            pager.find('.next_link').hide();
        }

        pager.data("curr",page);

        if (settings.numbersPerPage>1) {
            $('.page_link').hide();
            $('.page_link').slice(page, settings.numbersPerPage+page).show();
        }

        pager.children().removeClass("active");
        pager.children().eq(page+1).addClass("active");
    }
};

$('#items').pageMe({pagerSelector:'#myPager',childSelector:'tr',showPrevNext:true,hidePageNumbers:false,perPage:5});
/****/
