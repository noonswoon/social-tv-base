function cacheRemoteURL(imageURL){
	var badgeStoreDirectory = Ti.Filesystem.applicationDataDirectory;
	var hashedSource = Ti.Utils.md5HexDigest(imageURL + '') + '.' + imageURL.split('.').pop();
	get_remote_file(hashedSource, imageURL, null, null);
	var path = badgeStoreDirectory + hashedSource;
	return path;
}
	
var ProfileBadgeView = function(_parent){
	var BadgeCondition = require('helpers/badgeCondition'); //checking condition to add badge
	var BadgeModel = require('model/badge');
	var BadgeDetailWindow = require('ui/common/Pf_BadgeDetailWindow');
	
	var badgeView = Ti.UI.createView({
		width: 320,
		height: 320
	});
	
	var myUnlockedBadges = []; //array of 9 with 0/1 value
	var badgesCollection =[];
	var badgeIndex = [];
	
	var badgeImagesReady = false;
	var myUnlockBadgesReady = false;

	//ANIMATION
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
	
	Ti.App.addEventListener('badgeLoaded',function(e){
		for(var i=0;i<e.fetchedBadges.length;i++){
			var path = cacheRemoteURL(e.fetchedBadges[i].urls.original);
			e.fetchedBadges[i].path = path;
		}
		BadgeModel.badgesLoadedFromACS(e.fetchedBadges);
	});
	
	Ti.App.addEventListener('badgesDBLoaded',function(){
		badgesCollection = BadgeModel.badge_fetchBadges();
		badgeImagesReady = true;
		
		Ti.App.fireEvent('addBadgeDataReady');
	});
	
	Ti.App.addEventListener('myBadgesLoaded',function(e){
		//set the value of myUnlockedBadges to be 1 if user got badges
		for(var i=0;i < e.fetchedMyUnlockBadges.length; i++){
			myUnlockedBadges[e.fetchedMyUnlockBadges[i].badge_id] = 1;
		}
		//set 0 for locked badges
		for(i=0;i<9;i++){
			if(myUnlockedBadges[i]===undefined){
				myUnlockedBadges[i] = 0;
			}
		}
		myUnlockBadgesReady = true;
		Ti.App.fireEvent('addBadgeDataReady');
	});
	
	Ti.App.addEventListener('addBadgeDataReady', function() {
		if(badgeImagesReady && myUnlockBadgesReady)
			Ti.App.fireEvent('updatedmyUnlockedBadges');
	});
	
	Ti.App.addEventListener('updatedmyUnlockedBadges',function(){
		for (var i in badgeView.children){
			if (badgeView.children.hasOwnProperty(i)) {
				badgeView.remove(badgeView.children[i]);
		   }
		}			
		var count = 0;
		for(var i=0;i<3;i++){
			for(var j=0;j<3;j++){
				badgeIndex[count] = Ti.UI.createImageView({
					height: 100,
					width: 100,
					left: (j*100)+5
				});
				badgeIndex[count].myIndex = count;
			
				if(myUnlockedBadges[count] == 1){
					var file = Titanium.Filesystem.getFile(badgesCollection[count].path);
					if (file.exists()) {
						badgeIndex[count].image = badgesCollection[count].path;
					}
					else {
						badgeIndex[count].image = badgesCollection[count].url;
					}
				} else {
					badgeIndex[count].image = 'images/badge/lockedbadge.png';
				}
				badgeIndex[count].top = (i*100)+5;
				badgeView.add(badgeIndex[count]);

				badgeIndex[count].addEventListener('click', function(e) {
		        	var index = e.source.myIndex;
	    	        Ti.App.fireEvent('openBadgeDetailPopupWindow',{index:index});
        		});
				count++
			}	
		}		
	});		
	Ti.App.addEventListener('openBadgeDetailPopupWindow', function(e){
		var index = e.index;
		badgeView.badgedetailwin._setBadgeTitle(badgesCollection[index].title,myUnlockedBadges[index]);
		badgeView.badgedetailwin._setBadgeImage(badgeIndex[index].image,myUnlockedBadges[index]);
		badgeView.badgedetailwin._setBadgeDesc(badgesCollection[index].desc,myUnlockedBadges[index]);
	
		badgeView.badgedetailwin.open();
		badgeView.badgedetailwin.animate(animateNegativeLeft);
	});	
	
	//TODO:check this too	
	Ti.App.addEventListener('checkinCountUpdate',function(_id){
		var checkBadge = _id.badgeID;
		if(myUnlockBadgesReady){
			if(myUnlockedBadges[checkBadge]===0){
				alert('creating your new badge..');
				BadgeCondition.badgeCondition_createBadgeUnlocked(checkBadge);
				//TODO: create new activity = getBadge :D
			}
		}
	});
	Ti.App.addEventListener('updatedMyBadge',function(_user){
		var badgeUpdated = _user.badgeID;
		myUnlockedBadges[badgeUpdated]=1;
		alert('CONGRATS! You have got a new badge');
		Ti.App.fireEvent('updatedmyUnlockedBadges');
	});
	return badgeView;
}

module.exports = ProfileBadgeView;