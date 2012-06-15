//bootstrap database

var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS tvprograms(id TEXT PRIMARY KEY, name TEXT, photo TEXT, start_time TEXT, recurring_until TEXT, number_checkins INTEGER, channel_id TEXT, program_id TEXT);');
db.close();

exports.tvprogramsModel_insertAllPrograms = function(_allPrograms) {
	var fetchedPrograms = [];
	var db = Ti.Database.open('Chatterbox'); 
	
	db.execute('DELETE FROM tvprograms');
	
	for(var i =0;i<_allPrograms.length;i++) {
		db.execute('INSERT INTO tvprograms(id,name,photo,start_time,recurring_until,channel_id,program_id) VALUES(?,?,?,?,?,?,?)',
		_allPrograms[i].id,_allPrograms[i].name,_allPrograms[i].photo,_allPrograms[i].start_time,_allPrograms[i].recurring_until,_allPrograms[i].channel_id,_allPrograms[i].program_id);
	}
	db.close();
};


exports.TVProgramModel_updateCheckins = function(targetedProgramId,numCheckins) {	
	var db = Ti.Database.open('Chatterbox'); 
	db.execute("UPDATE tvprograms SET number_checkins = ? WHERE id = ?",numCheckins,targetedProgramId);
	db.close();
}; 


exports.TVProgramModel_countCheckins = function(_eventId){
	var db = Ti.Database.open('Chatterbox');
	var result = db.execute('SELECT COUNT(number_checkins) as numCheckinsOfProgram  FROM tvprograms WHERE id = ?',_eventId);
	number_checkins = Number(result.fieldByName('numCheckinsOfProgram'));
	result.close();
	db.close();
	return number_checkins;
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
			program_id: result.fieldByName('program_id'),
			hasChild:true
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedPrograms;
};

exports.TVProgramModel_fetchProgramsWithProgramId = function(_programId) {
	//select some stuff from the local db..based on the future filtering
	var fetchedPrograms = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM tvprograms WHERE program_id = ? ORDER BY start_time ASC',_programId);
	while(result.isValidRow()) {
		fetchedPrograms.push({
			id: result.fieldByName('id'),
			name: result.fieldByName('name'),
			photo: result.fieldByName('photo'),
			start_time: result.fieldByName('start_time'),
			recurring_until: result.fieldByName('recurring_until'),
			number_checkins: result.fieldByName('number_checkins'),
			channel_id: result.fieldByName('channel_id'),
			program_id: result.fieldByName('program_id'),
			hasChild:true
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedPrograms;
};


exports.TVProgramModel_getProgramNameWithProgramId = function(_programId) {
	//select some stuff from the local db..based on the future filtering
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT name FROM tvprograms WHERE program_id = ? ORDER BY start_time ASC',_programId);
	var programName = ""
	while(result.isValidRow()) {
		programName = result.fieldByName('name');
		break;
	}	
	result.close();
	db.close();
	return programName;
};


exports.TVProgramModel_fetchPopularPrograms = function() {
	var fetchedPrograms = [];
	var now = moment().format('YYYY-MM-DDTHH:mm:ss');
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM tvprograms WHERE start_time <= ? AND ? <= recurring_until ORDER BY start_time ASC', now,now);
	
	while(result.isValidRow()) {
		
		fetchedPrograms.push({
			id: result.fieldByName('id'),
			name: result.fieldByName('name'),
			photo: result.fieldByName('photo'),
			start_time: result.fieldByName('start_time'),
			recurring_until: result.fieldByName('recurring_until'),
			number_checkins: result.fieldByName('number_checkins'),
			channel_id: result.fieldByName('channel_id'),
			program_id: result.fieldByName('program_id'),
			hasChild:true
		});
		Ti.API.info('Name: '+result.fieldByName('name'));
		Ti.API.info('Start: '+result.fieldByName('start_time'));
		Ti.API.info('Recurring: '+result.fieldByName('recurring_until'));
		Ti.API.info('Now: '+now);
			
		result.next();
	}	
	result.close();
	db.close();
	return fetchedPrograms;
};

exports.TVProgramModel_fetchShowtimeSelection = function(_start){
	var fetchedPrograms = [];
	var now = moment(); 
	var year = now.year();
	var month = now.month();
	month+=1;
	var day = now.date();
	var timeStr = year+'-0'+month+'-'+day+'T'+_start+':00:00+0000';
	_start+=1;
	var endStr = year+'-0'+month+'-'+day+'T'+_start+':00:00+0000';
	
	//Ti.API.info('timeStr: '+timeStr);
	//Ti.API.info('endStr: '+endStr);
	
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM tvprograms WHERE start_time <= ? AND ? <= recurring_until ORDER BY start_time ASC', timeStr,endStr);
	while(result.isValidRow()) {
		fetchedPrograms.push({
			id: result.fieldByName('id'),
			name: result.fieldByName('name'),
			photo: result.fieldByName('photo'),
			start_time: result.fieldByName('start_time'),
			recurring_until: result.fieldByName('recurring_until'),
			number_checkins: result.fieldByName('number_checkins'),
			channel_id: result.fieldByName('channel_id'),
			program_id: result.fieldByName('program_id'),
			hasChild:true
		});
		Ti.API.info('Name: '+result.fieldByName('name'));
		Ti.API.info('Start: '+result.fieldByName('start_time'));
		Ti.API.info('Recurring: '+result.fieldByName('recurring_until'));
		result.next();
	}	
	result.close();
	db.close();
	return fetchedPrograms;
};
