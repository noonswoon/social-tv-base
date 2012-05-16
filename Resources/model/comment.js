//bootstrap database

var db = Ti.Database.open('Chatterbox');
//response_to_object_id --> object_id can be topic_id (comment of post) or comment_id (comment of comment)
db.execute('CREATE TABLE IF NOT EXISTS comments(id TEXT PRIMARY KEY, topic_id TEXT, content TEXT, rating INTEGER, username TEXT, response_to_object_id TEXT, is_a_vote INTEGER, updated_at TEXT);');
db.close();

exports.commentModel_fetchCommentsFromTopicId = function(_topicId) {
	//get both comments and ratings on the topicId [right now ratings and comments are considered comments]
	var fetchedComments = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM comments WHERE topic_id = ? ORDER BY updated_at DESC',_topicId);
	
	while(result.isValidRow()) {
		fetchedComments.push({
			hasChild:true,
			color: '#fff',
			title: result.fieldByName('content'),
			id: result.fieldByName('id'),
			topic_id: _topicId,
			content: result.fieldByName('content'),
			rating: Number(result.fieldByName('rating')),
			username: result.fieldByName('username'),
			response_to_object_id: result.fieldByName('response_to_object_id'),
			is_a_vote: Number(result.fieldByName('is_a_vote')),
			updated_at: result.fieldByName('updated_at')
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedComments;
};

exports.commentModel_addCommentOrRating = function(_comment) {
	var db = Ti.Database.open('Chatterbox');
	
	var result = db.execute("INSERT INTO comments(id,topic_id,content,rating,username, response_to_object_id,is_a_vote, updated_at) VALUES(?,?,?,?,?,?,?,?)", 
									_comment.id,_comment.custom_fields.topic_id,_comment.content,
									_comment.rating,_comment.user.username,_comment.custom_fields.response_to_object_id,
									_comment.custom_fields.is_a_vote,_comment.updated_at);
	
	//if the _comment is a rating, need to do the data update
	if(_comment.custom_fields.is_a_vote == 1)  {
		result = db.execute('SELECT * FROM comments WHERE id = ?',_comment.custom_fields.response_to_object_id);
		var curRating = Number(result.fieldByName('rating'));
		var newRating = curRating + _comment.rating;
		db.execute("UPDATE comments SET rating = ? WHERE id = ?", newRating, _comment.custom_fields.response_to_object_id);
	}
		
	db.close();
	//fire message to let others know that database has changed
	Ti.App.fireEvent("commentsDbUpdated");
};

exports.commentModel_canUserVote = function(_targetedCommentId,username) {	
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM comments WHERE response_to_object_id = ? AND username = ? AND is_a_vote=1',_targetedCommentId,username);
	var canUserVote = true;
	if(result.isValidRow()) {
		//alert('already vote: '+result.fieldByName('content')+', is_a_vote: '+result.fieldByName('is_a_vote'));
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
		db.execute("INSERT INTO comments(id,topic_id,content,rating,username, response_to_object_id,is_a_vote,updated_at)" + 
					"VALUES(?,?,?,?,?,?,?,?)", 	curComment.id,curComment.topic_id,curComment.content,curComment.rating,
												curComment.user.username,curComment.response_to_object_id,curComment.is_a_vote,curComment.updated_at);
	}
	
	//update voting score
	for(var i=0;i < _commentsCollection.length; i++) {
		var curComment = _commentsCollection[i];
		if(curComment.is_a_vote == 1)  {
			var result = db.execute('SELECT * FROM comments WHERE id = ?',curComment.response_to_object_id);
			var curRating = Number(result.fieldByName('rating'));
			var newRating = curRating + curComment.rating;
			db.execute("UPDATE comments SET rating = ? WHERE id = ?", newRating, curComment.response_to_object_id);
		}
	}
	
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