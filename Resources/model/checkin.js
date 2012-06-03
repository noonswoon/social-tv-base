var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS checkins(id TEXT PRIMARY KEY, event_id TEXT, score INTEGER, user_id TEXT, updated_at TEXT, program_id TEXT);');
db.close();


// create data for local database
exports.checkinModel_updateCheckinsFromACS = function(_checkinsCollection) {
//	Ti.API.info('checkinModel_updateCheckinsFromACS');
	var db = Ti.Database.open('Chatterbox'); 
	//need to clear records with the given programId
	db.execute('DELETE FROM checkins');
	for(var i=0;i < _checkinsCollection.length; i++) {
		var curCheckin = _checkinsCollection[i];
		db.execute("INSERT INTO checkins(id,event_id,score,user_id,updated_at,program_id) VALUES(?,?,?,?,?,?)", curCheckin.id,curCheckin.event.id,curCheckin.custom_fields.score,curCheckin.user.id,curCheckin.updated_at,curCheckin.program_id);
	}
	db.close();
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
			user_id: result.fieldByName('user_id'),
			updated_at: result.fieldByName('updated_at'),
			program_id: result.fieldByName('program_id')
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
	result.close();
	db.close();
	return totalScore;
};

//function: count checkins

exports.checkins_count = function(_user){
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT COUNT(?) as checkins_count from checkins',_user);
	var checkins = Number(result.fieldByName('checkins_count'));
	result.close();
	db.close();
	return checkins;
};

// 'select count(id) as user_checkin_count where username="titaniummick"'

exports.checkin_create = function(_checkinsCollection){
	var db = Ti.Database.open('Chatterbox'); 
	var curCheckin = _checkinsCollection;
	db.execute("INSERT INTO checkins(id,event_id,score,user_id,updated_at) VALUES(?,?,?,?,?)", curCheckin.id,curCheckin.event.id,curCheckin.custom_fields.score,curCheckin.user.id,curCheckin.updated_at);
	db.close();
	Ti.App.fireEvent("oneCheckinUpdated",{
		id: curCheckin.id
	});
};
