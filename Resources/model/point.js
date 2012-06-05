var db = Ti.Database.open('Chatterbox');
//db.execute('CREATE TABLE IF NOT EXISTS points(id TEXT PRIMARY KEY, user_id TEXT, point INTEGER, earned_by TEXT, object TEXT);');
db.execute('CREATE TABLE IF NOT EXISTS leaderboard(id INTEGER PRIMARY KEY, user_id TEXT, name TEXT, totalPoint INTEGER);');
db.close();

//LEADERBOARD
//create new table to collect : user + totalPoint
exports.pointModel_updateLeadersFromACS = function(_leadersCollection) {
	var db = Ti.Database.open('Chatterbox'); 

	db.execute('DELETE FROM leaderboard');
	// var result = db.execute('SELECT * FROM leaderboard');
	// var dummyCount = 0;
	// while(result.isValidRow()) {
		// dummyCount++;
		// result.next();
	// }
	// Ti.API.info('numRows in leaderboard after deleted: '+dummyCount);
	for(var i=0;i < _leadersCollection.length; i++) {
		var curRank = _leadersCollection[i];
		var name =  curRank.user.first_name +' '+ curRank.user.last_name;
		db.execute("INSERT INTO leaderboard(id, user_id, name, totalPoint) VALUES(NULL,?,?,?)", curRank.user.id, name, curRank.totalPoint);
	}
	Ti.API.info('leaderBoard database length: '+ i);
	db.close();
	Ti.App.fireEvent("LeaderDbUpdated");
};

//fetch only user's point
exports.pointModel_fetchMyPoint = function(_user) {
	var fetchedRank = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT totalPoint FROM leaderboard WHERE user_id = ?',_user)
	var totalPoint = Number(result.fieldByName('totalPoint'));
	result.close();
	db.close();
	return totalPoint;
};

//fetch all friends + user's point
exports.pointModel_fetchRank = function() {
	var fetchedRank = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM leaderboard ORDER BY totalPoint');
	while(result.isValidRow()) {
		fetchedRank.push({
		user_id: result.fieldByName('user_id'),
		name: result.fieldByName('name'),
		totalPoint: Number(result.fieldByName('totalPoint'))
		});
		result.next();
	}
	result.close();
	db.close();
	return fetchedRank;
};

exports.pointModel_updateLeaderToACS = function(_point) {
	var db = Ti.Database.open('Chatterbox');
	var result = db.execute('SELECT id, totalPoint FROM leaderboard where user_id = ?', _point.user_id);
	
	var newId = 0;
	var isExisted = false;
	var userPoints = 0;
	while(result.isValidRow()) {
		isExisted = true;
		userPoints = Number(result.fieldByName('totalPoint'));
		newId = Number(result.fieldByName('id'));
		break;
	}
	
	if(isExisted) {
		db.execute('UPDATE leaderboard SET totalPoint = ? where user_id = ?', userPoints+_point.point, _point.user_id);
	} else {
		//insert something here
		db.execute("INSERT INTO leaderboard(id, user_id, name, totalPoint) VALUES(NULL,?,?,?)", _point.user_id, _point.name, _point.point);		
		//get newId
		newId = db.lastInsertRowId;
	}

	result.close();
	db.close();
	Ti.App.fireEvent("LeaderDbUpdated");
	return newId;
	//return fetchedRank;
};

// create data for local database
// exports.pointModel_updatePointsFromACS = function(_pointsCollection) {
	// var db = Ti.Database.open('Chatterbox'); 
	// //need to clear records with the given programId
	// var result = db.execute('DELETE FROM points');
	// for(var i=0;i < _pointsCollection.length; i++) {
		// var curPoint = _pointsCollection[i];
		// db.execute("INSERT INTO points(id,user_id,point,earned_by,object) VALUES(?,?,?,?,?)", curPoint.id,curPoint.user_id,curPoint.point,curPoint.earned_by, curPoint.object);
	// }
	// db.close();
	// Ti.App.fireEvent("pointsDbUpdated");
// };

//select data from local database
// exports.point_fetchPoint = function() {
	// var fetchedPoint = [];
	// var db = Ti.Database.open('Chatterbox'); 
	// var result = db.execute('SELECT * FROM points');
	// while(result.isValidRow()) {
		// fetchedPoint.push({
			// id: result.fieldByName('id'),
			// user_id: result.fieldByName('user_id'),
			// point: Number(result.fieldByName('point')),
			// earned_by: result.fieldByName('earned_by'),
			// object: result.fieldByName('object')
		// });
		// result.next();
	// }
	// result.close();
	// db.close();
	// return fetchedPoint;
// };
// 
// exports.points_updateNewPoint = function(_pointsCollection) {
	// var db = Ti.Database.open('Chatterbox'); 
	// var curPoint = _pointsCollection;
	// db.execute("INSERT INTO points(id,user_id,point,earned_by,object) VALUES(?,?,?,?,?)", curPoint.id,curPoint.user_id,curPoint.point,curPoint.earned_by, curPoint.object);
	// db.close();
	// Ti.App.fireEvent("updateNewPoint");
// };
// 
// //DONT USE LAEW NA!
// exports.points_sumPoints = function(){
		// var db = Ti.Database.open('Chatterbox'); 
		// var result = db.execute('SELECT SUM(point) as totalPoint from points');
		// var totalPoint = Number(result.fieldByName('totalPoint'));
	// //	var total = db.execute('SELECT SUM(point) as totalPoint from points');
		// db.close();
		// return totalPoint;
// };


