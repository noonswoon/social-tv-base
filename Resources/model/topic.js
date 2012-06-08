//bootstrap database

var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS topics(id INTEGER PRIMARY KEY, acs_object_id TEXT, program_id TEXT, title TEXT, comments_count INTEGER, username TEXT, device_token_id TEXT, is_deleted INTEGER,updated_at TEXT);');
db.close();

exports.topicModel_fetchFromProgramId = function(_programId) {
	var fetchedTopics = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM topics WHERE program_id = ? AND is_deleted = 0 ORDER BY updated_at DESC',_programId);
	while(result.isValidRow()) {
		fetchedTopics.push({
			title: result.fieldByName('title'),
			id: Number(result.fieldByName('id')),
			acsObjectId: result.fieldByName('acs_object_id'),
			hasChild:true,
			color: '#fff',
			commentsCount: Number(result.fieldByName('comments_count')),
			username: result.fieldByName('username'),
			updatedAt: result.fieldByName('updated_at')
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedTopics;
};

exports.topicModel_fetchWithKeywords = function(_keywordsStr,_programId) {
	var fetchedTopics = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute("SELECT * FROM topics WHERE program_id = ? AND title LIKE \'%"+_keywordsStr+"%\' AND is_deleted = 0 ORDER BY updated_at DESC",_programId);
	while(result.isValidRow()) {
		fetchedTopics.push({
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
	return fetchedTopics;
};

exports.topicModel_getTopicById = function(_topicACSObjectId) {
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM topics WHERE acs_object_id = ?',_topicACSObjectId);
	if(result.rowCount > 1) 
		alert("something wrong with getTopic, should return just 1 [returning too many topics]");
	var topic = {};
	while(result.isValidRow()) {
		topic.id = result.fieldByName('id'); 
		topic.acsObjectId = result.fieldByName('acs_object_id'); 
		topic.title = result.fieldByName('title');
		topic.username = result.fieldByName('username');
		topic.deviceTokenId = result.fieldByName('device_token_id');
		topic.updatedAt = result.fieldByName('updated_at')
		result.next();
	}	
	result.close();
	db.close();
	return topic;
};

exports.topicModel_updateACSObjectIdField = function(_topic) {
	var db = Ti.Database.open('Chatterbox');
	var acsObjectId = _topic.id;
	var localId = _topic.custom_fields.local_id;
	db.execute("UPDATE topics SET acs_object_id = ? WHERE id = ?", acsObjectId, localId);
	db.close();
};

var add = function(_programId,_acsObjectId,_title,_username,_deviceTokenId) {
	var db = Ti.Database.open('Chatterbox');
	var updatedAt = moment().format("YYYY-MM-DDTHH:mm:ss");
	db.execute("INSERT INTO topics(id,acs_object_id,program_id,title,comments_count,username,device_token_id,is_deleted,updated_at) VALUES(NULL,?,?,?,0,?,?,0,?)",_acsObjectId, _programId,_title,_username,_deviceTokenId,updatedAt);
	var newId = db.lastInsertRowId;
	db.close();
	
	return newId;
};
exports.topicModel_add = add;


exports.topicModel_updateTopicsFromACS = function(_topicsCollection, _programId) {
	var db = Ti.Database.open('Chatterbox'); 
	
	//need to clear records with the given programId
	db.execute('DELETE FROM topics WHERE program_id = ?',_programId);
	
	for(var i=0;i < _topicsCollection.length; i++) {
		var curTopic = _topicsCollection[i];
		db.execute("INSERT INTO topics(id,acs_object_id,program_id,title,comments_count, username,device_token_id, is_deleted,updated_at) VALUES(NULL,?,?,?,?,?,?,?,?)", 
					curTopic.id,_programId,curTopic.title,curTopic.commentsCount, curTopic.user.username,curTopic.user.custom_fields.device_token_id,curTopic.isDeleted, convertACSTimeToLocalTime(curTopic.updatedAt));
	}
	db.close();
	Ti.App.fireEvent("topicsDbUpdated");
};
