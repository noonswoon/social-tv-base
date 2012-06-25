function showRequestResult(e) {
	var s = '';
	if (e.success) {
		alert(e);
		s = "SUCCESS";
		if (e.result) s += "; " + e.result;
		if (e.data) s += "; " + e.data;
		if (!e.result && !e.data) s = '"success", but no data from FB.  I am guessing you cancelled the dialog.';
	} else
	if (e.cancelled) s = "CANCELLED";
	else {
		s = "FAIL";
		if (e.error) s += "; " + e.error;	
	}
	alert(s);
}	
	

exports.badgePopUpOnFacebook = function(_badgeId) {
	var SettingHelper = require('helpers/settingHelper');
	
	if(SettingHelper.getFacebookShare()) {
		var user = acs.getUserLoggedIn();
		var BadgeModel = require('model/badge');
		var badge = BadgeModel.fetchedBadgeSearch(String(_badgeId));
	
		var data = {
			link: "http://chatterbox.mobi/",
			name: user.first_name+" "+user.last_name+" has unlocked new a badge: "+badge.title,
			message: "",
			caption: "Chatterbox",
			picture: badge.url,
			description: badge.desc
		};
		Titanium.Facebook.dialog("feed", data, showRequestResult);
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

exports.checkinPopUpOnFacebook = function(_checkin) {
	Ti.API.info(_checkin);	
	var SettingHelper = require('helpers/settingHelper');
	
	if(SettingHelper.getFacebookShare()) {
		var user = acs.getUserLoggedIn();
		var data = {
			link: "http://chatterbox.mobi/",
			name: user.first_name+" "+user.last_name+" has checked in to "+_checkin.event.name,
			message: "",
			caption: "Chatterbox",
			picture: "http://storage.cloud.appcelerator.com/Za6GkEHPsBrL0y22LT1XibgwazZTVhnE/photos/f1/ca/4fe154d9b685535c7a00fce9/photo_thumb_100.png",
			description:""
		};
		Titanium.Facebook.dialog("feed", data, showRequestResult);
	}
}

exports.levelUpPopUpOnFacebook = function(_levelTitle) {	
	var SettingHelper = require('helpers/settingHelper');
	
	if(SettingHelper.getFacebookShare()) {
		var user = acs.getUserLoggedIn();
		var data = {
			link: "http://chatterbox.mobi/",
			name: user.first_name+" "+user.last_name+" has reach the new level!",
			message: "",
			caption: "Chatterbox",
			picture: "http://fc04.deviantart.net/fs71/f/2010/245/7/0/dango_rilakkuma_by_tristan19019-d2xtytx.gif",
			description: _levelTitle
		};
		Titanium.Facebook.dialog("feed", data, showRequestResult);
	}
}

exports.checkinAppearOnFaceBook = function() {	
	// FB.init({
        // appId      : '197422093706392', // App ID
        // status     : true, // check login status
        // cookie     : true, // enable cookies to allow the server to access the session
        // xfbml      : true  // parse XFBML
      // });
// 
    // // Load the SDK Asynchronously
    // (function(d) {
      // var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
      // js = d.createElement('script'); js.id = id; js.async = true;
      // js.src = "//connect.facebook.net/en_US/all.js";
      // d.getElementsByTagName('head')[0].appendChild(js);
    // }(document));
//     
    // FB.api( //cannot send this dynamically yet; fb caching makes it hard to test -->
      // '/me/og_chatterbox:cook&recipe='+encodeURIComponent('http://chatterbox.mobi/opengraph/og_cook_obj_dynamic.php?showTitle=ritsayaaa&showImage=buang&fbrefresh=1'), 
      // 'post',
      // function(response) {
        // if (!response || response.error) {
          // alert('Error occured');
        // } else {
            // alert('Cook was successful! Action ID: ' + response.id);
        // }
    // });
//	var SettingHelper = require('helpers/settingHelper');	
//	if(SettingHelper.getFacebookShare()) {
		// var url = "http://chatterbox.mobi/opengraph/og_cook_obj_dynamic.php?showTitle=ritsayaaa&showImage=buang&fbrefresh=1"
		// var data = {
		// recipe: "http://chatterbox.mobi/opengraph/og_cook_obj_dynamic.php",
		// access_token: Titanium.Facebook.accessToken
		 // };
// 
		 // Titanium.Facebook.requestWithGraphPath("/me/og_chatterbox:cook&recipe=http://chatterbox.mobi/opengraph/og_cook_obj_dynamic.php",{},"POST",showRequestResult);
		 var url = "https://graph.facebook.com/me/og_chatterbox:cook";
          var data = {
            //datatype: "http://chatterbox.mobi/opengraph/og_cook_obj_dynamic.php",
          	recipe: "http://chatterbox.mobi/opengraph/og_cook_obj_dynamic.php",
             access_token : Titanium.Facebook.accessToken
        
         };
         var xhr = Ti.Network.createHTTPClient({
        	  onload: function() {
	    	 responseJSON = JSON.parse(this.responseText);
	    	 alert(responseJSON);
	     },onerror: function(e) {
			 // this function is called when an error occurs, including a timeout
	         Ti.API.debug(e.error);
	         alert(JSON.stringify(e));
	     },
	     timeout:10000  /* in milliseconds */
         });
         xhr.open('POST', url, true);
         xhr.send(data);
		
//	}
}