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
var FbAutoPostACS = require('acs/fbAutoPostACS');
var ErrorHandling = require('helpers/errorHandling');

//GLOBAL VARIABLES DECARATION
Ti.Facebook.appid = "197422093706392";
Ti.Facebook.permissions = ['publish_stream','publish_actions', 'email'];
Ti.Facebook.forceDialogAuth = true; //fb sso not working on actual device

var IS_ON_DEVICE = true;
var IS_PRODUCTION_BUILD = false;

var ACS_API_KEY = '8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr';
if(IS_PRODUCTION_BUILD)
	ACS_API_KEY = '5va2XsGjknLebugvozPZfZr9xhSVEZl1';
var CACHE_TIMEOUT_SHORT = 30;  //for topic, comments - 30 mins
var CACHE_TIMEOUT_MEDIUM = 60 * 6;  //for tvprograms, num checkins ~ 6 hours
var CACHE_TIMEOUT_LONG = 60 * 24 * 30;  //for levels, badges, ~ 1 month

var ONE_LINE_LENGTH = 300; //use for determining the topic's height (#lines) in messageboard
var CONTENT_LENGTH = 160;

var CHARACTER_PER_LINE = 40; //use for commentReplyTableViewRow
var DEFAULT_CTB_IMAGE_URL = 'http://a0.twimg.com/profile_images/2208934390/Screen_Shot_2012-05-11_at_3.43.35_PM.png';

var friendRequests = [];



/*
Ti.App.addEventListener('pause', function(){
	Ti.API.info('pause..suspend the program');
});
*/

// This is a single context application with mutliple windows in a stack
var NoInternetWindow = require('ui/common/Am_NoInternetConnectivity');
var nointernetwin = null;

var launchTheApp = function() {
	FbAutoPostACS.fbAutoPostACS_AutoPostValue();
	Cloud.Users.showMe(function (e) {        
		if (e.success) {
			Debug.debug_print("should go to maintab screen");
			
			var userEmail = e.users[0].email;
			Cloud.Users.logout(function (e) {
			    if (e.success) {
			    	Debug.debug_print("logging out to login again: password: "+Ti.Utils.md5HexDigest(userEmail+"ch@tterb0x").substr(0,10));
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
							Debug.debug_print("ReloggingIn Error: "+JSON.stringify(e));
							ErrorHandling.showNetworkError();
					    }
					}); 
			    } else {
			        Debug.debug_print('Logout Error: '+((e.error && e.message) || JSON.stringify(e)));
			        ErrorHandling.showNetworkError();
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
};

var launchTheAppWrapper = function() {
	Ti.API.info('resuming the app from appjs..');
	if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
		var connectivityWarningDialog = Titanium.UI.createAlertDialog({
			title:'No Internet Connection',
			message:'Please come online and join the Chatterbox experience.'
		});
		nointernetwin = new NoInternetWindow();
		nointernetwin.open();
		connectivityWarningDialog.show();
	} else {
		if(nointernetwin !== null) {
			nointernetwin.close();
			nointernetwin = null;
			Ti.API.info('closing no internet window: appjs');
		}
		//remove the event listener
		Ti.App.removeEventListener('resume', launchTheAppWrapper);
		launchTheApp();
	}
};

(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	//Ti.API.info('Welcome to Chatterbox for ' + osname);
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	
	if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
		var connectivityWarningDialog = Titanium.UI.createAlertDialog({
			title:'No Internet Connection',
			message:'Please come online and join the Chatterbox experience.'
		});
		connectivityWarningDialog.show();
		Ti.App.addEventListener('resume', launchTheAppWrapper);
	} else {
		launchTheApp();
	} 
})();
