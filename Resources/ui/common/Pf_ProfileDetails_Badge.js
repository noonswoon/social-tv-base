var ProfileBadgeView = function(_parent){
	var badgeView = Ti.UI.createView({
		width: 320
	});
	
	var myUnlockedBadges = []; //array of 9 with 0/1 value
	var badgesCollection =[];
	var BadgeCondition = require('helpers/badgeCondition'); //checking condition to add badge
	var BadgeModel = require('model/badge');
	var BadgeNewWindow = require('ui/common/Pf_badgeNewWindow');
	var badgeIndex = [];

	//ANIMATION
	var animateNegativeLeft = Ti.UI.createAnimation({
		left: 63,
		curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
		duration: 500
	});

	function cacheRemoteURL(imageURL){
		var badgeStoreDirectory = Ti.Filesystem.applicationDataDirectory;
		var hashedSource = Ti.Utils.md5HexDigest(imageURL + '') + '.' + imageURL.split('.').pop();
		get_remote_file(hashedSource, imageURL, null, null);
		var path = badgeStoreDirectory + hashedSource;
		return path;
	}
	
	badgeView.badgeNewWindow = new BadgeNewWindow({
		badgeImage: 'badgeImage',
		badgeTitle: 'badgeTitle',
		badgeDesc: 'badgeDesc',
		badgeUnlock: 0
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
				var file = Titanium.Filesystem.getFile(badgesCollection[count].path);
					if (file.exists()) {
						badgeIndex[count].image = badgesCollection[count].path;
					}
					else {badgeIndex[count].image = badgesCollection[count].url;}
			}
			else {
				badgeIndex[count].image = 'images/badge/lockedbadge.png';
			}
			badgeIndex[count].top = (i*100)+5;
			badgeView.add(badgeIndex[count]);

			badgeIndex[count].addEventListener('click', function(e) {
				//Ti.API.info(String(e.source.image));
	        	var index = e.source.myIndex;
	            Ti.App.fireEvent('openNewBadgeWindow',{index:index});
        	});
			count++
			};	
		};			
	});		
	Ti.App.addEventListener('openNewBadgeWindow', function(e){
		var index = e.index;
		badgeView.badgeNewWindow._setBadgeTitle(badgesCollection[index].title,myUnlockedBadges[index]);
		badgeView.badgeNewWindow._setBadgeImage(badgeIndex[index].image,myUnlockedBadges[index]);
		badgeView.badgeNewWindow._setBadgeDesc(badgesCollection[index].desc,myUnlockedBadges[index]);
	
		badgeView.badgeNewWindow.open();
		badgeView.badgeNewWindow.animate(animateNegativeLeft);
	});	
	
	//TODO:check this too	
	Ti.App.addEventListener('checkinCountUpdate',function(_id){
		var checkBadge = _id.badgeID;
		if(myUnlockedBadges[checkBadge]===0){
			Ti.API.info('creating your new badge..');
			BadgeCondition.badgeCondition_createBadgeUnlocked(checkBadge);
		}
	});
	Ti.App.addEventListener('updatedMyBadge',function(_user){
		var badgeUpdated = _user.badgeID;
		myUnlockedBadges[badgeUpdated]=1;
		alert('CONGRATS! You have got a new badge');
		Ti.App.fireEvent('updatedmyUnlockedBadges');
	});
	//
	return badgeView;
}

module.exports = ProfileBadgeView;