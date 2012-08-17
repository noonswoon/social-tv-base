var EnterUsernameWindow = function(_email,_firstName,_lastName) {
		
	//UI STUFF
	var lWin = Ti.UI.createWindow({
		title: "Signup",
		backgroundColor: 'gray',
		backgroundImage: '/images/bg.png',
		barColor: '#6d0a0c',
		layout: 'vertical',
		tabBarHidden: false,
		navBarHidden: false
	});

	var cbLogo = Ti.UI.createImageView({
		image: '/images/admin/chatterbox_logo.png',
		top: 60,
		width: 173, height: 56,
	});	
		
	var newUserLabel = Ti.UI.createLabel({
		text: 'CHOOSE YOUR USERNAME',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: 'bold' },
		color: 'white',
		shadowColor: '#999',
		top: 15,
		left: 50
	});	
	var usernameTextField = Ti.UI.createTextField({
	//	hintText: 'Choose your username',
		color: '#333',
		width: 220,
		height: 35,
		top: 5,
		font: { fontSize: 14},
		borderRadius: 5,
		backgroundColor: '#d0d0d0',
		maxLength: 16,
		paddingLeft: 5
	})
	
	var enterUsername = Ti.UI.createButton({
		backgroundImage: '/images/admin/button/buttons_register.png',
		top: 10,
		width: 222,
		height: 35,
	});

	var usernameHint = Ti.UI.createLabel({
		top: 5,
		left: 60,
		color: 'white',
		width: 220,
		font: { fontSize: 12},
		text: 'Choose a username that you want to show it to the world!'
	});
	
	//ADDING UI COMPONENTS TO WINDOW
	lWin.add(cbLogo);
	lWin.add(newUserLabel);
	lWin.add(usernameTextField);
	lWin.add(enterUsername);
	lWin.add(usernameHint);

	//EVENTS REGISTERING
	enterUsername.addEventListener('click', function() {
		Ti.API.info('usernameTextField.value = '+usernameTextField.value);
		//TODO: log the user not to space or keep the textfield blank:(
		if(usernameTextField.value===''|| usernameTextField.value.length<5 ||usernameTextField.value===undefined||!usernameTextField.value) 
			alert(L('Choose your username between 5 and 16 characters in length'));
		else {
			var providedUsername = usernameTextField.value;
			Debug.debug_print("Creating new user");
			Cloud.Users.create({
			    email: _email,
			    username: providedUsername,
			    first_name: _firstName,
			    last_name: _lastName,
			    password: Ti.Utils.md5HexDigest(_email+"ch@tterb0x").substr(0,10),
			    password_confirmation: Ti.Utils.md5HexDigest(_email+"ch@tterb0x").substr(0,10),
				custom_fields: {
					"device_token_id": UrbanAirship.getDeviceToken(),
					"mac_address": Ti.Platform.macaddress,
					"banned": false
				}
			}, function (e) {
			    if (e.success) {
			       	Debug.debug_print("succesfully created user"+JSON.stringify(e));
					
					//link with third party account
					var leaderBoardACS = require('acs/leaderBoardACS');
					var PushNotificationCTB = require('ctb/pushnotificationCTB');
					leaderBoardACS.leaderACS_createUserInfo(e.users[0]);
					PushNotificationCTB.pushNotificationCTB_createUserInfo(CTB_HEROKU_SERVER, CTB_HEROKU_ACCESS, e.users[0].id, e.users[0].username,UrbanAirship.getDeviceToken());				
					
					Cloud.SocialIntegrations.externalAccountLink({
					    type: 'facebook',
					    token: Ti.Facebook.accessToken
					}, function (e) {
					    if (e.success) {
					    	Ti.Analytics.featureEvent('registration.success');
					    	Titanium.App.Analytics.trackPageview('/registration.success');
					    	
					    	acs.setUserLoggedIn(e.users[0]);
							acs.setLoggedInStatus(true);
							
							var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
							Debug.debug_print("EnterUsernameWindow.js - creating new appTabGroup [watchout!]");				
							Ti.App.fireEvent('closeLoginTabGroup'); //done with login, close the tabgroup
							var maintabgroup = new ApplicationTabGroup();
							maintabgroup.open();
					    } else {
					    	Debug.debug_print(L('Linking external acct Error: ') + JSON.stringify(e));
					    	Ti.Analytics.featureEvent('registration.error');
					    	Titanium.App.Analytics.trackPageview('/registration.error');
					    	//ErrorHandling.showNetworkError();
					    }
					});
			    } else {
			    	acs.logout(function(e) { 
			    		Ti.API.info('logout in enterusername screen');
			    	}); //logout from chatterbox
			    	
			    	var a = Titanium.UI.createAlertDialog({
			       				title:L('Please try again'),
			         			message:e.message
			       			});
			       	a.show();

			    }
			});
		}
	});		
					
	var leaderboardCallBack = function(e) {
		var pointModel = require('model/point');
		pointModel.pointModel_updateLeadersFromACS(e.fetchedUser);
	};
	Ti.App.addEventListener("createLeaderBoardUser",leaderboardCallBack);
	
	return lWin;
};
module.exports = EnterUsernameWindow;