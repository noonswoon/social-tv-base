var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS levels(levelName TEXT PRIMARY KEY, exp INTEGER);');
db.close();

// create data for local database
exports.levelModel_updateLevelFromACS = function(_levelsCollection) {
	var db = Ti.Database.open('Chatterbox'); 
	db.execute('DELETE FROM levels');
	for(var i=0;i < _levelsCollection.length; i++) {
		var curLevel = _levelsCollection[i];
		db.execute("INSERT INTO levels(levelName,exp) VALUES(?,?)", curLevel.levelName,curLevel.exp);
	}
	db.close();
	Ti.App.fireEvent('levelDbUpdated');
};

//select data from local database
exports.level_fetchLevel = function() {
	var fetchedLevel = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM levels');
	while(result.isValidRow()) {
		fetchedLevel.push({
			level: result.fieldByName('levelName'),
			exp: Number(result.fieldByName('exp'))
		});
		result.next();
	}
	result.close();
	db.close();
	return fetchedLevel;
};

exports.level_checkLevel = function(_exp) {
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * from levels where ? < exp ORDER BY exp ASC limit 0,1',_exp);
	var myLevel = result.fieldByName('levelName');
	result.close();
	db.close();
	return myLevel;
};

exports.level_nextLevel = function(_exp) {
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * from levels where ? < exp ORDER BY exp ASC limit 0,1',_exp);
	var NextLevel = Number(result.fieldByName('exp'));
	result.close();
	db.close();
	return NextLevel;
};
