// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

Ti.include('/lib/date.js');
Ti.include('/model/topic.js');

//include xxxACS.js here
//include xxx models here

//GLOBAL VARIABLES DECARATION
var acs = require('lib/acs');
var Cloud = require('ti.cloud');
Titanium.Facebook.appid = "197422093706392";
Titanium.Facebook.permissions = ['publish_stream', 'read_stream', 'email'];


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

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup().open();
})();
