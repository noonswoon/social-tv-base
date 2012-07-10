var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS leaderboard(id INTEGER PRIMARY KEY, leader_acs_id TEXT, user_id TEXT, fb_id TEXT, name TEXT, totalPoint INTEGER);');
db.close();

//LEADERBOARD
//create new table to collect : local_id / acs_id / user / name / totalPoint
//my friends and I \(^_^)/\(>_<)/
exports.pointModel_updateLeadersFromACS = function(_leadersCollection) {
	var db = Ti.Database.open('Chatterbox'); 
	db.execute('DELETE FROM leaderboard');
	for(var i=0;i < _leadersCollection.length; i++) {
		var curRank = _leadersCollection[i];
		var name =  curRank.user.first_name +' '+ curRank.user.last_name;
		db.execute("INSERT INTO leaderboard(id, leader_acs_id, user_id, fb_id, name, totalPoint) VALUES(NULL,?,?,?,?,?)", curRank.id, curRank.user.id, curRank.user.external_accounts[0].external_id, name, curRank.totalPoint);
	}
	db.close();
	Ti.App.fireEvent("leaderDbUpdated");
};

//fetch only user's point
exports.pointModel_fetchMyPoint = function(_user) {
	var totalPoint = 0;
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT totalPoint FROM leaderboard WHERE user_id = ?',_user);
	 if(result.isValidRow()) {
		totalPoint = Number(result.fieldByName('totalPoint'));
	 };
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
		fb_id: result.fieldByName('fb_id'),
		totalPoint: Number(result.fieldByName('totalPoint'))
		});
		result.next();
	}
	result.close();
	db.close();
	return fetchedRank;
};

//update point when getting score:)
exports.pointModel_updateLeaderToACS = function(_point) {
	var db = Ti.Database.open('Chatterbox');
	var result = db.execute('SELECT id, leader_acs_id, totalPoint FROM leaderboard where user_id = ?', _point.user_id);
	//var newId = 0;
	var isExisted = false;
	var userPoints = 0;
	var returnFromPointModel = []; //[0] = ACS id / [1] = new point
	while(result.isValidRow()) {
		isExisted = true;
		userPoints = Number(result.fieldByName('totalPoint'));
		acsId = result.fieldByName('leader_acs_id');
		newId = Number(result.fieldByName('id'));
		
		returnFromPointModel.push(acsId);
		break;
	}
	var newPoint = userPoints + _point.point;
	if(isExisted) {
		db.execute('UPDATE leaderboard SET totalPoint = ? where user_id = ?', newPoint, _point.user_id);
	} 

	returnFromPointModel.push(newPoint);
	result.close();
	db.close();
	return returnFromPointModel;
	//[0] = ACS id / [1] = new point
};


