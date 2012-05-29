var ProfileBadgeView = function(_parent){
	var badgeView = Ti.UI.createView({
		width: 320,
		height:480,
		zIndex: 2
	});
	
///BADGE ACS////////////////////////////////////////////////////////
	var myUnlockedBadges = []; //array of 9 with 0/1 value
	var badgesCollection =[];
	var BadgeCondition = require('helpers/badgeCondition'); //checking condition to add badge
	var BadgesACS = require('acs/badgesACS');
	var BadgeModel = require('model/badge');
	var BadgeNewWindow = require('ui/common/Pf_badgeNewWindow');
	var badgeIndex = [];
	var badgeStore = Ti.Filesystem.applicationDataDirectory + '/CachedRemoteImages/badges';
	var dir = Ti.Filesystem.getFile(badgeStore);
	
	if (!dir.exists()) {
    	dir.createDirectory();
	}
	
	function cacheRemoteURL(image, imageURL) {
	    if (imageURL) {
	        var hashedSource = Ti.Utils.md5HexDigest(imageURL + '') + '.' + imageURL.split('.').pop();
	        var localImage = Ti.Filesystem.getFile(badgeStore, hashedSource);
			//maybe use cache here:9
	        if (localImage.exists()) {
	            image.image = localImage.nativePath;
	            return localImage.nativePath;
	        }
	        else {
	            image.image = imageURL;
				localImage.write(image.toImage());
	            return localImage.nativePath;
        	}
    	}
	}

//ANIMATION
	var animateNegativeLeft = Ti.UI.createAnimation({
		left: 63,
		curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
		duration: 500
	});


	Ti.App.addEventListener('myBadgesLoaded',function(e){
		//set the value of myUnlockedBadges to be 1 if user got badges
		for(var i=0;i < e.fetchedMyUnlockBadges.length; i++){
			myUnlockedBadges[e.fetchedMyUnlockBadges[i].badge_id] = 1;
		}
		//set 0 for locked badges
		for(i=0;i<9;i++){
			if(myUnlockedBadges[i]===undefined){
				myUnlockedBadges[i]=0;
			}
		}
		BadgesACS.fetchedBadges();
	});	
	
	
	Ti.App.addEventListener('badgeLoaded',function(e){
		for(var i=0;i<e.fetchedBadges.length;i++){
			var image = Ti.UI.createImageView();
			var path = cacheRemoteURL(image, e.fetchedBadges[i].urls.original);
			e.fetchedBadges[i].path = path;	
		}
		BadgeModel.badgesLoadedFromACS(e.fetchedBadges);
	});
	
	Ti.App.addEventListener('badgesLoaded',function(){
		badgesCollection = BadgeModel.badge_fetchBadges();
		Ti.App.fireEvent('updatedmyUnlockedBadges');
	});
	
	Ti.App.addEventListener('checkinCountUpdate',function(_id){
		var checkBadge = _id.badgeID;
		if(myUnlockedBadges[checkBadge]===1){
		}
		else {
			Ti.API.info('creating your new badge..');
			BadgeCondition.badgeCondition_createBadgeUnlocked(checkBadge);
		};
	});
	
	Ti.App.addEventListener('updatedMyBadge',function(_user){
		var badgeUpdated = _user.badgeID;
		myUnlockedBadges[badgeUpdated]=1;
		alert('CONGRATS! You have got a new badge');
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
					if(myUnlockedBadges[count]===1){
						badgeIndex[count].image = badgesCollection[count].path;
					}
					else {
						badgeIndex[count].image = 'images/badge/lockedbadge.png';
					}
					badgeIndex[count].top = (i*100)+5;
					badgeView.add(badgeIndex[count]);

					badgeIndex[count].addEventListener('click', function(e) {
	           			var index = e.source.myIndex;
	            		Ti.App.fireEvent('openNewBadgeWindow',{index:index});
        			});
					count++
				};
		
			};			
	});

		var badgeNewWindow = new BadgeNewWindow({
		badgeImage: badgesCollection[index].path,
		badgeTitle: badgesCollection[index].title,
		badgeDesc: badgesCollection[index].desc,
		badgeUnlock: myUnlockedBadges[index]
		});
		
		badgeNewWindow._setTitle('hahaha');
	
	Ti.App.addEventListener('openNewBadgeWindow', function(e){
		var index = e.index;
		var badgeNewWindow = new BadgeNewWindow({
			badgeImage: badgesCollection[index].path,
			badgeTitle: badgesCollection[index].title,
			badgeDesc: badgesCollection[index].desc,
			badgeUnlock: myUnlockedBadges[index]
		});
		badgeNewWindow.open();
		badgeNewWindow.animate(animateNegativeLeft);
	});
		
	return badgeView;
}

module.exports = ProfileBadgeView;