//bootstrap database

var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS topics(id INTEGER PRIMARY KEY, acs_object_id TEXT, program_id TEXT, title TEXT, content TEXT, photo TEXT, comments_count INTEGER, user_id TEXT, username TEXT, device_token_id TEXT, is_deleted INTEGER,updated_at TEXT);');
db.close();

exports.topicModel_fetchFromProgramId = function(_programId) {
	var fetchedTopics = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM topics WHERE program_id = ? AND is_deleted = 0 ORDER BY updated_at DESC',_programId);
	while(result.isValidRow()) {
		//Ti.API.info('topic title: '+result.fieldByName('title'));
		fetchedTopics.push({
			title: result.fieldByName('title'),
			content: result.fieldByName('content'),
			photo: result.fieldByName('photo'),
			id: Number(result.fieldByName('id')),
			acsObjectId: result.fieldByName('acs_object_id'),
			hasChild:true,
			color: '#fff',
			commentsCount: Number(result.fieldByName('comments_count')),
			userId: result.fieldByName('user_id'),
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
			userId: result.fieldByName('user_id'),
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
		Debug.debug_print("something wrong with getTopic, should return just 1 [returning too many topics]");
	var topic = {};
	while(result.isValidRow()) {
		topic.id = result.fieldByName('id'); 
		topic.acsObjectId = result.fieldByName('acs_object_id'); 
		topic.title = result.fieldByName('title');
		topic.content = result.fieldByName('content');
		topic.photo = result.fieldByName('photo');
		topic.userId = result.fieldByName('user_id');
		topic.username = result.fieldByName('username');
		topic.deviceTokenId = result.fieldByName('device_token_id');
		topic.updatedAt = result.fieldByName('updated_at');
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

exports.topicModel_add = function(_programId,_acsObjectId,_title,_content,_photo,_userId,_username,_deviceTokenId) {
	var db = Ti.Database.open('Chatterbox');
	var updatedAt = moment().format("YYYY-MM-DDTHH:mm:ss");

	db.execute("INSERT INTO topics(id,acs_object_id,program_id,title,content,photo,comments_count,user_id,username,device_token_id,is_deleted,updated_at) VALUES(NULL,?,?,?,?,?,0,?,?,?,0,?)",_acsObjectId,_programId,_title,_content,_photo,_userId,_username,_deviceTokenId,updatedAt);
	var newId = db.lastInsertRowId;
	db.close();
	return newId;
};



exports.topicModel_updateTopicsFromACS = function(_topicsCollection, _programId) {
	var isTableChanged = false;
	var db = Ti.Database.open('Chatterbox'); 
	//need to clear records with the given programId ** don't delete anymore..just adding new ones
	//db.execute('DELETE FROM topics WHERE program_id = ?',_programId);
	//
	
	var result = null;
	for(var i=0;i < _topicsCollection.length; i++) {
		var curTopic = _topicsCollection[i];
		var deviceToken = "UNDEFINED";
		var photoUrl = null;
		if(curTopic.user.custom_fields !== undefined && curTopic.user.custom_fields.device_token_id !== undefined)
			deviceToken = curTopic.user.custom_fields.device_token_id;
		if(curTopic.photo !== undefined && curTopic.photo.urls !== undefined && curTopic.photo.urls.original !== undefined)
			photoUrl = curTopic.photo.urls.original;
		
		//check whether the inserting curTopic.id already existed in the db, if it is, do not add
		result = db.execute('SELECT id FROM topics WHERE acs_object_id = ?',curTopic.id);
		if(result.rowCount === 0) {
			//only insert new topics that db doesn't have
			
			db.execute("INSERT INTO topics(id,acs_object_id,program_id,title,content,photo,comments_count,user_id,username,device_token_id, is_deleted,updated_at) VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?)", 
					curTopic.id,_programId,curTopic.title,curTopic.content,photoUrl,curTopic.commentsCount,curTopic.user.id, curTopic.user.username,deviceToken,curTopic.isDeleted, convertACSTimeToLocalTime(curTopic.updatedAt));
			isTableChanged = true;
		}	
	}
	if(result !== null) result.close();
	db.close();
	Ti.App.fireEvent("topicsDbUpdated");
	return isTableChanged;
};

exports.topicModel_updateCommentNumCount = function(_commentNumCount,_topicId) {
	var db = Ti.Database.open('Chatterbox');
	db.execute("UPDATE topics SET comments_count = ? WHERE acs_object_id = ?", _commentNumCount, _topicId);
	db.close();
};
