var ProfileBadgeView = function(){
	var badgeView = Ti.UI.createView();
	
///BADGE ACS////////////////////////////////////////////////////////
	var myUnlockedBadges = []; //array of 9 with 0/1 value
	var badgesImg = []; //array of 9 w/ full value pull from ACS
	var badgesDesc = [];//array of 9 w/ full value pull from ACS

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
		
		Ti.App.addEventListener('BadgesLoaded',function(e){		
			Ti.API.info('BadgesLoaded');
			for(var i=0;i < e.fetchedMyBadges.length; i++) {
				badgesImg[i] = e.fetchedMyBadges[i].badge_img;
				badgesDesc[i] = e.fetchedMyBadges[i].badge_desc;	
			}
			
				var count = 0;
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
	
return badgeView;
}

module.exports = ProfileBadgeView;