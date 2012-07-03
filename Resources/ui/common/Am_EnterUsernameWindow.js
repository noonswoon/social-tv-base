var EnterUsernameWindow = function(_email,_firstName,_lastName) {
		
	//UI STUFF
	var lWin = Ti.UI.createWindow({
		title: "Signup",
		backgroundColor: 'gray',
		backgroundImage: '/images/admin/cb_back.png',
		barColor: '#6d0a0c',
		layout: 'vertical',
		tabBarHidden: false,
		navBarHidden: false
	});
		
	var usernameTextField = Ti.UI.createTextField({
		hintText: 'Choose your username',
		width: 220,
		height: 35,
		top: 30,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
		color: '#666',
		borderRadius: 5,
		backgroundColor: '#d0d0d0'
	})
	
	var enterUsername = Ti.UI.createButton({
		//title:'Register',
		backgroundImage: '/images/admin/button/buttons_register.png',
		top: 10,
		width: 161,
		height: 39,
	});
	
	//ADDING UI COMPONENTS TO WINDOW
	lWin.add(usernameTextField);
	lWin.add(enterUsername);

	//EVENTS REGISTERING
	enterUsername.addEventListener('click', function() {ะ
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
				var NotificationTrackACS = require('acs/notificationTrackACS');
				var pointModel = require('model/point');
				
				leaderBoardACS.leaderACS_createUserInfo(e.users[0]);
				NotificationTrackACS.notificationTrackACS_createUserInfo(e.users[0].id);
				
				var leaderboardCallBack = function(e) {
					pointModel.pointModel_updateLeadersFromACS(e.fetchedUser);
				};
				Ti.App.addEventListener("createLeaderBoardUser",leaderboardCallBack);
				
				//
				Cloud.SocialIntegrations.externalAccountLink({
				    type: 'facebook',
				    token: Ti.Facebook.accessToken
				}, function (e) {
				    if (e.success) {
				    	Debug.debug_print("successfully linked with fb acct");
				    	//Ti.API.info('link external acct successful');
				    	acs.setUserLoggedIn(e.users[0]);
						acs.setLoggedInStatus(true);
						
						var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
						Debug.debug_print("EnterUsernameWindow.js - creating new appTabGroup [watchout!]");				
						Ti.App.fireEvent('closeLoginTabGroup'); //done with login, close the tabgroup
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