//:D
// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

Ti.include('/lib/date.js');
Ti.include('/lib/rankingScore.js');
Ti.include('/lib/TiPreloader.js');

var moment = require('/lib/moment');

//include xxxACS.js here
//include xxx models here

//GLOBAL VARIABLES DECARATION
Titanium.Facebook.appid = "197422093706392";
Titanium.Facebook.permissions = ['publish_stream','publish_actions', 'read_stream', 'email'];

var CACHE_TIMEOUT_IN_MINUTES = 1; 
var ONE_LINE_LENGTH = 300; //use for determining the topic's height (#lines) in messageboard

var acs = require('lib/acs');
var Cloud = require('ti.cloud');

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

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
			acs.setUserLoggedIn(e.users[0]);
			acs.setLoggedInStatus(true);
			Ti.API.info('should go to tab group page');
			var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
			var maintabgroup = new ApplicationTabGroup();
			maintabgroup.open();
	    } else {
	    	Ti.API.info("should go to login page");
			Ti.Facebook.logout(); //just to be save
			var LoginFbOnlyWindow = require('ui/common/Am_LoginFbOnlyWindow');	
			var loginwin = new LoginFbOnlyWindow();
			loginwin.open();   			
   		}
    });

})();
