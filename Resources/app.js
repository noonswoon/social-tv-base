// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

Ti.include('lib/date.js');
Ti.include('lib/rankingScore.js');
Ti.include('lib/TiPreloader.js');
Ti.include('lib/cacheFromRemote.js');
Ti.include('lib/analytics.js');
Ti.include('lib/analyticsSetup.js');	

var moment = require('lib/moment');
var acs = require('lib/acs');
var UrbanAirship = require('lib/UrbanAirship');
var Debug = require('lib/debug');
var PullToRefresh = require('nl.icept.pull2refresh');
var Cloud = require('ti.cloud');
var UserCheckinTracking = require('lib/userCheckinTracking');


//GLOBAL VARIABLES DECARATION
Ti.Facebook.appid = "197422093706392";
Ti.Facebook.permissions = ['publish_stream','publish_actions', 'email'];
Ti.Facebook.forceDialogAuth = true; //fb sso not working on actual device

var IS_ON_DEVICE = true;
var CACHE_TIMEOUT_IN_MINUTES = 1; 
var ONE_LINE_LENGTH = 300; //use for determining the topic's height (#lines) in messageboard

var CHARACTER_PER_LINE = 40; //use for commentReplyTableViewRow
var DEFAULT_CTB_IMAGE_URL = 'http://a0.twimg.com/profile_images/2208934390/Screen_Shot_2012-05-11_at_3.43.35_PM.png';

var friendRequests = [];

/*
Ti.App.addEventListener('pause', function(){
	Ti.API.info('pause..suspend the program');
});
*/

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	Ti.API.info('Welcome to Chatterbox for ' + osname);
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
		
	Cloud.Users.showMe(function (e) {        
		if (e.success) {
			Debug.debug_print("should go to maintab screen");
			
			var userEmail = e.users[0].email;
			Cloud.Users.logout(function (e) {
			    if (e.success) {
			    	Ti.API.info("logging out to login again: password: "+Ti.Utils.md5HexDigest(userEmail+"ch@tterb0x").substr(0,10));
			    	Cloud.Users.login({
						login: userEmail,
					    password: Ti.Utils.md5HexDigest(userEmail+"ch@tterb0x").substr(0,10),
					}, function (e) {
						if (e.success) {
							Debug.debug_print("logging in again..successful");
							
							acs.setUserLoggedIn(e.users[0]);
							acs.setLoggedInStatus(true);
							
							var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
							Debug.debug_print("app.js - creating new appTabGroup [watchout!]");
							var maintabgroup = new ApplicationTabGroup();
							maintabgroup.open();
						} else {
							alert("ReloggingIn Error: "+JSON.stringify(e));
					    }
					}); 
			    } else {
			        alert('Logout Error: '+((e.error && e.message) || JSON.stringify(e)));
			    }
			});
	    } else {
	    	Debug.debug_print("should go to login screen");
			Ti.Facebook.logout(); //just to be save
			var LoginTabGroup = require('ui/common/Am_LoginTabGroup');
			var logintabgroup = new LoginTabGroup();
			logintabgroup.open();
   		}
    });
})();
