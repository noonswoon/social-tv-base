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
	if(checkinCount == 1) Ti.App.fireEvent('badgeConditionUpdate',{badgeID: 0});
	//badge desc: fall for you	
	//condition: 10th check in	
	//badge id: 1
	else if(checkinCount == 10) Ti.App.fireEvent('badgeConditionUpdate',{badgeID: 1});	
	//badge desc: i'm loving it		
	//condition: 20th check in
	//badge id: 2
	else if(checkinCount == 20) Ti.App.fireEvent('badgeConditionUpdate', {badgeID: 3});
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
	Ti.API.info('_numCheckin: '+_numCheckins);
	if(_programId === "CH3_ATTEN") {
		//badge desc: At-Ten Fan LV3; condition: 10 checkins in At-Ten; badge id: 11
		if(_numCheckins >= 10) return 11;
	
		//badge desc: At-Ten Fan LV2; condition: 5 checkins in At-Ten; badge id: 10
		if(_numCheckins >= 5) return 10;
		
		//badge desc: At-Ten Fan LV1; condition: 3 checkins in At-Ten; badge id: 9
		if(_numCheckins >= 3) return 9;
	} else if(_programId === "CH3_TNSHO") {
		//badge desc: At-Ten Fan LV3; condition: 10 checkins in At-Ten; badge id: 14			
		if(_numCheckins >= 10) return 14;

		//badge desc: At-Ten Fan LV2; condition: 5 checkins in At-Ten; badge id: 13	
		if(_numCheckins >= 5) return 13;
				
		//badge desc: At-Ten Fan LV1; condition: 3 checkins in At-Ten; badge id: 12		
		if(_numCheckins >= 3) return 12;
	} else if(_programId >= "CH3_WMTWM") {
		//badge desc: Woman to Woman Fan LV3; condition: 10 checkins in Woman to Woman; badge id: 17			
		if(_numCheckins >= 10) return 17;

		//badge desc: Woman to Woman Fan LV2; condition: 5 checkins in Woman to Woman; badge id: 16	
		if(_numCheckins >= 5) return 16;
				
		//badge desc: Woman to Woman Fan LV1; condition: 3 checkins in Woman to Woman; badge id: 15		
		if(_numCheckins >= 3) return 15;
	} else if(_programId >= "CH3_MNGNE") {
		//badge desc: Morning News Fan LV3; condition: 10 checkins in Morning News; badge id: 20	
		if(_numCheckins >= 10) return 20;
		
		//badge desc: Morning News Fan LV2; condition: 5 checkins in Morning News; badge id: 19
		if(_numCheckins >= 5) return 19;
		
		//badge desc: Morning News Fan LV1; condition: 3 checkins in Morning News; badge id: 18
		if(_numCheckins >= 3) return 18;
	} else if(_programId >= "CH3_STSNE") {
		//badge desc: Sat-Sun News Fan LV3; condition: 10 checkins in Sat-Sun News; badge id: 23	
		if(_numCheckins >= 10) return 23;
		
		//badge desc: Sat-Sun News Fan LV2; condition: 5 checkins in Sat-Sun News; badge id: 22
		if(_numCheckins >= 5) return 22;
		
		//badge desc: Sat-Sun News Fan LV1; condition: 3 checkins in Sat-Sun News; badge id: 21
		if(_numCheckins >= 3) return 21;
	} else if(_programId >= "CH5_JOJAI") {
		//badge desc: Jor Jai Fan LV3; condition: 10 checkins in Jor Jai; badge id: 26	
		if(_numCheckins >= 10) return 26;
		
		//badge desc: Jor Jai Fan LV2; condition: 5 checkins in Jor Jai; badge id: 25
		if(_numCheckins >= 5) return 25;
		
		//badge desc: Jor Jai Fan LV1; condition: 3 checkins in Jor Jai; badge id: 24
		if(_numCheckins >= 3) return 24;
	} else if(_programId >= "CH5_SBUDS") {
		//badge desc: Sabud Show Fan LV3; condition: 10 checkins in Sabud Show; badge id: 29	
		if(_numCheckins >= 10) return 29;
		
		//badge desc: Sabud Show Fan LV2; condition: 5 checkins in Sabud Show; badge id: 28
		if(_numCheckins >= 5) return 28;
		
		//badge desc: Sabud Show Fan LV1; condition: 3 checkins in Sabud Show; badge id: 27
		if(_numCheckins >= 3) return 27;
	} else if(_programId >= "CH9_WDYKU") {
		//badge desc: Woody Talk Show Fan LV3; condition: 10 checkins in Woody Talk Show; badge id: 32	
		if(_numCheckins >= 10) return 32;
		
		//badge desc: Woody Talk Show Fan LV2; condition: 5 checkins in Woody Talk Show; badge id: 31
		if(_numCheckins >= 5) return 31;
		
		//badge desc: Woody Talk Show Fan LV1; condition: 3 checkins in Woody Talk Show; badge id: 30
		if(_numCheckins >= 3) return 30;
	} else if(_programId >= "CH9_WDYMN") {
		//badge desc: Morning Woody Fan LV3; condition: 10 checkins in  Morning Woody; badge id: 35	
		if(_numCheckins >= 10) return 35;
		
		//badge desc: Morning Woody Fan LV2; condition: 5 checkins in  Morning Woody; badge id: 34
		if(_numCheckins >= 5) return 34;
		
		//badge desc: Morning Woody Fan LV1; condition: 3 checkins in  Morning Woody; badge id: 33
		if(_numCheckins >= 3) return 33;
	} else if(_programId >= "CH7_IRCHF") {
		//badge desc: Iron Chef Thailand Fan LV3; condition: 10 checkins in  Iron Chef Thailand; badge id: 38	
		if(_numCheckins >= 10) return 38;
		
		//badge desc: Iron Chef Thailand Fan LV2; condition: 5 checkins in  Iron Chef Thailand; badge id: 37
		if(_numCheckins >= 5) return 37;
		
		//badge desc: Iron Chef Thailand Fan LV1; condition: 3 checkins in  Iron Chef Thailand; badge id: 36
		if(_numCheckins >= 3) return 36;
	}
	return 0;
}

var checkProgramCondition = function(_programId) {
	var BadgeShowPermissionACS = require('acs/badgeShowPermissionACS');
	var checkinCount = getNumCheckinsOfProgramId(_programId);
	Ti.API.info('checkinCount/'+_programId+' = '+checkinCount);
	if(BadgeShowPermissionACS.getBadgeOfShowPermission(_programId)) {
		var badgeId = determineShowBadgeId(_programId,checkinCount);
		Ti.API.info('badgeId: '+badgeId);		
	}
	if(badgeId !== 0 || badgeId !== undefined) Ti.App.fireEvent('badgeConditionUpdate', {badgeID: badgeId});
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
	//Ti.API.info('checkinEvent: _checkinData.program_type: '+_checkinData.program_type);
	checkTypeCondition(_checkinData.program_type);
	checkProgramCondition(_checkinData.program_id);
}

exports.badgeCondition_createBadgeUnlocked = function(_badgeID){
	var myBadgeACS = require('acs/myBadgeACS');
	var my_id = acs.getUserId();
	//Ti.API.info('badgeCondition_createBadgeUnlocked: '+ _badgeID);
	myBadgeACS.myBadgeACS_createNewBadge(my_id,_badgeID);
};
