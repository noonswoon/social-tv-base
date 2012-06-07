var SettingWindow = function() {
	
	//UI STUFF
	var win = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Setting",
		barColor: '#6d0a0c',
		layout: 'vertical'
	});
		
	var fbLogoutButton = Ti.UI.createButton({
		title:'Logout',
		top:5,
		width:200,
		height:40,
		visible:true
	});
	
	var label = Ti.UI.createLabel({
		text:'Attempting to register with Apple for Push Notifications...',
		textAlign:'center',
		width:'auto'
	});
	
	var registerPushNotifBtn = Ti.UI.createButton({
		title:'Register device',
		top:10,
		width:200,
		height:40
	});
	
	var urbanAirshipUnregisterDeviceBtn = Ti.UI.createButton({
		title:'Unregister device from UA',
		top:10,
		width:200,
		height:40
	});
	
	//ADDING UI COMPONENTS TO WINDOW
	win.add(fbLogoutButton);
	win.add(label);
	win.add(registerPushNotifBtn);
	win.add(urbanAirshipUnregisterDeviceBtn);
	
	
	//CALLBACK FUNCTIONS	
	function logoutCallback(event) {
		if(event.success) {
			Ti.API.info("successfully logged out");
			//TODO: future-->close the tabgroup before openning login window
			
			//go to login page
			var LoginFbOnlyWindow = require('ui/common/Am_LoginFbOnlyWindow');	
			var loginwin = new LoginFbOnlyWindow();
			loginwin.open();   
		} else {
			Ti.API.info("something wrong with logout mechanism");
		}
	}
	
	//function
	function successNotifCallback(e) {
		var deviceToken = e.deviceToken;
		label.text = "Device registered. Device token: "+deviceToken;
		alert("Push notification device token is: "+deviceToken);
		alert("Push notification types: "+Titanium.Network.remoteNotificationTypes);
		alert("Push notification enabled: "+Titanium.Network.remoteNotificationsEnabled);
		
		UrbanAirship.registerDeviceToken(deviceToken);   
	}
	
	function errorNotifCallback(e) {
    	alert("Error during registration: " + e.error);
	}
	
	function messageNotifCallback(e) {
		// called when a push notification is received.
		alert("Received a push notification\n\nPayload:\n\n"+JSON.stringify(e.data));
		var message;
		if(e['aps'] != undefined) {
			if(e['aps']['alert'] != undefined){
				if(e['aps']['alert']['body'] != undefined){
					message = 'mickey: '+e['aps']['alert']['body'];
				} else {
					message = 'minnie: '+e['aps']['alert'];
				}
			} else {
				message = 'mary: No Alert content';
			}
		} else {
			message = 'mack: No APS content';
		}
		alert(message);	
	}	
	
	//EVENTS REGISTERING		
	fbLogoutButton.addEventListener('click', function() {
		Ti.Facebook.logout(); //logout from fb
		acs.logout(logoutCallback); //logout from chatterbox
	});
	
	registerPushNotifBtn.addEventListener('click', function() {
		// register for push notifications
		Titanium.Network.registerForPushNotifications({
			types:[
		        Titanium.Network.NOTIFICATION_TYPE_BADGE,
		        Titanium.Network.NOTIFICATION_TYPE_ALERT,
		        Titanium.Network.NOTIFICATION_TYPE_SOUND
		    ],
		    success: successNotifCallback, //successful registration will call this fn
		    error: errorNotifCallback, //failed registration will call this
		    callback: messageNotifCallback //when receive the message will call this fn
		});			
	});
	
	urbanAirshipUnregisterDeviceBtn.addEventListener('click', function() {
		UrbanAirship.unRegisterDeviceToken();
	});
	
	return win;
};

module.exports = SettingWindow;

