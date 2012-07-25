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
	var FacebookSharing = require('helpers/facebookSharing');
	var BadgeDetailWindow = require('ui/common/Pf_BadgeDetailsWindow');

	var badgeImagesReady = false;
	var myUnlockBadgesReady = false;	

	var availableBadge = 39;
	var badgeRow = availableBadge/3;
	var myUnlockedBadges = []; //array of 9 with 0/1 value
	var badgesCollection =[];
	var badgeIndex = [];
	
	var badgeView = Ti.UI.createView({
		width: 320,
		height: (badgeRow*100)+((badgeRow-1)*4)
	});

	var animateNegativeLeft = Ti.UI.createAnimation({
		left: 63,
		duration: 500,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
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
		for(i=0;i<availableBadge;i++) {
			if(myUnlockedBadges[i]===undefined) myUnlockedBadges[i] = 0;
		}
		myUnlockBadgesReady = true;
		Ti.App.fireEvent('addBadgeDataReady'+_userProfile.id);		
	}

	var openBadgeDetailPopupWindowCallback = function(e) {
		var index = e.index;
		badgeView.badgedetailwin._setBadgeTitle(badgesCollection[index].title,myUnlockedBadges[index]);
		badgeView.badgedetailwin._setBadgeImage(badgeIndex[index].image,myUnlockedBadges[index]);
		if(myUnlockedBadges[index]) badgeView.badgedetailwin._setBadgeDesc(badgesCollection[index].desc,myUnlockedBadges[index]);
		else badgeView.badgedetailwin._setBadgeDesc(badgesCollection[index].hint,myUnlockedBadges[index]);
		badgeView.badgedetailwin.open();
		badgeView.badgedetailwin.animate(animateNegativeLeft);
	}

	var addBadgeDataReadyCallback = function() {
		if(badgeImagesReady && myUnlockBadgesReady) Ti.App.fireEvent('updatedmyUnlockedBadges'+_userProfile.id);
	}
	
	var createBadgeView = function() {
		var count = 0;
		var childrenCount = badgeView.children.length;
		
		for (var k in badgeView.children) {
			if (badgeView.children.hasOwnProperty(k)) {
			//	setTimeout(function() {
			//		Ti.API.info('k: '+k);
			//		Ti.API.info('badgeView.children.length: '+badgeView.children.length);
					badgeView.remove(badgeView.children[k]);
			//	},1000);			
		  };
		}

		setTimeout(function(){
			for(var i=0;i<badgeRow;i++) {
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
		},1500);
	} // end of function: createBadgeView
	
	Ti.App.addEventListener('badgesDbLoaded',function() {
		badgesCollection = BadgeModel.badge_fetchBadges();
		badgeImagesReady = true;
		Ti.App.fireEvent('addBadgeDataReady'+_userProfile.id);
	});
	
	//check if the user already got this badge or not
	Ti.App.addEventListener('badgeConditionUpdate'+_userProfile.id,function(e) {
		var checkBadge = e.badgeID;
		if(myUnlockBadgesReady) {
			if(myUnlockedBadges[checkBadge]===0 && _userProfile.id===acs.getUserId()) BadgeCondition.badgeCondition_createBadgeUnlocked(checkBadge,_userProfile.id);
		};
	});
	
	
	if(_status==='me'){
		Ti.App.addEventListener('badgeLoaded',function(e) {
			for(var i=0;i<e.fetchedBadges.length;i++){
				var path = cacheRemoteURL(e.fetchedBadges[i].urls.original);
				e.fetchedBadges[i].path = path;
			}
			BadgeModel.badgesLoadedFromACS(e.fetchedBadges);
		});
		
		var newBadgeUnlockCallback = function(e){
			Ti.API.info('newBadgeUnlockCallback');
			var ActivityACS = require('acs/activityACS');
			var PointACS = require('acs/pointACS');
			var LeaderACS = require('acs/leaderBoardACS');
			var BadgeModel = require('model/badge');
			var UpdateActivity = require('helpers/updateActivity');
			var badgeData = BadgeModel.fetchedBadgeSearch(e.badgeID);
			
			Ti.App.fireEvent('updatedMyBadge'+acs.getUserId(),{badgeID: e.badgeID});
			// getting data from update activity
			var ActivityDataIdForACS = UpdateActivity.updateActivity_myDatabase('getbadge',badgeData);
			// [0]=dataArray [1]=idArray
			var allActivityDataForACS =  ActivityDataIdForACS[0];
			var allIdDataForACS = ActivityDataIdForACS[1];
			// data to create into ACS: [0]=leaderboard [1]=activity
			var leaderboardData = allActivityDataForACS[0];
			var activityData = allActivityDataForACS[1];
			// local id to trackback: [0]=leaderboardId [1]=activityId
			var leaderboardId = allIdDataForACS[0];
			var activityId = allIdDataForACS[1];
		
			ActivityACS.activityACS_createMyActivity(activityData,activityId);		
			PointACS.pointACS_createPoint(leaderboardData,e.badgeID,'getbadge');
			LeaderACS.leaderACS_updateUserInfo(leaderboardId,leaderboardData.point);
		}
		Ti.App.addEventListener('newBadgeUnlock'+_userProfile.id, newBadgeUnlockCallback);

	
		Ti.App.addEventListener('updatedMyBadge'+_userProfile.id,function(e) {
			myUnlockedBadges[e.badgeID] = 1;
			FacebookSharing.badgePopUpOnFacebook(e.badgeID);
			Ti.API.info('CONGRATS! You have unlock a new badge, check it out!');
			Ti.App.fireEvent('updatedmyUnlockedBadges'+_userProfile.id);
		});

	}; //end of me condition	
	
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