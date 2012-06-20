//check if you reach new badge or not!
//CONDITION 1: NUMBER OF CHECK IN////////////////////////////////////
var checkCountCondition = function(e) {
	var checkinCount = e.result;
	//badge desc: nice to meet you
	//condition: 1st check in
	//badge id: 0
	if(checkinCount >=1) Ti.App.fireEvent('badgeConditionUpdate',{badgeID: 0});
	//badge desc: fall for you	
	//condition: 10th check in	
	//badge id: 1
	if(checkinCount >=10) Ti.App.fireEvent('badgeConditionUpdate',{badgeID: 1});	
	//badge desc: i'm loving it		
	//condition: 20th check in
	//badge id: 2
	if(checkinCount >=20) Ti.App.fireEvent('badgeConditionUpdate', {badgeID: 3});
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
}







exports.badgeCondition_createBadgeUnlocked = function(_badgeID){
	var myBadgeACS = require('acs/myBadgeACS');
	var userID = acs.getUserId();
	
	Ti.API.info('badgeCondition_createBadgeUnlocked: '+ _badgeID);
	myBadgeACS.myBadgeACS_createNewBadge(userID,_badgeID);
};
