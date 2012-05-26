var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS points(id TEXT PRIMARY KEY, user_id TEXT, point INTEGER, earned_by TEXT, object TEXT);');
db.close();


// create data for local database
exports.pointModel_updatePointsFromACS = function(_pointsCollection) {
	var db = Ti.Database.open('Chatterbox'); 
	//need to clear records with the given programId
	db.execute('DELETE FROM points');
	for(var i=0;i < _pointsCollection.length; i++) {
		var curPoint = _pointsCollection[i];
		db.execute("INSERT INTO points(id,user_id,point,earned_by,object) VALUES(?,?,?,?,?)", curPoint.id,curPoint.user_id,curPoint.point,curPoint.earned_by, curPoint.object);
	}
	db.close();
	Ti.App.fireEvent("pointsDbUpdated");
};

//select data from local database
exports.point_fetchPoint = function() {
	var fetchedPoint = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM points');
	while(result.isValidRow()) {
		fetchedPoint.push({
			id: result.fieldByName('id'),
			user_id: result.fieldByName('user_id'),
			point: Number(result.fieldByName('point')),
			earned_by: result.fieldByName('earned_by'),
			object: result.fieldByName('object')
		});
		result.next();
	}
	result.close();
	db.close();
	return fetchedPoint;
};

//function: sum score
exports.points_sumPoints = function(){
		var db = Ti.Database.open('Chatterbox'); 
		var result = db.execute('SELECT SUM(point) as totalScore from points');
		var totalScore = Number(result.fieldByName('totalScore'));

		result.close();
		db.close();
		return totalScore;
};

exports.points_updateNewPoint = function(_pointsCollection) {
	var db = Ti.Database.open('Chatterbox'); 
	var curPoint = _pointsCollection;
	db.execute("INSERT INTO points(id,user_id,point,earned_by,object) VALUES(?,?,?,?,?)", curPoint.id,curPoint.user_id,curPoint.point,curPoint.earned_by, curPoint.object);
	db.close();
	Ti.App.fireEvent("updateNewPoint");
};