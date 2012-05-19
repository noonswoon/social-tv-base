//bootstrap database

var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS topics(id INTEGER PRIMARY KEY, acs_object_id TEXT, program_id TEXT, title TEXT, username TEXT, is_deleted INTEGER,updated_at TEXT);');
db.close();

exports.topicModel_fetchFromProgramId = function(_programId) {
	var bb = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM topics WHERE program_id = ? AND is_deleted = 0 ORDER BY updated_at DESC',_programId);
	while(result.isValidRow()) {
		bb.push({
			title: result.fieldByName('title'),
			id: Number(result.fieldByName('id')),
			acsObjectId: result.fieldByName('acs_object_id'),
			hasChild:true,
			color: '#fff',
			username: result.fieldByName('username'),
			updatedAt: result.fieldByName('updated_at')
		});
		result.next();
	}	
	result.close();
	db.close();
	return bb;
};

/*
exports.topicModel_getTopicById = function(_topicId) {
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM topics WHERE id = ?',_topicId);
	if(result.rowCount > 1) 
		alert("something wrong with getTopic, should return just 1 [returning too many topics]");
	var topic = {};
	while(result.isValidRow()) {
		topic.id = result.fieldByName('id'); 
		topic.title = result.fieldByName('title');
		topic.username = result.fieldByName('username');
		topic.updated_at = result.fieldByName('updated_at')
		result.next();
	}	
	result.close();
	db.close();
	return topic;
};
*/

var add = function(_programId,_acsObjectId,_title,_username) {
	var db = Ti.Database.open('Chatterbox');
	var updatedAt = moment().format("YYYY-MM-DDTHH:mm:ss");
	db.execute("INSERT INTO topics(id,acs_object_id,program_id,title,username,is_deleted,updated_at) VALUES(NULL,?,?,?,?,0,?)",_acsObjectId, _programId,_title,_username,updatedAt);
	
	var result = db.execute("SELECT last_insert_rowid() as new_id");
	var newId = result.fieldByName('new_id');

	result.close();
	db.close();
	//fire message to let others know that database has changed
	//Ti.App.fireEvent("topicsDbUpdated");
	
	return newId;
};
exports.topicModel_add = add;


exports.topicModel_updateTopicsFromACS = function(_topicsCollection, _programId) {
	var db = Ti.Database.open('Chatterbox'); 
	
	//need to clear records with the given programId
	db.execute('DELETE FROM topics WHERE program_id = ?',_programId);
	
	for(var i=0;i < _topicsCollection.length; i++) {
		var curTopic = _topicsCollection[i];
		db.execute("INSERT INTO topics(id,acs_object_id,program_id,title,username,is_deleted,updated_at) VALUES(NULL,?,?,?,?,?,?)", 
					curTopic.id,_programId,curTopic.title,curTopic.user.username,curTopic.isDeleted, curTopic.updatedAt);
	}
	db.close();
	Ti.App.fireEvent("topicsDbUpdated");
};
