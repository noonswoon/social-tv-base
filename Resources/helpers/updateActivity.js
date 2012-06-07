/* 4 possible activity
 * 		1. checkin		(+5)
 * 		2. comment		(+1)
 * 		3. get badge	(+5)
 */
exports.updateActivity_myDatabase = function(_type,_act){
	var id = acs.getUserId();
	var name = acs.getUserLoggedIn().first_name + ' '+ acs.getUserLoggedIn().last_name;
	var BadgeCondition = require('helpers/badgeCondition'); //checking condition to add badge
	var _point;
	var	resultArray = [];
	var idArray = [];
	
	switch (_type){
		case 'checkin': {
	  		Ti.API.info("update type:"+_type);
	  		_point = 5;
// 1. update checkin / activity data	
	  		var CheckinModel = require('model/checkin');
	  		var checkinData = {
	  			event_id: _act.programId,
	  			user_id: id,
				score: _point
			};
	  		checkinId = CheckinModel.checkin_create(checkinData);
	  		//return local id from checkin database /temporary -> update everytime when start application (= delete all database + clear local id)
	  		idArray.push(checkinId);
			resultArray.push(checkinData);
			
			//prepared activity data to insert into activiy database
			var activityData = {
				user_id: id,
				targetedUserID: id,
				category: 'checkin',
				targetedObjectID: _act.programId,
				additionalData: _act.programTitle,
			};

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
			_point = 5;	
			break;
		};
		default: {
			Ti.API.info("_default");
		};
	};

	var PointModel = require('model/point');
	var ActivityModel = require('model/activity');
// 2. update leaderboard
	var leaderboardData = {
		user_id: id,
		name: name,
		point: _point
	};
	var leaderboard =[]; //acs id + newPoint
	leaderboard = PointModel.pointModel_updateLeaderToACS(leaderboardData);
	leaderboardACSid = leaderboard[0];
	leaderboardData.point = Number(leaderboard[1]);
	idArray.push(leaderboardACSid);
	resultArray.push(leaderboardData);
// 3. update activity
	activityId = ActivityModel.activityModel_create(activityData);
	idArray.push(activityId);
	resultArray.push(activityData);

	//alert('update activity: create local database');
	var returnArray = [];
	returnArray.push(resultArray);
	returnArray.push(idArray);
	return returnArray;
	//result array = checkinData / leaderboardData / activityData
	//idArray = checkinId / leaderboardId / activityId
};
