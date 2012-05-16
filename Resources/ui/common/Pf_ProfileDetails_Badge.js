var ProfileBadgeView = function(){
	var badgeView = Ti.UI.createView();
	
///BADGE ACS////////////////////////////////////////////////////////
	var myUnlockedBadges = []; //array of 9 with 0/1 value
	var badgesImg = []; //array of 9 w/ full value pull from ACS
	var badgesDesc = [];//array of 9 w/ full value pull from ACS
	var BadgeCondition = require('helpers/badgeCondition');//checking condition to add badge
	
	Ti.App.addEventListener('myBadgesLoaded',function(e){
		for(var i=0;i < e.fetchedMyUnlockBadges.length; i++){
			myUnlockedBadges[e.fetchedMyUnlockBadges[i].badge_id] = 1;
			//set the value of myUnlockedBadges to be 1 if user got badges
		}
		//set 0 for locked badges
		for(i=0;i<9;i++){
			if(myUnlockedBadges[i]===undefined){
				myUnlockedBadges[i]=0;
			}
		}
		//pull badge image from ACS
		var badgesACS = require('acs/badgesACS');
		badgesACS.BadgesACS_fetchedBadges();
	});	
	
	Ti.App.addEventListener('checkinCountUpdate',function(_id){
		//alert(_id.badgeID);
		var checkBadge = _id.badgeID;
		if(myUnlockedBadges[checkBadge]===1){
			Ti.API.info('You already got badge: ' + checkBadge);
		}
		else {
			Ti.API.info('creating your new badge..');
			BadgeCondition.badgeCondition_createBadgeUnlocked(checkBadge);
		};
	});
	
	Ti.App.addEventListener('updatedMyBadge',function(_user){
		var badgeUpdated = _user.badgeID;
		myUnlockedBadges[badgeUpdated]=1;
		Ti.API.info('myUnlockedBadges has been updated: ' + myUnlockedBadges[badgeUpdated]);
		alert('CONGRATS! You have got a new badge: ' + badgesDesc[badgeUpdated]);
		Ti.App.fireEvent('updatedmyUnlockedBadges');
	});
	
	Ti.App.addEventListener('updatedmyUnlockedBadges',function(){
			Ti.API.info('Clean my badges view');
			for (var i in badgeView.children){
				if (badgeView.children.hasOwnProperty(i)) {
					badgeView.remove(badgeView.children[i]);
			   }
			}	
			var count = 0;
			Ti.API.info('Update my badges view');
			for(var i=0;i<3;i++){
				for(var j=0;j<3;j++){
					var badgeImg = Ti.UI.createImageView({
						height: 100,
						width: 100,
						left: (j*100)+5,
					});
					if(myUnlockedBadges[count]===1){
						Ti.API.info(count +' got badge!');
						badgeImg.image = String(badgesImg[count]);
					}
					else {
						badgeImg.image = 'images/lockbadge.png';
					}
					badgeImg.top = (i*100)+5;
					badgeView.add(badgeImg);
					count++
				};
		
			};			
	});
		
	Ti.App.addEventListener('BadgesLoaded',function(e){		
		Ti.API.info('BadgesLoaded');
		for(var i=0;i < e.fetchedMyBadges.length; i++) {
			badgesImg[i] = e.fetchedMyBadges[i].badge_img;
			badgesDesc[i] = e.fetchedMyBadges[i].badge_desc;	
		}
		Ti.App.fireEvent('updatedmyUnlockedBadges');
						
	});
	return badgeView;
}

module.exports = ProfileBadgeView;