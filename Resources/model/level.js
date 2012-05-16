
var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS levels(level TEXT PRIMARY KEY, exp INTEGER, tag TEXT);');
db.close();

// create data for local database
exports.levelModel_updateLevelFromACS = function(_levelsCollection) {
	Ti.API.info('LEVEL LOAD');
	var db = Ti.Database.open('Chatterbox'); 
	//	var version = 'v001';
	db.execute('DELETE FROM levels');
	for(var i=0;i < _levelsCollection.length; i++) {
	//Ti.API.info('Tag for level is '+_levelsCollection[i].tag);
	//	if(_levelsCollection[i].tag!==version){
	//	Ti.API.info('Write new level');
		var curLevel = _levelsCollection[i];
		db.execute("INSERT INTO levels(level,exp,tag) VALUES(?,?,?)", curLevel.level,curLevel.exp,curLevel.tag);
	//	}
	//	else {Ti.API.info('SAME TAG');};
	}
	db.close();
	Ti.App.fireEvent("levelDbUpdated");
};

//select data from local database
exports.level_fetchLevel = function() {
	var fetchedLevel = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM levels');
	while(result.isValidRow()) {
		fetchedLevel.push({
			level: result.fieldByName('level'),
			exp: Number(result.fieldByName('exp')),
			tag: result.fieldByName('tag')
		});
		result.next();
	}
	result.close();
	db.close();
	return fetchedLevel;
};

exports.level_checkLevel = function(_exp) {
	Ti.API.info('level_checkLevel');
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * from levels where ? < exp ORDER BY exp ASC limit 0,1',_exp);
	var myLevel = result.fieldByName('level');
	result.close();
	db.close();
	return myLevel;
};

exports.level_nextLevel = function(_exp) {
	Ti.API.info('level_nextLevel');
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * from levels where ? < exp ORDER BY exp ASC limit 0,1',_exp);
	var NextLevel = Number(result.fieldByName('exp'));
	result.close();
	db.close();
	return NextLevel;
};
