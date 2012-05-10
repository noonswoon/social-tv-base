var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS checkins(id TEXT PRIMARY KEY, event_id TEXT, score INTEGER, username TEXT, updated_at TEXT);');
db.close();


// create data for local database
exports.checkinModel_updateCheckinsFromACS = function(_checkinsCollection) {
	var db = Ti.Database.open('Chatterbox'); 
	//need to clear records with the given programId
	var result = db.execute('DELETE FROM checkins');
		
	for(var i=0;i < _checkinsCollection.length; i++) {
		var curCheckin = _checkinsCollection[i];
		db.execute("INSERT INTO checkins(id,event_id,score,username,updated_at) VALUES(?,?,?,?,?)", curCheckin.id,curCheckin.event_id,curCheckin.custom_fields.score,curCheckin.username,curCheckin.updated_at);
	}
	db.close();
	alert("about to fire checkinsDbUpdated event..");
	Ti.App.fireEvent("checkinsDbUpdated");
};

//select data from local database
exports.checkin_fetchCheckin = function() {
	var fetchedCheckin = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM checkins');
	while(result.isValidRow()) {
		fetchedCheckin.push({
			id: result.fieldByName('id'),
			event_id: result.fieldByName('event_id'),
			score: Number(result.fieldByName('score')),
			username: result.fieldByName('username'),
			updated_at: result.fieldByName('updated_at')
		});
		result.next();
	}
	result.close();
	db.close();
	return fetchedCheckin;
};

//function: sum score
exports.checkin_sumScore = function(){
		var db = Ti.Database.open('Chatterbox'); 
		var result = db.execute('SELECT SUM(score) as totalScore from checkins');
		var totalScore = Number(result.fieldByName('totalScore'));
		return totalScore;
};

//function: count checkins

exports.checkins_count = function(){
		var db = Ti.Database.open('Chatterbox'); 
		var result = db.execute('SELECT COUNT(*) as checkins_count from checkins');
		var checkins = Number(result.fieldByName('checkins_count'));
		return checkins;	
};
