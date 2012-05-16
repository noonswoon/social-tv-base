//check if you reach new badge or not!
exports.badgeCondition_check = function(){
	var userID = '4fa17dd70020440df700950c';
	var CheckinACS = require('acs/checkinACS');
	var CheckinModel = require('model/checkin');			
//CONDITION 1: NUMBER OF CHECK IN////////////////////////////////////
	var checkinCount = CheckinModel.checkins_count(userID);
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
/////////////////////////////////////////////////////////////////////
};

exports.badgeCondition_createBadgeUnlocked = function(_badgeID){
	var myBadgeACS = require('acs/myBadgeACS');
	var userID = '4fa17dd70020440df700950c';
	Ti.API.info('badgeCondition_createBadgeUnlocked: '+ _badgeID);
	myBadgeACS.myBadgeACS_createNewBadge(userID,_badgeID);
};
