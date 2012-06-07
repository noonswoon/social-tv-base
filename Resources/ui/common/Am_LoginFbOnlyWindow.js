var LoginFbOnlyWindow = function() {
		
	//UI STUFF
	var lWin = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Login",
		barColor: '#6d0a0c',
		layout: 'vertical'
	});
		
	var fbLoginButton = Ti.UI.createButton({
		title:'fb_login',
		top:5,
		width:200,
		height:40,
		visible:true
	});
	
	var fbLoginStatuslbl = Ti.UI.createLabel({
		text:'We will not auto-post to your account. ',
		font:{fontSize:14},
		height:'auto',
		top:10,
		textAlign:'center'
	});
	
	var whyFbBtn = Ti.UI.createButton({
		title:'Why Facebook?',
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
	lWin.add(fbLoginButton);
	lWin.add(fbLoginStatuslbl);
	lWin.add(whyFbBtn);
	
	lWin.add(label);
	lWin.add(registerPushNotifBtn);
	lWin.add(urbanAirshipUnregisterDeviceBtn);
	
	//FUNCTIONS CALLBACK
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
	fbLoginButton.addEventListener('click', function() {
		Ti.Facebook.authorize();
	});
	
	whyFbBtn.addEventListener('click', function() {
		var PlaceholderWindow = require('ui/common/PlaceholderWindow');
		var placeholderwin = new PlaceholderWindow();
		placeholderwin.open({modal:true});
	});
			
	Ti.include('helpers/facebookAuthenListeners.js'); //fb authen functionality		
	Ti.Facebook.addEventListener('login', facebookAuthenCallback); //facebookAuthenCallback def is in helpers/facebookAuthenListeners.js
	
	lWin.addEventListener('blur', function() {
		Ti.Facebook.removeEventListener('login',facebookAuthenCallback);
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
	
	return lWin;
};

module.exports = LoginFbOnlyWindow;

