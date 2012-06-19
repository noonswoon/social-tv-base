var cacheRemoteURL = function(imageURL) {
	var badgeStoreDirectory = Ti.Filesystem.applicationDataDirectory;
	var hashedSource = Ti.Utils.md5HexDigest(imageURL + '') + '.' + imageURL.split('.').pop();
	get_remote_file(hashedSource, imageURL, null, null);
	var path = badgeStoreDirectory + hashedSource;
	return path;
}
	
var ProfileBadgeView = function(_parent, _userProfile, _status) {
	var ActivityACS = require('acs/activityACS');
	var PointACS = require('acs/pointACS');
	var BadgeModel = require('model/badge');
	var BadgeCondition = require('helpers/badgeCondition');
	var BadgeDetailWindow = require('ui/common/Pf_BadgeDetailWindow');

	var badgeImagesReady = false;
	var myUnlockBadgesReady = false;	

	var myUnlockedBadges = []; //array of 9 with 0/1 value
	var badgesCollection =[];
	var badgeIndex = [];
	
	var badgeView = Ti.UI.createView({
		width: 320,
		height: 320
	});

	var animateNegativeLeft = Ti.UI.createAnimation({
		left: 63,
		duration: 500,
		curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
	});

	badgeView.badgedetailwin = new BadgeDetailWindow({
		badgeImage: 'badgeImage',
		badgeTitle: 'badgeTitle',
		badgeDesc: 'badgeDesc',
		badgeUnlock: 0
	});	
	
	var myBadgesLoadedCallback = function(e) {
		myUnlockedBadges = [];
		//set the value of myUnlockedBadges to be 1 if user got badges
		for(var i=0;i < e.fetchedMyUnlockBadges.length; i++) {
			myUnlockedBadges[e.fetchedMyUnlockBadges[i].badge_id] = 1;
		}
		//set 0 for locked badges
		for(i=0;i<9;i++) {
			if(myUnlockedBadges[i]===undefined) myUnlockedBadges[i] = 0;
		}
		myUnlockBadgesReady = true;
		Ti.App.fireEvent('addBadgeDataReady'+_userProfile.id);		
	}

	var openBadgeDetailPopupWindowCallback = function(e) {
		var index = e.index;
		badgeView.badgedetailwin._setBadgeTitle(badgesCollection[index].title,myUnlockedBadges[index]);
		badgeView.badgedetailwin._setBadgeImage(badgeIndex[index].image,myUnlockedBadges[index]);
		badgeView.badgedetailwin._setBadgeDesc(badgesCollection[index].desc,myUnlockedBadges[index]);
		badgeView.badgedetailwin.open();
		badgeView.badgedetailwin.animate(animateNegativeLeft);
	}

	var addBadgeDataReadyCallback = function() {
		if(badgeImagesReady && myUnlockBadgesReady) Ti.App.fireEvent('updatedmyUnlockedBadges'+_userProfile.id);
	}
	
	var createBadgeView = function() {
		var count = 0;
		
		for (var k in badgeView.children) {
			if (badgeView.children.hasOwnProperty(k)) {
				badgeView.remove(badgeView.children[k]);
		  };
		}	

		for(var i=0;i<3;i++) {
			for(var j=0;j<3;j++) {
				badgeIndex[count] = Ti.UI.createImageView({
					height: 100,
					width: 100,
					left: (j*100)+5
				});
				
				badgeIndex[count].myIndex = count;
			
				if(myUnlockedBadges[count] == 1) {
					var file = Titanium.Filesystem.getFile(badgesCollection[count].path);
					if(file.exists()) badgeIndex[count].image = badgesCollection[count].path;
					else badgeIndex[count].image = badgesCollection[count].url;
				} else badgeIndex[count].image = 'images/badge/lockedbadge.png';
				
				badgeIndex[count].top = (i*100)+5;
				badgeView.add(badgeIndex[count]);

				badgeIndex[count].addEventListener('click', function(e) {
		        	var index = e.source.myIndex;
	    	        Ti.App.fireEvent('openBadgeDetailPopupWindow'+_userProfile.id,{index:index});
        		});
				count++
			}	
		}				
	} // end of function: createBadgeView
	
	Ti.App.addEventListener('badgeLoaded',function(e) {
		for(var i=0;i<e.fetchedBadges.length;i++){
			var path = cacheRemoteURL(e.fetchedBadges[i].urls.original);
			e.fetchedBadges[i].path = path;
		}
		BadgeModel.badgesLoadedFromACS(e.fetchedBadges);
	});
	
	Ti.App.addEventListener('badgesDBLoaded',function() {
		badgesCollection = BadgeModel.badge_fetchBadges();
		badgeImagesReady = true;
		Ti.App.fireEvent('addBadgeDataReady'+_userProfile.id);
	});
	
	//check if the user already got this badge or not
	Ti.App.addEventListener('badgeConditionUpdate',function(e) {
		var checkBadge = e.badgeID;
		if(myUnlockBadgesReady) {
			if(myUnlockedBadges[checkBadge]===0) BadgeCondition.badgeCondition_createBadgeUnlocked(checkBadge);
		}
	});
	
	Ti.App.addEventListener('updatedMyBadge',function(e) {
		myUnlockedBadges[e.badgeID] = 1;
		alert('CONGRATS! You have unlock a new badge, check it out!');
		Ti.App.fireEvent('updatedmyUnlockedBadges'+_userProfile.id);
	});	
	
	Ti.App.addEventListener('myBadgesLoaded'+_userProfile.id,myBadgesLoadedCallback);
	Ti.App.addEventListener('addBadgeDataReady'+_userProfile.id,addBadgeDataReadyCallback);
	Ti.App.addEventListener('updatedmyUnlockedBadges'+_userProfile.id,createBadgeView);
	Ti.App.addEventListener('openBadgeDetailPopupWindow'+_userProfile.id,openBadgeDetailPopupWindowCallback);	
	
	var clearListeners = function() {
		Ti.API.info('remove Eventlistener...openBadgeDetail event'+_userProfile.id);
		Ti.App.removeEventListener('updatedmyUnlockedBadges'+_userProfile.id,createBadgeView);
		Ti.App.removeEventListener('myBadgesLoaded'+_userProfile.id,myBadgesLoadedCallback);
		Ti.App.removeEventListener('addBadgeDataReady'+_userProfile.id,addBadgeDataReadyCallback);
		Ti.App.removeEventListener('openBadgeDetailPopupWindow'+_userProfile.id,openBadgeDetailPopupWindowCallback);
		Ti.App.removeEventListener('profileMainWindowClosing'+_userProfile.id, clearListeners);
	}
	Ti.App.addEventListener('profileMainWindowClosing'+_userProfile.id, clearListeners);

	if(_status!=="me") {
		badgesCollection = BadgeModel.badge_fetchBadges();
		badgeImagesReady = true;
		Ti.App.fireEvent('addBadgeDataReady'+_userProfile.id);
	};	
	
	return badgeView;
}

module.exports = ProfileBadgeView;