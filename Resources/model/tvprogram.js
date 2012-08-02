//bootstrap database

var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS tvprograms(id TEXT PRIMARY KEY, name TEXT, subname TEXT, photo TEXT, start_time TEXT, recurring_until TEXT, number_checkins INTEGER, channel_id TEXT, program_id TEXT, program_type TEXT, program_country TEXT);');
db.close();

exports.TVProgramModel_insertAllPrograms = function(_allPrograms) {
	var fetchedPrograms = [];
	var db = Ti.Database.open('Chatterbox'); 
	
	db.execute('DELETE FROM tvprograms');
	
	for(var i =0;i<_allPrograms.length;i++) {
		db.execute('INSERT INTO tvprograms(id,name,subname, photo,start_time,recurring_until,channel_id,program_id, program_type, program_country) VALUES(?,?,?,?,?,?,?,?,?,?)',
			_allPrograms[i].id, _allPrograms[i].name, _allPrograms[i].subname, _allPrograms[i].photo,
			_allPrograms[i].start_time, _allPrograms[i].recurring_until, _allPrograms[i].channel_id,
			_allPrograms[i].program_id, _allPrograms[i].program_type, _allPrograms[i].program_country);
	}
	db.close();
};

exports.TVProgramModel_insertPrograms = function(_allPrograms) {
	var fetchedPrograms = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = null;		
	for(var i =0;i<_allPrograms.length;i++) {
		var result = db.execute('SELECT * FROM tvprograms WHERE program_id = ?', _allPrograms[i].program_id);
		if(!result.isValidRow()) {
			//only insert if the record doesn't exist
			db.execute('INSERT INTO tvprograms(id,name,subname, photo,start_time,recurring_until,channel_id,program_id, program_type, program_country) VALUES(?,?,?,?,?,?,?,?,?,?)',
				_allPrograms[i].id, _allPrograms[i].name, _allPrograms[i].subname, _allPrograms[i].photo,
				_allPrograms[i].start_time, _allPrograms[i].recurring_until, _allPrograms[i].channel_id,
				_allPrograms[i].program_id, _allPrograms[i].program_type, _allPrograms[i].program_country);			
		}
	}
	if(result !== null) result.close();
	db.close();
};

//chat window used: pull data from currentCheckin
exports.TVProgramModel_getPrograms = function(_programIds) {
	var programData = [];
	var db = Ti.Database.open('Chatterbox');
	for(var i=0;i<_programIds.length;i++) {
		var curProgramId = _programIds[i];
		var result = db.execute('SELECT * FROM tvprograms WHERE program_id = ?',curProgramId);
		while(result.isValidRow()) {
			programData.push({
				id: result.fieldByName('id'),
				name: result.fieldByName('name'),
				subname: result.fieldByName('subname'),
				photo: result.fieldByName('photo'),
				start_time: result.fieldByName('start_time'),
				recurring_until: result.fieldByName('recurring_until'),
				number_checkins: result.fieldByName('number_checkins'),
				channel_id: result.fieldByName('channel_id'),
				program_id: result.fieldByName('program_id'),
				program_type: result.fieldByName('program_type'),
				program_country: result.fieldByName('program_country'),
				hasChild:true				
			});
			result.next();
		}
		result.close();
		db.close;
	}
	return programData;
}
//id TEXT PRIMARY KEY, name TEXT, subname TEXT, photo TEXT, 
//start_time TEXT, recurring_until TEXT, number_checkins INTEGER, 
//channel_id TEXT, program_id TEXT, program_type TEXT

exports.TVProgramModel_updateCheckins = function(targetedProgramId,numCheckins,channelId) {	
	var db = Ti.Database.open('Chatterbox'); 
	var mockCheckin = 0;
	var numCheckinsAndMockup = 0;
	
	//getting start time
	var tvprogramInfo = TVProgramModel_fetchProgramOfEventId(targetedProgramId); 
	var now = moment().format('YYYY-MM-DDTHH:mm:ss');
	//Ti.API.info('tvprogram start time: '+tvprogramInfo.programStartTime);
	if(now >= tvprogramInfo.programStartTime) { //be evil smartly! will add mockNumber if the program is currently showing/already finished.
		var uniqueNum = 0;
		for(var i=0;i<targetedProgramId.length;i++){
			var character = targetedProgramId[i];
			if(character >= '0' && character <= '9'){
				var num = parseInt(character);
				uniqueNum += num;
			}
		}
		
		if(channelId === 'ch3'){
			mockCheckin = 454 + uniqueNum;
		} else if(channelId === 'ch5'){
			mockCheckin = 346 + uniqueNum;
		} else if(channelId === 'ch7'){
			mockCheckin = 389 + uniqueNum;
		} else if(channelId === 'ch9'){
			mockCheckin = 367 + uniqueNum;
		} else if(channelId === 'ch11'){
			mockCheckin = 289 + uniqueNum;
		} else if(channelId === 'pbs'){
			mockCheckin = 224 + uniqueNum;
		} else {
			mockCheckin = 218 + uniqueNum;
		}
	}
	numCheckinsAndMockup = numCheckins + mockCheckin;
	db.execute("UPDATE tvprograms SET number_checkins = ? WHERE id = ?",numCheckinsAndMockup,targetedProgramId);
	db.close();
	Ti.App.fireEvent("numberCheckinsUpdated",{eventId: targetedProgramId, numberCheckins: numCheckinsAndMockup});
}; 

//add 1 to numbercheckins
exports.TVProgramModel_incrementCheckins = function(_eventId) {	
	var db = Ti.Database.open('Chatterbox'); 
	
	//getting start time
	var tvprogramInfo = TVProgramModel_fetchProgramOfEventId(_eventId); 
	if(tvprogramInfo !== null && tvprogramInfo !== undefined) {
		var incrementNumberCheckins = tvprogramInfo.numberCheckins + 1;
		db.execute("UPDATE tvprograms SET number_checkins = ? WHERE id = ?",incrementNumberCheckins,_eventId);
	}
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
	var startOfTheDay = moment().sod().format('YYYY-MM-DDTHH:mm:ss');
	var db = Ti.Database.open('Chatterbox'); 
	
	var result = db.execute('SELECT * FROM tvprograms  WHERE start_time >= ? ORDER BY start_time',startOfTheDay);
	while(result.isValidRow()) {
		fetchedPrograms.push({
			id: result.fieldByName('id'),
			name: result.fieldByName('name'),
			subname: result.fieldByName('subname'),
			photo: result.fieldByName('photo'),
			start_time: result.fieldByName('start_time'),
			recurring_until: result.fieldByName('recurring_until'),
			number_checkins: result.fieldByName('number_checkins'),
			channel_id: result.fieldByName('channel_id'),
			program_id: result.fieldByName('program_id'),
			program_type: result.fieldByName('program_type'),
			hasChild:true
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedPrograms;
};

exports.TVProgramModel_fetchGuideProgramsOfChannel = function(_channelId) {
	//select some stuff from the local db..based on the future filtering
	var fetchedPrograms = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM tvprograms WHERE channel_id = ? ORDER BY start_time ASC',_channelId);
	while(result.isValidRow()) {
		fetchedPrograms.push({
			id: result.fieldByName('id'),
			name: result.fieldByName('name'),
			subname: result.fieldByName('subname'),
			photo: result.fieldByName('photo'),
			start_time: result.fieldByName('start_time'),
			recurring_until: result.fieldByName('recurring_until'),
			number_checkins: result.fieldByName('number_checkins'),
			channel_id: result.fieldByName('channel_id'),
			program_id: result.fieldByName('program_id'),
			program_type: result.fieldByName('program_type'),
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
	var result = db.execute('SELECT * FROM tvprograms WHERE program_id = ? ORDER BY start_time DESC',_programId);
	while(result.isValidRow()) {
		fetchedPrograms.push({
			id: result.fieldByName('id'),
			name: result.fieldByName('name'),
			subname: result.fieldByName('subname'),
			photo: result.fieldByName('photo'),
			start_time: result.fieldByName('start_time'),
			recurring_until: result.fieldByName('recurring_until'),
			number_checkins: result.fieldByName('number_checkins'),
			channel_id: result.fieldByName('channel_id'),
			program_id: result.fieldByName('program_id'),
			program_type: result.fieldByName('program_type'),
			hasChild:true
		});
		result.next();
	}	
	result.close();
	db.close();

	return fetchedPrograms;
};

exports.TVProgramModel_fetchProgramIdOfEventId = function(_eventId) {
	//select some stuff from the local db..based on the future filtering
	var programId = "";
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT program_id FROM tvprograms WHERE id = ?',_eventId);
	if(result.isValidRow()) {
		programId = result.fieldByName('program_id');
	}	
	result.close();
	db.close();
	return programId;
};

var TVProgramModel_fetchProgramOfEventId = function(_eventId) {
	var programEvent = null;
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM tvprograms WHERE id = ?',_eventId);
	if(result.isValidRow()) {
		programEvent = {
			eventId: _eventId, 
			programName: result.fieldByName('name'),
			programSubName: result.fieldByName('subname'),
			programImage: result.fieldByName('photo'),
			programStartTime: result.fieldByName('start_time'),
			programEndTime: result.fieldByName('recurring_until'),
			numberCheckins: result.fieldByName('number_checkins'),
			programChannelId: result.fieldByName('channel_id'),
			programId: result.fieldByName('program_id'),
			programType: result.fieldByName('program_type')
		};
	}
	result.close();
	db.close();
	return programEvent;
};
exports.TVProgramModel_fetchProgramOfEventId = TVProgramModel_fetchProgramOfEventId;


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
			subname: result.fieldByName('subname'),
			photo: result.fieldByName('photo'),
			start_time: result.fieldByName('start_time'),
			recurring_until: result.fieldByName('recurring_until'),
			number_checkins: result.fieldByName('number_checkins'),
			channel_id: result.fieldByName('channel_id'),
			program_id: result.fieldByName('program_id'),
			program_type: result.fieldByName('program_type'),
			hasChild:true
		});
		// Ti.API.info('Name: '+result.fieldByName('name'));
		// Ti.API.info('Start: '+result.fieldByName('start_time'));
		// Ti.API.info('Recurring: '+result.fieldByName('recurring_until'));
		// Ti.API.info('Now: '+now);
			
		result.next();
	}	
	result.close();
	db.close();
	return fetchedPrograms;
};

exports.TVProgramModel_fetchShowtimeSelection = function(_startTimeIndex){
	var fetchedPrograms = [];
	var nowYMD = moment().format('YYYY-MM-DD');
	
	var timeIndexStr = _startTimeIndex + "";
	if(_startTimeIndex < 10) timeIndexStr = "0"+timeIndexStr;
	timeIndexStr = nowYMD + 'T' + timeIndexStr+':00:00+0000';
	
	var nextSlotTimeIndex = _startTimeIndex + 1;
	var nextSlotTimeIndexStr = nextSlotTimeIndex  + "";
	if(nextSlotTimeIndex < 10) nextSlotTimeIndexStr = "0" + nextSlotTimeIndexStr;
	nextSlotTimeIndexStr = nowYMD + 'T' + nextSlotTimeIndexStr+':00:00+0000';
	
	var db = Ti.Database.open('Chatterbox'); 
	
	var result = db.execute('SELECT * FROM tvprograms WHERE (start_time <= ? AND ? <= recurring_until) OR ( ? <= start_time AND start_time <= ? ) ORDER BY start_time ASC', timeIndexStr,timeIndexStr, timeIndexStr, nextSlotTimeIndexStr);
	while(result.isValidRow()) {
		fetchedPrograms.push({
			id: result.fieldByName('id'),
			name: result.fieldByName('name'),
			subname: result.fieldByName('subname'),
			photo: result.fieldByName('photo'),
			start_time: result.fieldByName('start_time'),
			recurring_until: result.fieldByName('recurring_until'),
			number_checkins: result.fieldByName('number_checkins'),
			channel_id: result.fieldByName('channel_id'),
			program_id: result.fieldByName('program_id'),
			program_type: result.fieldByName('program_type'),
			hasChild:true
		});
		// Ti.API.info('Name: '+result.fieldByName('name'));
		// Ti.API.info('Start: '+result.fieldByName('start_time'));
		// Ti.API.info('Recurring: '+result.fieldByName('recurring_until'));
		result.next();
	}	
	result.close();
	db.close();
	return fetchedPrograms;
};
