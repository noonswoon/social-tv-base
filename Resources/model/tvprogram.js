//bootstrap database

var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS tvprograms(id TEXT PRIMARY KEY, name TEXT, photo TEXT, start_time TEXT, recurring_until TEXT, number_checkins INTEGER, channel_id TEXT);');
db.close();

exports.tvprogramsModel_insertAllPrograms = function(_allPrograms) {
	var fetchedPrograms = [];
	var db = Ti.Database.open('Chatterbox'); 
	
	db.execute('DELETE FROM tvprograms');
	
	for(var i =0;i<_allPrograms.length;i++) {
		db.execute('INSERT INTO tvprograms(id,name,photo,start_time,recurring_until,channel_id) VALUES(?,?,?,?,?,?)',
		_allPrograms[i].id,_allPrograms[i].name,_allPrograms[i].photo,_allPrograms[i].start_time,_allPrograms[i].recurring_until,_allPrograms[i].channel_id);
	}
	// var numCheckin = checkinACS.checkinACS_fetchedCheckInOfProgram();
	// db.execute('INSERT INTO tvprograms(number_checkins) VALUES(?)',numCheckin);
	
	db.close();
	//Ti.App.fireEvent("tvprogramsDbUpdated");	
	Ti.App.fireEvent("tvprogramsTitlesLoaded");
	
	// return
};

exports.TVProgramModel_updateCheckins = function(targetedProgramId,numCheckins) {	
		var db = Ti.Database.open('Chatterbox'); 
		db.execute("UPDATE tvprograms SET number_checkins = ? WHERE id = ?",numCheckins,targetedProgramId);
		db.close();
}; 

exports.TVProgramModel_fetchPrograms = function() {
	//select some stuff from the local db..based on the future filtering
	var fetchedPrograms = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM tvprograms ORDER BY start_time ASC');
	while(result.isValidRow()) {
		fetchedPrograms.push({
			id: result.fieldByName('id'),
			name: result.fieldByName('name'),
			photo: result.fieldByName('photo'),
			start_time: result.fieldByName('start_time'),
			recurring_until: result.fieldByName('recurring_until'),
			number_checkins: result.fieldByName('number_checkins'),
			channel_id: result.fieldByName('channel_id'),
			hasChild:true
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedPrograms;
	//return that stuff to discoveryMainWindow
	
};