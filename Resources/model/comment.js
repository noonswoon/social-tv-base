//bootstrap database

var db = Ti.Database.open('Chatterbox');
//response_to_object_id --> object_id can be topic_id (comment of post) or comment_id (comment of comment)
db.execute('CREATE TABLE IF NOT EXISTS comments(id INTEGER PRIMARY KEY, acs_object_id TEXT, topic_id TEXT, content TEXT, rating INTEGER, username TEXT, response_to_object_id TEXT, updated_at TEXT);');
db.close();

exports.commentModel_fetchCommentsFromTopicId = function(_topicId) {
	//get both comments and ratings on the topicId [right now ratings and comments are considered comments]
	var fetchedComments = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM comments WHERE topic_id = ? ORDER BY updated_at DESC',_topicId);
	
	while(result.isValidRow()) {
		//Ti.API.info('from comments, id: '+result.fieldByName('id')+', acs_object_id: '+result.fieldByName('acs_object_id')+', content: '+result.fieldByName('content'));
		fetchedComments.push({
			hasChild:true,
			color: '#fff',
			title: result.fieldByName('content'),
			id: Number(result.fieldByName('id')),
			acsObjectId: result.fieldByName('acs_object_id'),
			topicId: _topicId,
			content: result.fieldByName('content'),
			rating: Number(result.fieldByName('rating')),
			username: result.fieldByName('username'),
			responseToObjectId: result.fieldByName('response_to_object_id'),
			updatedAt: result.fieldByName('updated_at')
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedComments;
};

exports.commentModel_updateACSObjectIdField = function(_comment) {
	var db = Ti.Database.open('Chatterbox');
	var acsObjectId = _comment.id;
	var localId = _comment.custom_fields.local_id;
	db.execute("UPDATE comments SET acs_object_id = ? WHERE id = ?", acsObjectId, localId);
	db.close();
};

//need to fix..adding acs_object_id
exports.commentModel_addCommentOrRating = function(_topicId, _content,_rating,_username,_responseToObjectId) {
	var db = Ti.Database.open('Chatterbox');
	
	//_comment.updated_at = convertACSTimeToLocalTime(_comment.updated_at);
	var updatedAt = moment().format("YYYY-MM-DDTHH:mm:ss");
	
	//need to update acs_object_id later
	db.execute("INSERT INTO comments(id,topic_id,content,rating,username, response_to_object_id,updated_at) "+
							"VALUES(NULL,?,?,?,?,?,?)", _topicId,_content,_rating,_username,_responseToObjectId,updatedAt);
	
	var result = db.execute("SELECT last_insert_rowid() as new_id");
	var newId = result.fieldByName('new_id');
	//if the _comment is a rating, need to do the data update for the targetted comment
	if(_rating != 0)  {
		result = db.execute('SELECT * FROM comments WHERE acs_object_id = ?',_responseToObjectId);
		var curRating = Number(result.fieldByName('rating'));
		var newRating = curRating + _rating;
		db.execute("UPDATE comments SET rating = ? WHERE acs_object_id = ?", newRating, _responseToObjectId);
	}
		
	result.close();
	db.close();
	//fire message to let others know that database has changed
	Ti.App.fireEvent("commentsDbUpdated");
	return newId;
};

exports.commentModel_canUserVote = function(_targetedCommentId,username) {	
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM comments WHERE response_to_object_id = ? AND username = ? AND rating <> 0',_targetedCommentId,username);
	var canUserVote = true;
	if(result.isValidRow()) {
		//alert('already vote: '+result.fieldByName('content')+', rating: '+result.fieldByName('rating'));
		canUserVote = false;
	} 
	result.close();
	db.close();
	return canUserVote;
}; 

exports.commentModel_updateCommentsOnTopicFromACS = function(_commentsCollection, _topicId) {
	var fetchedComments = [];
	var db = Ti.Database.open('Chatterbox'); 
	
	//need to clear records with the given topicId
	var result = db.execute('DELETE FROM comments WHERE topic_id = ?',_topicId);
	
	//insert contents
	for(var i=0;i < _commentsCollection.length; i++) {
		var curComment = _commentsCollection[i];
		curComment.updated_at = convertACSTimeToLocalTime(curComment.updated_at);
		db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,updated_at) " +
					"VALUES(NULL,?,?,?,?,?,?,?)", 	
					curComment.id,curComment.topic_id,curComment.content,curComment.rating,
					curComment.user.username,curComment.response_to_object_id,curComment.updated_at);
	}
	
	//update voting score
	for(var i=0;i < _commentsCollection.length; i++) {
		var curComment = _commentsCollection[i];
		if(curComment.rating !== 0)  {
			result = db.execute('SELECT * FROM comments WHERE acs_object_id = ?',curComment.response_to_object_id);
			var curRating = Number(result.fieldByName('rating'));
			var newRating = curRating + curComment.rating;
			db.execute("UPDATE comments SET rating = ? WHERE acs_object_id = ?", newRating, curComment.response_to_object_id);
		}
	}
	if(result != null)	result.close();
	db.close();
	Ti.App.fireEvent("commentsDbUpdated");
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