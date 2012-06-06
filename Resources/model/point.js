var db = Ti.Database.open('Chatterbox');
//db.execute('CREATE TABLE IF NOT EXISTS points(id TEXT PRIMARY KEY, user_id TEXT, point INTEGER, earned_by TEXT, object TEXT);');
db.execute('CREATE TABLE IF NOT EXISTS leaderboard(id INTEGER PRIMARY KEY, leader_acs_id TEXT, user_id TEXT, name TEXT, totalPoint INTEGER);');
db.close();

//LEADERBOARD
//create new table to collect : user + totalPoint
exports.pointModel_updateLeadersFromACS = function(_leadersCollection) {
	var db = Ti.Database.open('Chatterbox'); 

	db.execute('DELETE FROM leaderboard');
	for(var i=0;i < _leadersCollection.length; i++) {
		var curRank = _leadersCollection[i];
		var name =  curRank.user.first_name +' '+ curRank.user.last_name;
		db.execute("INSERT INTO leaderboard(id, leader_acs_id, user_id, name, totalPoint) VALUES(NULL,?,?,?,?)", curRank.id, curRank.user.id, name, curRank.totalPoint);
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
	var result = db.execute('SELECT id, leader_acs_id, totalPoint FROM leaderboard where user_id = ?', _point.user_id);
	
	var newId = 0;
	var isExisted = false;
	var userPoints = 0;
	var returnPoint = []; //ACS id + new point
	while(result.isValidRow()) {
		isExisted = true;
		userPoints = Number(result.fieldByName('totalPoint'));
		acsId = result.fieldByName('leader_acs_id');
		newId = Number(result.fieldByName('id'));
		returnPoint.push(acsId);
		break;
	}
	var newPoint = userPoints + _point.point;
	if(isExisted) {
		db.execute('UPDATE leaderboard SET totalPoint = ? where user_id = ?', newPoint, _point.user_id);
	} else {
		//insert something here
		db.execute("INSERT INTO leaderboard(id, leader_acs_id, user_id, name, totalPoint) VALUES(NULL,NULL,?,?,?)", _point.user_id, _point.name, _point.point);		
		//get newId
		newId = db.lastInsertRowId;
	}
	returnPoint.push(newPoint);
	result.close();
	db.close();
	//Ti.App.fireEvent("LeaderDbUpdated");
	
	
	return returnPoint; //return object id on acs
};


