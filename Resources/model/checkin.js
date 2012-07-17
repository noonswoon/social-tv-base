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
		//Ti.API.info('insert updateCheckinsFromACS: '+curCheckin.event.id+', eventName is: '+curCheckin.event.name);
		db.execute("INSERT INTO checkins(id,checkin_acs_id,event_id,score,user_id,updated_at) VALUES(NULL,?,?,?,?,?)",curCheckin.id,curCheckin.event.id,curCheckin.custom_fields.score,curCheckin.user.id,curCheckin.updated_at);
	}
	db.close();
};


exports.checkin_fetchCheckinToday = function(_userId) { 
	var fetchedCheckin = [];
	var db = Ti.Database.open('Chatterbox'); 
	var startOfDay = moment().sod().format('YYYY-MM-DDTHH:mm:ss');
	var result = db.execute('SELECT * FROM checkins where updated_at >= ? AND user_id = ?',startOfDay,_userId); 
	while(result.isValidRow()) {
		Ti.API.info('fetchCheckinToday: '+result.fieldByName('event_id'));
	
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
exports.checkin_create = function(_newCheckin,_userId){
	var userId = _userId.id;
	var userScore = _newCheckin.score;
	var db = Ti.Database.open('Chatterbox'); 
	var now = moment().format('YYYY-MM-DDTHH:mm:ss');
	
	db.execute("INSERT INTO checkins(id,checkin_acs_id,event_id,score,user_id,updated_at) VALUES(NULL,NULL,?,?,?,?)",_newCheckin.event_id,userScore,_newCheckin.user_id,now);
	var newId = db.lastInsertRowId;
	//Ti.API.info('checkin_create / db.lastInsertRowId: '+ newId);
	db.close();
	//return to helpers/updateActivity.js to continue updating
	//Ti.App.fireEvent("oneCheckinUpdated");
	//,{id: curCheckin.id}
	return newId;
};

//create checkin into database:)
exports.checkin_insertFriendsCheckinsToday = function(_checkinInfo,_friendId){
	var db = Ti.Database.open('Chatterbox'); 
	var now = moment().format('YYYY-MM-DDTHH:mm:ss');
	
	db.execute("INSERT INTO checkins(id,checkin_acs_id,event_id,score,user_id,updated_at) VALUES(NULL,0,?,0,?,?)",_checkinInfo.id,userScore,_friendId,now);
	Ti.API.info('adding checkin of friend: friendId '+ _friendId+', on eventId: '+_checkinInfo.id);
	db.close();
};


exports.checkin_updateOne = function(_checkin, _userId){ //need userId
	var db = Ti.Database.open('Chatterbox'); 
	var curCheckin = _checkin;
	db.execute("UPDATE checkins SET checkin_acs_id = ? WHERE id= ? AND user_id = ?",curCheckin.id,curCheckin.custom_fields.local_id,_userId);
	//Ti.API.info("checkin_updateOne success");
	//Ti.API.info("checkin database row: " + curCheckin.custom_fields.local_id + " checkin acs id: " + curCheckin.id);
	db.close();
};

//function: IsCheckin
exports.checkin_isCheckin = function(_eventId,_userId){
	var isCheckin = false
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM checkins WHERE event_id = ? AND user_id = ?',_eventId,_userId); 
	if(result.isValidRow()){
		isCheckin = true;
	}
	result.close();
	db.close();
	return isCheckin;
};
