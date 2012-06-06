/* 4 possible activity
 * 		1. checkin		(+10)
 * 		2. post topic	(+5)
 * 		3. comment		(+1)
 * 		4. get badge	(+10)
 */

exports.updateActivity_myDatabase = function(_type,_act){
	var id = acs.getUserId();
	var name = acs.getUserLoggedIn().first_name + ' '+ acs.getUserLoggedIn().last_name;
	var _point;
	switch (_type){
		case 'checkin': {
	  		Ti.API.info("update type:"+_type);
	  		_point = 10;
	  		var CheckinModel = require('model/checkin');
	  		var checkinActivity = {
	  		event_id: _act.programId,
	  		user_id: id,
			score: _point};
	  		
	  		typeID = CheckinModel.checkin_create(checkinActivity);
	  		//id, event_id, score, user_id, updated_at
			break;
		};
		case 'post': {
	  		Ti.API.info("update type:"+_type);
	  		//insert command
	  		_point = 5;
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
			_point = 10;	
			break;
		};
		
		default: {
			Ti.API.info("_default");
		};
	};

	var PointModel = require('model/point');
	var ActivityModel = require('model/activity');
	var BadgeCondition = require('helpers/badgeCondition');
	
	// 1. update leaderboard + level
	var pointUpdate = {
		user_id: id,
		name: name,
		point: _point
	};
	leaderID = PointModel.pointModel_updateLeaderToACS(pointUpdate);
	// 2. update activity
	activityID = ActivityModel.activityModel_create(_act,_type);
		//user_id,targetedUserID,category,targetedObjectID,additionalData
	// 3. check badge
	BadgeCondition.badgeCondition_check();	
	
		var localID = {
		type:  typeID,
		leader: leaderID,
		activity: activityID
	};
	alert('create localID');
};

exports.updateActivity_callACS = function(_id,_act){
	
};