//check if you reach new badge or not!
	var CheckinACS = require('acs/checkinACS');
	var userID = acs.getUserId();
//CONDITION 1: NUMBER OF CHECK IN////////////////////////////////////
	var checkCountCondition = function(e){
		var checkinCount = e.result;
		//badge desc: nice to meet you
		//condition: 1st check in
		//badge id: 0
		if(checkinCount >=1){
			Ti.App.fireEvent('checkinCountUpdate',{
				badgeID: 0
			});	
		}
		//badge desc: fall for you	
		//condition: 10th check in	
		//badge id: 1
		if(checkinCount >=10){
			Ti.App.fireEvent('checkinCountUpdate',{
				badgeID: 1
			});	
		}
		//badge desc: i'm loving it		
		//condition: 20th check in
		//badge id: 2
		if(checkinCount >=20){
			Ti.App.fireEvent('checkinCountUpdate',{
				badgeID: 2
			});	
		}
	};
	Ti.App.addEventListener('UserTotalCheckInsFromACS'+acs.getUserId(), checkCountCondition);

/////////////////////////////////////////////////////////////////////

exports.badgeCondition_createBadgeUnlocked = function(_badgeID){
	var myBadgeACS = require('acs/myBadgeACS');
	var userID = acs.getUserId();
	Ti.API.info('badgeCondition_createBadgeUnlocked: '+ _badgeID);
	myBadgeACS.myBadgeACS_createNewBadge(userID,_badgeID);
	
};
