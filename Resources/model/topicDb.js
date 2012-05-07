//bootstrap database
var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS topics(id TEXT PRIMARY KEY, program_id TEXT, title TEXT, username TEXT, updated_at TEXT);');
db.close();

exports.topicModel_fetchFromProgramId = function(_programId) {
	var fetchedTopics = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM topics WHERE program_id = ? ORDER BY updated_at DESC',_programId);
	while(result.isValidRow()) {
		fetchedTopics.push({
			title: result.fieldByName('title'),
			id: result.fieldByName('id'),
			hasChild:true,
			color: '#fff',
			username: result.fieldByName('username'),
			updated_at: result.fieldByName('updated_at')
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedTopics;
};

var add = function(_topic) {
	var db = Ti.Database.open('Chatterbox');
	db.execute("INSERT INTO topics(id,program_id,title,username,updated_at) VALUES(?,?,?,?,?)", _topic.id,_topic.custom_fields.program_id,_topic.title,_topic.user.username,_topic.updated_at);
	db.close();
	//fire message to let others know that database has changed
	Ti.App.fireEvent("topicsDbUpdated");
};
exports.topicModel_add = add;


exports.topicModel_updateTopicsFromACS = function(_topicsCollection, _programId) {
	var fetchedTopics = [];
	var db = Ti.Database.open('Chatterbox'); 
	
	//need to clear records with the given programId
	var result = db.execute('DELETE FROM topics WHERE program_id = ?',_programId);
	
	for(var i=0;i < _topicsCollection.length; i++) {
		var curTopic = _topicsCollection[i];
		db.execute("INSERT INTO topics(id,program_id,title,username,updated_at) VALUES(?,?,?,?,?)", curTopic.id,curTopic.program_id,curTopic.title,curTopic.user.username,curTopic.updated_at);
	}
	db.close();
	Ti.App.fireEvent("topicsDbUpdated");
};
/*
exports.del = function(_id) {
	var db = Ti.Database.open('TiBountyHunter');
	db.execute("DELETE FROM fugitives WHERE id = ?",_id);
	db.close();
	
	Ti.App.fireEvent("databaseUpdated");
};

exports.bust  = function(_id,_lat,_long) {
	var db = Ti.Database.open('TiBountyHunter');
	db.execute("UPDATE fugitives SET captured = 1, capturedLat = ?, capturedLong = ? WHERE id = ?",_lat,_long,_id);
	db.close();
	
	Ti.App.fireEvent("databaseUpdated");
};

if(!Ti.App.Properties.hasProperty('seeded')) {
	var networkFn = require('/lib/network');
	networkFn.getFugitives(function(list) {
		for(var i=0;i<list.length;i++) {
			var name = list[i]['name'];
			add(name);
		}
		Ti.App.Properties.setString('seeded','already');
	});
}
*/