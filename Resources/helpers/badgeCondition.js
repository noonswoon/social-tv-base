//check if you reach new badge or not!
var getNumCheckinsOfType = function(_programType) {
	if(!Ti.App.Properties.hasProperty(_programType+'Count')) { //do some caching
		Ti.App.Properties.setInt(_programType+'Count',1);
		return 1;
	} else {
		var numCheckInsSoFar = Ti.App.Properties.getInt(_programType+'Count');
		var newNumCheckins = numCheckInsSoFar + 1
		Ti.App.Properties.setString(_programType+'Count',newNumCheckins);
		return newNumCheckins;
	}	
}
exports.getNumCheckinsOfType = getNumCheckinsOfType;

var getNumCheckinsOfProgramId = function(_programId) {
	if(!Ti.App.Properties.hasProperty(_programId+'Count')) { //do some caching
		Ti.App.Properties.setInt(_programId+'Count',1);
		return 1;
	} else {
		var numCheckInsSoFar = Ti.App.Properties.getInt(_programId+'Count');
		var newNumCheckins = numCheckInsSoFar + 1
		Ti.App.Properties.setString(_programId+'Count',newNumCheckins);
		Ti.API.info('getNumCheckinsOfProgramId: '+_programId+'//'+newNumCheckins);
		return newNumCheckins;
	}	
}
exports.getNumCheckinsOfProgramId = getNumCheckinsOfProgramId;

////////////////////////////////////////////////////////////////////////
var checkCountCondition = function(e) {
	var checkinCount = e.result;
	//badge desc: nice to meet you
	//condition: 1st check in
	//badge id: 0
	if(checkinCount >= 1) Ti.App.fireEvent('badgeConditionUpdate',{badgeID: 0});
	//badge desc: fall for you	
	//condition: 10th check in	
	//badge id: 1
	else if(checkinCount >= 10) Ti.App.fireEvent('badgeConditionUpdate',{badgeID: 1});	
	//badge desc: i'm loving it		
	//condition: 20th check in
	//badge id: 2
	else if(checkinCount >= 20) Ti.App.fireEvent('badgeConditionUpdate', {badgeID: 3});
}

exports.checkFriendCondition = function(_friendCheckIn) {
	//badge desc: love sharing		
	//condition: checkin with more than 5 friends
	//badge id: 3	
	if(_friendCheckIn >= 5) Ti.App.fireEvent('badgeConditionUpdate', {badgeID: 3});
}	
	
var checkTypeCondition = function(_type) {
	var checkinCount = getNumCheckinsOfType(_type);
	Ti.API.info('checkinCount// '+_type+' = '+checkinCount);

	if(checkinCount==5) {
		switch (_type){
			//badge desc: sports fan		
			//condition: 5 checkins in sport
			//badge id: 4
			case 'sport': {
				Ti.App.fireEvent('badgeConditionUpdate', {badgeID: 4});
				break;
			};
			//badge desc: drama queen		
			//condition: 5 checkins in drama
			//badge id: 5
			case 'drama': {
				Ti.App.fireEvent('badgeConditionUpdate', {badgeID: 5});
				break;
			};
			//badge desc: game show addict		
			//condition: 5 checkins in gameshow
			//badge id: 6
			case 'gameshow': {
				Ti.App.fireEvent('badgeConditionUpdate', {badgeID: 6});
				break;
			};			
		}
	}
}
		
var checkTimeCondition = function() {
	var now = moment().format('HH');
	Ti.API.info('checkTimeCondition: '+now);
	//badge desc: early bird	
	//condition: checkin 5.00-7.59 am
	//badge id: 7
	if(now === '05' || now === '06' || now === '07') Ti.App.fireEvent('badgeConditionUpdate',{badgeID: 7});
	//badge desc: insomnia		
	//condition: checkin 1.00 - 3.59 am
	//badge id: 8
	if(now === '01' || now === '02' || now === '03') Ti.App.fireEvent('badgeConditionUpdate',{badgeID: 8});
}

var determineShowBadgeId = function(_programId,_numCheckins) {
	if(_programId === "CH3_CTBMT") {
		//badge desc: AKBingo LV1		
		//condition: 3 checkins in AKBingo
		//badge id: 9
		if(_numCheckins === 3) return 9;
		//badge desc: AKBingo LV2		
		//condition: 5 checkins in AKBingo
		//badge id: 10
		else if(_numCheckins === 5) return 10;
		//badge desc: AKBingo LV3		
		//condition: 10 checkins in AKBingo
		//badge id: 11
		else if(_numcheckins === 10) return 11;
	} else if(_programId === "CH3_TNNKK") {
		if(_numCheckins === 3) return 12;
		else if(_numCheckins === 5) return 13;
		else if(_numcheckins === 10) return 14;
	}
	else return 0;
}

var checkProgramCondition = function(_programId) {
	var checkinCount = getNumCheckinsOfProgramId(_programId);
	alert('checkinCount// '+_programId+' = '+checkinCount);
	var badgeId = determineShowBadgeId(_programId,checkinCount);
	alert('badgeId: '+badgeId);
	if(badgeId!==0) Ti.App.fireEvent('badgeConditionUpdate', {badgeID: badgeId});
}	

var newBadgeUnlockCallback = function(e){
	var ActivityACS = require('acs/activityACS');
	var PointACS = require('acs/pointACS');
	var LeaderACS = require('acs/leaderBoardACS');
	var BadgeModel = require('model/badge');
	var UpdateActivity = require('helpers/updateActivity');
	var badgeData = BadgeModel.fetchedBadgeSearch(e.badgeID);
		
	Ti.App.fireEvent('updatedMyBadge',{badgeID: e.badgeID});
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
	
Ti.App.addEventListener('newBadgeUnlock', newBadgeUnlockCallback);	
Ti.App.addEventListener('UserTotalCheckInsFromACS'+acs.getUserId(), checkCountCondition);

/////////////////////////////////////////////////////////////////////

exports.checkinEvent = function(_checkinData){
	checkTimeCondition();
	Ti.API.info('checkinEvent//_checkinData.program_type: '+_checkinData.program_type);
	checkTypeCondition(_checkinData.program_type);
	checkProgramCondition(_checkinData.program_id);
}

exports.badgeCondition_createBadgeUnlocked = function(_badgeID){
	var myBadgeACS = require('acs/myBadgeACS');
	var my_id = acs.getUserId();
	Ti.API.info('badgeCondition_createBadgeUnlocked: '+ _badgeID);
	myBadgeACS.myBadgeACS_createNewBadge(my_id,_badgeID);
};
