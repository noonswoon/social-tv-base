var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS checkins(id INTEGER PRIMARY KEY,checkin_acs_id TEXT, event_id TEXT, score INTEGER, user_id TEXT, updated_at TEXT, program_id TEXT);');
db.close();

// create data for local database
exports.checkinModel_updateCheckinsFromACS = function(_checkinsCollection) {
//	Ti.API.info('checkinModel_updateCheckinsFromACS');
	var db = Ti.Database.open('Chatterbox'); 
	//need to clear records with the given programId
	db.execute('DELETE FROM checkins');
	var countCheckinsFromDb = 0;
	for(var i=0;i < _checkinsCollection.length; i++) {
		var curCheckin = _checkinsCollection[i];
		db.execute("INSERT INTO checkins(id,checkin_acs_id,event_id,score,user_id,updated_at,program_id) VALUES(NULL,?,?,?,?,?,?)",curCheckin.id,curCheckin.event.id,curCheckin.custom_fields.score,curCheckin.user.id,curCheckin.updated_at,curCheckin.program_id);
		countCheckinsFromDb++;
	}
	Ti.API.info('countCheckinsFromDb = ' + countCheckinsFromDb);
	db.close();
	Ti.App.fireEvent("checkinsDbUpdated");
};

//haven't use this yet:9
//select data from local database
exports.checkin_fetchCheckin = function() {
	var fetchedCheckin = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM checkins');
	while(result.isValidRow()) {
		fetchedCheckin.push({
			id: result.fieldByName('id'),
			checkin_acs_id: result.fieldByName('checkin_acs_id'),
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

//don't use this?
//function: count checkins
// exports.checkins_count = function(_user){
	// var db = Ti.Database.open('Chatterbox'); 
	// var result = db.execute('SELECT COUNT(?) as checkins_count from checkins',_user);
	// var checkins = Number(result.fieldByName('checkins_count'));
	// result.close();
	// db.close();
	// return checkins;
// };

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
