var EnterUsernameWindow = function(_email,_firstName,_lastName) {
		
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
		Cloud.Users.create({
		    email: _email,
		    username: providedUsername,
		    first_name: _firstName,
		    last_name: _lastName,
		    password: Ti.Utils.md5HexDigest(_email+"ch@tterb0x").substr(0,10),
		    password_confirmation: Ti.Utils.md5HexDigest(_email+"ch@tterb0x").substr(0,10)
		}, function (e) {
		    if (e.success) {
		        //Ti.API.info('user created: '+JSON.stringify(e));
				
				//link with third party account
				Cloud.SocialIntegrations.externalAccountLink({
				    type: 'facebook',
				    token: Ti.Facebook.accessToken
				}, function (e) {
				    if (e.success) {
				    	//Ti.API.info('link external acct successful');
				    	acs.setUserLoggedIn(e.users[0]);
						acs.setLoggedInStatus(true);
						
						var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
						var maintabgroup = new ApplicationTabGroup();
						maintabgroup.open();
				    } else {
				        alert('Linking external acct Error: ' + ((e.error && e.message) || JSON.stringify(e)));
				    }
				});
		    } else {
		    	var a = Titanium.UI.createAlertDialog({
		       				title:'Please try again',
		         			message:e.message
		       			});
		       	a.show();
		    }
		});
	});		
	return lWin;
};

module.exports = EnterUsernameWindow;