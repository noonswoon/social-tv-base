var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS checkins(id INTEGER PRIMARY KEY,checkin_acs_id TEXT, event_id TEXT, score INTEGER, user_id TEXT, updated_at TEXT);');
db.close();

// create data for local database
exports.checkinModel_updateCheckinsFromACS = function(_checkinsCollection) {
//	Ti.API.info('checkinModel_updateCheckinsFromACS');
	var db = Ti.Database.open('Chatterbox'); 
	//need to clear records with the given programId
	db.execute('DELETE FROM checkins');
	for(var i=0;i < _checkinsCollection.length; i++) {
		var curCheckin = _checkinsCollection[i];
		curCheckin.updated_at = convertACSTimeToLocalTime(curCheckin.updated_at);
		db.execute("INSERT INTO checkins(id,checkin_acs_id,event_id,score,user_id,updated_at) VALUES(NULL,?,?,?,?,?)",curCheckin.id,curCheckin.event.id,curCheckin.custom_fields.score,curCheckin.user.id,curCheckin.updated_at);
	}
	db.close();
};


exports.checkin_fetchCheckinToday = function() {
	var fetchedCheckin = [];
	var db = Ti.Database.open('Chatterbox'); 
	var startOfDay = moment().sod().format('YYYY-MM-DDTHH:mm:ss');
	var result = db.execute('SELECT * FROM checkins where updated_at >= ?',startOfDay);
	while(result.isValidRow()) {
		fetchedCheckin.push({
			id: result.fieldByName('id'),
			checkin_acs_id: result.fieldByName('checkin_acs_id'),
			event_id: result.fieldByName('event_id'),
			score: Number(result.fieldByName('score')),
			user_id: result.fieldByName('user_id'),
			updated_at: result.fieldByName('updated_at')
		});
		result.next();
	}
	result.close();
	db.close();
	return fetchedCheckin;
};

//create checkin into database:)
exports.checkin_create = function(_checkinsCollection){
	var db = Ti.Database.open('Chatterbox'); 
	var curCheckin = _checkinsCollection;
	var now = moment().format('YYYY-MM-DDTHH:mm:ss');
	db.execute("INSERT INTO checkins(id,checkin_acs_id,event_id,score,user_id,updated_at) VALUES(NULL,NULL,?,?,?,?)",curCheckin.event_id,curCheckin.score,curCheckin.user_id,now);
	var newId = db.lastInsertRowId;
	Ti.API.info('checkin_create / db.lastInsertRowId: '+ newId);
	db.close();
	//return to helpers/updateActivity.js to continue updating
	//Ti.App.fireEvent("oneCheckinUpdated");
	//,{id: curCheckin.id}
	return newId;
};

exports.checkin_updateOne = function(_checkin){
	var db = Ti.Database.open('Chatterbox'); 
	var curCheckin = _checkin;
	db.execute("UPDATE checkins SET checkin_acs_id = ? WHERE id= ?",curCheckin.id,curCheckin.custom_fields.local_id);
	Ti.API.info("checkin_updateOne success");
	Ti.API.info("checkin database row: " + curCheckin.custom_fields.local_id + " checkin acs id: " + curCheckin.id);
	db.close();
};

//function: IsCheckin
exports.checkin_isCheckin = function(_eventId){
	var isCheckin = false
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM checkins WHERE event_id = ?',_eventId);
	if(result.isValidRow()){
		isCheckin = true;
	}
	result.close();
	db.close();
	return isCheckin;
};