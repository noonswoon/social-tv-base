//bootstrap database

var db = Ti.Database.open('Chatterbox');
//response_to_object_id --> object_id can be topic_id (comment of post) or comment_id (comment of comment)
db.execute('CREATE TABLE IF NOT EXISTS comments(id INTEGER PRIMARY KEY, acs_object_id TEXT, topic_id TEXT, content TEXT, rating INTEGER, username TEXT, response_to_object_id TEXT, is_a_vote INTEGER, is_deleted INTEGER, updated_at TEXT);');
db.close();

exports.commentModel_fetchCommentsFromTopicId = function(_topicId) {
	//get both comments and ratings on the topicId [right now ratings and comments are considered comments]
	var fetchedComments = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM comments WHERE topic_id = ? AND is_deleted = 0 ORDER BY updated_at DESC',_topicId);
	
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
			isAVote: Number(result.fieldByName('is_a_vote')),
			updatedAt: result.fieldByName('updated_at')
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedComments;
};

exports.commentModel_updateACSObjectIdField = function(_review) {
	var db = Ti.Database.open('Chatterbox');
	var acsObjectId = _review.id;
	var localId = _review.custom_fields.local_id;
	db.execute("UPDATE comments SET acs_object_id = ? WHERE id = ?", acsObjectId, localId);
	db.close();
};

//need to fix..adding acs_object_id
exports.commentModel_addCommentOrRating = function(_topicId, _content,_rating,_username,_responseToObjectId,_isAVote) {
	var db = Ti.Database.open('Chatterbox');
	
	//_comment.updated_at = convertACSTimeToLocalTime(_comment.updated_at);
	var updatedAt = moment().format("YYYY-MM-DDTHH:mm:ss");
	
	//need to update acs_object_id later
	db.execute("INSERT INTO comments(id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
							"VALUES(NULL,?,?,?,?,?,?,0,?)", _topicId,_content,_rating,_username,_responseToObjectId,_isAVote,updatedAt);
	
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
	
	//try to not fire an auto update the UI
	//Ti.App.fireEvent("commentsDbUpdated");
	return newId;
};

exports.commentModel_canUserVote = function(_targetedCommentId,username) {	
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM comments WHERE response_to_object_id = ? AND username = ? AND is_a_vote = 1',_targetedCommentId,username);
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
	
	//insert everything -- comments/ratings
	for(var i=0;i < _commentsCollection.length; i++) {
		var curComment = _commentsCollection[i];
		curComment.updatedAt = convertACSTimeToLocalTime(curComment.updatedAt);
		db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote,is_deleted,updated_at) " +
					"VALUES(NULL,?,?,?,?,?,?,?,?,?)", 	
					curComment.id,_topicId,curComment.content,curComment.rating,
					curComment.user.username,curComment.responseToObjectId,curComment.isAVote,curComment.isDeleted, curComment.updatedAt);
	}
	
	//update voting score
	for(var i=0;i < _commentsCollection.length; i++) {
		var curComment = _commentsCollection[i];
		if(curComment.isAVote == 1)  { //if it is a vote, need to update the targeted comment with the vote score
			result = db.execute('SELECT * FROM comments WHERE acs_object_id = ?',curComment.responseToObjectId);
			var curRating = Number(result.fieldByName('rating'));
			var newRating = curRating + curComment.rating;
			db.execute("UPDATE comments SET rating = ? WHERE acs_object_id = ?", newRating, curComment.responseToObjectId);
		}
	}
	if(result != null)	result.close();
	db.close();
	Ti.App.fireEvent("commentsDbUpdated");
};

exports.commentModel_deleteComment = function(_targetedACSObjectId) {
	var db = Ti.Database.open('Chatterbox');
	db.execute("UPDATE comments SET is_deleted = 1 WHERE acs_object_id = ?", _targetedACSObjectId);
	db.close();
};
