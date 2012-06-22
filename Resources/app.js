// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

Ti.include('/lib/date.js');
Ti.include('/lib/rankingScore.js');
Ti.include('/lib/TiPreloader.js');

var moment = require('/lib/moment');
Ti.include('/lib/cacheFromRemote.js');

//include xxxACS.js here
//include xxx models here

//GLOBAL VARIABLES DECARATION
Ti.Facebook.appid = "269019986525306"; //actual id: 197422093706392
Ti.Facebook.permissions = ['publish_stream','publish_actions', 'email'];
Ti.Facebook.forceDialogAuth = true; //fb sso not working on actual device

var IS_ON_DEVICE = false;
var CACHE_TIMEOUT_IN_MINUTES = 1; 
var ONE_LINE_LENGTH = 300; //use for determining the topic's height (#lines) in messageboard
	
var acs = require('lib/acs');
var UrbanAirship = require('lib/UrbanAirship');

var Debug = require('lib/debug');
var Cloud = require('ti.cloud');
var PullToRefresh = require('nl.icept.pull2refresh');

var myCurrentCheckinPrograms = ['CTB_PUBLIC']; //should be reset every hour to empty array
var friendRequests = [];

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
	
	
	//Google Analytics
	
	//Set up analytics
	Titanium.include('analytics.js');
	var analytics = new Analytics('UA-32782163-1');
	// Call the next function if you want to reset the analytics to a new first time visit.
	// This is useful for development only and should not go into a production app.
	//analytics.reset();

	// The analytics object functions must be called on app.js otherwise it will loose it's context
	Titanium.App.addEventListener('analytics_trackPageview', function(e){
		analytics.trackPageview('/Chatterbox' + e.pageUrl);
	});

	Titanium.App.addEventListener('analytics_trackEvent', function(e){
		analytics.trackEvent(e.category, e.action, e.label, e.value);
	});


	// I've set a global Analytics object to contain the two functions to make it easier to fire the analytics events from other windows
	Titanium.App.Analytics = {
		trackPageview:function(pageUrl){
			Titanium.App.fireEvent('analytics_trackPageview', {pageUrl:pageUrl});
		},
		trackEvent:function(category, action, label, value){
			Titanium.App.fireEvent('analytics_trackEvent', {category:category, action:action, label:label, value:value});
		}
	}

	// Starts a new session as long as analytics.enabled = true
	// Function takes an integer which is the dispatch interval in seconds
	analytics.start(10);
	
	////////////////////////////
	
	
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
