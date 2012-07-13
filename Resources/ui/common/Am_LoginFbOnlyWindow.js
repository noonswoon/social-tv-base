var LoginFbOnlyWindow = function() {
		
	//UI STUFF
	var self = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/admin/cb_back.png',
		title: "Login",
		barColor: '#398bb0',
		layout: 'vertical',
		tabBarHidden: true,
		navBarHidden: true
	});
	var cbLogo = Ti.UI.createImageView({
		image: '/images/admin/chatterbox_logo.png',
		top: 100,
		width: 173, height: 56,
	});	
	var cbLabel = Ti.UI.createLabel({
		text: 'Changing the way you watch TV',
		top: 5,
		height: 30,
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#8b8b8b'
	});
	var fbLoginButton = Ti.UI.createButton({
		top: 5,
		width: 200,
		height: 39,
		backgroundImage: '/images/admin/button/fb_button_login.png',
		visible: true
	});	
	
	var fbLoginStatuslbl = Ti.UI.createLabel({
		text:'We will not auto-post to your account.',
		color: '#fff',
		font:{fontSize:13, },
		height:'auto',
		top: 150,
		textAlign:'center'
	});
	
	var whyFbBtn = Ti.UI.createButton({
		backgroundImage: '/images/admin/button/button_whyfb.png',
		top:7,
		width:145,
		height:27,
		visible:true
	});
	
	var registerPushNotifBtn = Ti.UI.createButton({
		title:'Register device',
		top:0,
		width:200,
		height:20
	});
	
	var label = Ti.UI.createLabel({
		text:'Attempting to register with Apple for Push Notifications...',
		textAlign:'center',
		width:'auto',
		backgroundColor: 'white'
	});
	
	var urbanAirshipUnregisterDeviceBtn = Ti.UI.createButton({
		title:'Unregister device from UA',
		top:0,
		width:200,
		height:20
	});
	
	//ADDING UI COMPONENTS TO WINDOW
	self.add(cbLogo);
	self.add(cbLabel);
	self.add(fbLoginButton);
	self.add(fbLoginStatuslbl);
	self.add(whyFbBtn);
	
//	self.add(registerPushNotifBtn);
//	self.add(label);
//	self.add(urbanAirshipUnregisterDeviceBtn);
	
	//FUNCTIONS CALLBACK
	function successNotifCallback(e) {
		var deviceToken = e.deviceToken;
		label.text = "Device registered. Device token: "+deviceToken;
		debug_print("Push notification device token is: "+deviceToken);
		debug_print("Push notification types: "+Titanium.Network.remoteNotificationTypes);
		debug_print("Push notification enabled: "+Titanium.Network.remoteNotificationsEnabled);
		
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
	
	//EVENTS REGISTERING		
	fbLoginButton.addEventListener('click', function() {
		Ti.Facebook.authorize();
	});
	
	whyFbBtn.addEventListener('click', function() {
		var WhyFbWindow = require('ui/common/Am_WhyFbWindow');
		var whyfbwin = new WhyFbWindow();
		self.containingTab.open(whyfbwin);
	});
			
	Ti.include('helpers/facebookAuthenListeners.js'); //fb authen functionality		
	Ti.Facebook.addEventListener('login', facebookAuthenCallback); //facebookAuthenCallback def is in helpers/facebookAuthenListeners.js
	//do Ti.Facebook.removeEventListener('login', xxx) in Am_LoginTabGroup file (when the tab is about to close)
	
	
	
	urbanAirshipUnregisterDeviceBtn.addEventListener('click', function() {
		UrbanAirship.unRegisterDeviceToken();
	});
	
	return self;
};

module.exports = LoginFbOnlyWindow;

