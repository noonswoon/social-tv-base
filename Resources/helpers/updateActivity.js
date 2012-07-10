/* 4 possible activity
 * 		1. checkin		(+5)
 * 		2. comment		(+1)
 * 		3. get badge	(+5)
 */

			//checkin data to insert into checkin database	
var createCheckinData = function(_act) {
	point = 5;
	var checkinData = {
	  	event_id: _act.eventId,
	  	user_id: acs.getUserId(),
		score: point
	};
	return checkinData;
}

var createActivityData = function(_act,_type,_targetObject,_addData,_point) {
	var activityData = {
		user_id: acs.getUserId(),
		targetedUserID: acs.getUserId(),
		category: _type,
		targetedObjectID: _targetObject, //_act.eventId,
		additionalData: _addData //_act.programTitle,
	};
	return activityData;
}
var createLeaderBoardData = function(_name,_point) {
	var leaderboardData = {
		user_id: acs.getUserId(),
		name: _name,
		point: _point
	};
	return leaderboardData;
}

exports.updateActivity_myDatabase = function(_type,_act){
	var CheckinModel = require('model/checkin');
	var PointModel = require('model/point');
	var ActivityModel = require('model/activity');  		
	
//	var id = acs.getUserId();
	var name = acs.getUserLoggedIn().first_name + ' '+ acs.getUserLoggedIn().last_name;
	var	dataArray = [];
	var idArray = [];
	var point;
	
	switch (_type){
		case 'checkin': {
			point = 5;
	  		Ti.API.info("update type:"+_type);
			var checkinData = createCheckinData(_act);
			var activityData = createActivityData(_act,_type,_act.eventId,_act.programTitle,point);
			checkinId = CheckinModel.checkin_create(checkinData);
	  		idArray.push(checkinId);
			dataArray.push(checkinData);
			break;
		};
		case 'comment': {
	  		Ti.API.info("update type:"+_type);
	  		//insert command
			_point = 1;
			break;
		};
		case 'getbadge': {
			Ti.API.info("update type:"+_type);	
			point = 5;
			var activityData = createActivityData(_act,_type,_act.badgeID,_act.title,point);
			break;
		};
		default: {
			Ti.API.info("_default");
		};
	};
	
	var leaderboardData = createLeaderBoardData(name,point);
	var leaderboard =[]; //[0]=acs id [1]=newPoint to update into leaderboard
	leaderboard = PointModel.pointModel_updateLeaderToACS(leaderboardData);
	leaderboardACSid = leaderboard[0];
	leaderboardData.point = Number(leaderboard[1]);
	
	activityId = ActivityModel.activityModel_create(activityData);
	
	idArray.push(leaderboardACSid);
	dataArray.push(leaderboardData);
	idArray.push(activityId);
	dataArray.push(activityData);

	var returnArray = [];
	returnArray.push(dataArray);	//dataArray = checkinData / leaderboardData / activityData
	returnArray.push(idArray);		//idArray = checkinId / leaderboardId / activityId
	
	return returnArray;
};
