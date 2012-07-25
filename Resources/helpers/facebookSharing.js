function showRequestResult(e) {
	
	var s = '';
	if (e.success) {
		Ti.API.info(e);
		s = "SUCCESS";
		if (e.result) s += "; " + e.result;
		if (e.data) s += "; " + e.data;
		if (!e.result && !e.data) s = '"success", but no data from FB.  I am guessing you cancelled the dialog.';
	} else
	if (e.cancelled) s = "fb cancel dialog";
	else {
		s = "fb FAIL dialog";
		if (e.error) s += "; " + e.error;	
	}
	Ti.API.info(s);
}	
	

//tickers
var checkinAppearOnFaceBook = function() {
	 	var data = {
		 tv_program: "http://chatterbox.mobi/opengraph/og_tvprogram_obj.html",
		 access_token: Titanium.Facebook.accessToken
		  };
		  Titanium.Facebook.requestWithGraphPath("/me/og_chatterbox:check_in",data,"POST",showRequestResult);

}
exports.checkinAppearOnFaceBook = checkinAppearOnFaceBook;

var newTopicAppearOnFacebook = function() {
	var data = {
		topic: "http://chatterbox.mobi/opengraph/og_topic_obj.html",
		access_token: Titanium.Facebook.accessToken
	};
	Titanium.Facebook.requestWithGraphPath("/me/og_chatterbox:create",data,"POST",showRequestResult);
}
exports.newTopicAppearOnFacebook = newTopicAppearOnFacebook;

var unlockBadgeAppearOnFacebook = function() {
	var data = {
		badge: "http://chatterbox.mobi/opengraph/og_badge_obj.html",
		access_token: Titanium.Facebook.accessToken
	};
	Titanium.Facebook.requestWithGraphPath("/me/og_chatterbox:unlock",data,"POST",showRequestResult);
}
exports.unlockBadgeAppearOnFacebook = unlockBadgeAppearOnFacebook;

var riseRankAppearOnFacebook = function() {
	var data = {
		rank: "http://chatterbox.mobi/opengraph/og_rank_obj.html",
		access_token: Titanium.Facebook.accessToken
	};
	Titanium.Facebook.requestWithGraphPath("/me/og_chatterbox:rise",data,"POST",showRequestResult);
}
exports.riseRankAppearOnFacebook = riseRankAppearOnFacebook;4

exports.badgePopUpOnFacebook = function(_badgeId) {
	var SettingHelper = require('helpers/settingHelper');
	unlockBadgeAppearOnFacebook();
	if(_badgeId === 0 || _badgeId === '0') return; //DONT post the first badge, since the checkin already did the fb posting
	if(_badgeId === 1 || _badgeId === '1') return; //DONT post the second badge, since the checkin already did the fb posting

	if(SettingHelper.getFacebookShare()) {
		var user = acs.getUserLoggedIn();
		var BadgeModel = require('model/badge');
		var badge = BadgeModel.fetchedBadgeSearch(String(_badgeId));
	
		var data = {
			link: "http://chatterbox.mobi/",
			name: user.first_name+" "+user.last_name+" has unlocked a new badge: "+badge.title,
			message: "",
			caption: "Chatterbox",
			picture: badge.url,
			description: badge.desc
		};
		if(SettingHelper.getFacebookAutoPost()) Titanium.Facebook.requestWithGraphPath('me/feed', data, 'POST', showRequestResult);
		else Titanium.Facebook.dialog("feed", data, showRequestResult);
	}
}

//send request via facebook to friend who dont have this app:(
exports.sendRequestOnFacebook = function(_fbId) {
	var SettingHelper = require('helpers/settingHelper');
	if(SettingHelper.getFacebookShare()) {
		var user = acs.getUserLoggedIn();
	 	var data = {
	 		app_id: '269019986525306',
	    	message: 'Check out this apps!',
	    	redirect_uri: 'http://chatterbox.mobi/',
	    	to: _fbId
	 	};
	
		Titanium.Facebook.dialog("apprequests", data, showRequestResult);
	}
}

exports.checkinPopUpOnFacebook = function(_checkin,_programPhoto) {
	var SettingHelper = require('helpers/settingHelper');
	if(SettingHelper.getFacebookShare()) {
		var user = acs.getUserLoggedIn();
		var data = {
			link: "http://chatterbox.mobi/",
			name: user.first_name+" "+user.last_name+" has checked in to "+_checkin.event.name,
			message: "",
			caption: "Chatterbox",
			picture: _programPhoto,
			description: ""
		};
		if(SettingHelper.getFacebookAutoPost()) Titanium.Facebook.requestWithGraphPath('me/feed', data, 'POST', showRequestResult);
		else Titanium.Facebook.dialog("feed", data, showRequestResult);
	}
	checkinAppearOnFaceBook();
}

exports.levelUpPopUpOnFacebook = function(_levelTitle) {	
	var SettingHelper = require('helpers/settingHelper');
	if(SettingHelper.getFacebookShare()) {
		var user = acs.getUserLoggedIn();
		var data = {
			link: "http://chatterbox.mobi/",
			name: user.first_name+" "+user.last_name+" has reach a new TV experience level!",
			message: "",
			caption: "Chatterbox",
			picture: DEFAULT_CTB_IMAGE_URL,
			description: _levelTitle
		};
		Titanium.Facebook.dialog("feed", data, showRequestResult);
	}
	riseRankAppearOnFacebook();
}

exports.cookAppearOnFaceBook = function() {
		// var SettingHelper = require('helpers/settingHelper');
//	if(SettingHelper.getFacebookShare()) {
	 	var data = {
		 recipe: "http://chatterbox.mobi/opengraph/og_cook_obj_dynamic.php",
		 access_token: Titanium.Facebook.accessToken
		  };
// 
		  Titanium.Facebook.requestWithGraphPath("/me/og_chatterbox:cook",data,"POST",showRequestResult);	
}


exports.postAppearOnFaceBook = function(_topicTitle,_topicContent,_programPhoto) {
	var SettingHelper = require('helpers/settingHelper');	
	if(SettingHelper.getFacebookShare()) {
		var user = acs.getUserLoggedIn();
		var data = {
			link: "http://chatterbox.mobi/",
			name: user.first_name+" posted a new discussion '"+_topicTitle+"'",
			message: "",
			caption: "",
			picture: _programPhoto,
			topic: "http://chatterbox.mobi/opengraph/og_post_obj_dynamic.php",
			access_token: Titanium.Facebook.accessToken,
			description: _topicContent
		};
		// Titanium.Facebook.requestWithGraphPath("/me/og_chatterbox:post",data,"POST",showRequestResult);
		Titanium.Facebook.dialog("feed", data, showRequestResult);
	}
	newTopicAppearOnFacebook();
}

