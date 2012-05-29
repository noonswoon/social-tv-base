var EnterUsernameWindow = function() {
		
	//UI STUFF
	var lWin = Ti.UI.createWindow({
		title: "Login",
		backgroundColor: 'gray',
		barColor: '#6d0a0c',
		layout: 'vertical'
	});
		
	var usernameTextField = Ti.UI.createTextField({
		hintText: 'Choose your username',
		width: 200,
		height: 40,
		top: 5,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
		borderRadius: 5,
		backgroundColor: 'white'
	})
	
	var enterUsername = Ti.UI.createButton({
		title:'Register',
		top:5,
		width:200,
		height:40,
	});
	
	
	//ADDING UI COMPONENTS TO WINDOW
	lWin.add(usernameTextField);
	lWin.add(enterUsername);

	//EVENTS REGISTERING		
	enterUsername.addEventListener('click', function() {
		var providedUsername = usernameTextField.value;
		alert('attempt to register username: '+usernameTextField.value);
		//update user-provided username and email address from graph api
		Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
		    if (e.success) {
		    	var fbGraphObj = JSON.parse(e.result)
		        var email = fbGraphObj.email;
		        //need to ask explicitly for username from the user
		        //UPDATING THE ACCOUNT WITH EMAIL PROVIDED BY FB GRAPH API
		        Cloud.Users.update({username: providedUsername,email: email} , function (e) {
				    if (e.success) {
				        acs.setUserLoggedIn(e.users[0]);
						acs.setLoggedInStatus(true);
				        var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');					
						new ApplicationTabGroup().open();
				    } else {
				        alert({title: 'Registration Error', message:e.message});				    	
				    }
				});
			} else if (e.error) {
		        Ti.API.info(e.error);
		    } else {
		        Ti.API.info('Unknown response');
		    }
		});
	});
	
	
	return lWin;
	
};

module.exports = EnterUsernameWindow;