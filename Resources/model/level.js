
var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS levels(level TEXT PRIMARY KEY, point INTEGER, exp INTEGER, tag TEXT);');
db.close();

// create data for local database
exports.levelModel_updateLevelFromACS = function(_levelsCollection) {
	Ti.API.info('LEVEL LOAD');
	var db = Ti.Database.open('Chatterbox'); 
	var version = 'v001';
	for(var i=0;i < _levelsCollection.length; i++) {
		Ti.API.info('Tag for level is '+_levelsCollection[i].tag);
		if(_levelsCollection[i].tag!==version){
		Ti.API.info('Write new level');
		db.execute('DELETE FROM levels');
			var curLevel = _levelsCollection[i];
			db.execute("INSERT INTO levels(level,point,exp,tag) VALUES(?,?,?,?)", curLevel.level,curLevel.point,curLevel.exp,curLevel.tag);
		}
		else {Ti.API.info('SAME TAG');};
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
			point: Number(result.fieldByName('point')),
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
	var db = Ti.Database.open('Chatterbox'); 
//	var result = db.execute('SELECT TOP 1 level FROM levels');
	var result = 0;
	alert(result);
	db.close();
	return result;
};
