//bootstrap database

var db = Ti.Database.open('Chatterbox');
//response_to_object_id --> object_id can be topic_id (comment of post) or comment_id (comment of comment)
db.execute('CREATE TABLE IF NOT EXISTS comments(id TEXT PRIMARY KEY, topic_id TEXT, content TEXT, rating INTEGER, username TEXT, response_to_object_id TEXT, is_a_vote INTEGER, updated_at TEXT);');
db.close();

exports.commentModel_fetchFromTopicId = function(_topicId) {
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
			updated_at: result.fieldByName('updated_at')
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedComments;
};

var add = function(_comment) {
	var db = Ti.Database.open('Chatterbox');
	db.execute("INSERT INTO comments(id,topic_id,content,rating,username, response_to_object_id,updated_at) VALUES(?,?,?,?,?,?,?)", _comment.id,_comment.custom_fields.topic_id,_comment.content,_comment.rating,_comment.user.username,_comment.custom_fields.response_to_object_id,_comment.updated_at);
	db.close();
	//fire message to let others know that database has changed
	Ti.App.fireEvent("commentsDbUpdated");
};
exports.commentModel_add = add;


exports.commentModel_updateCommentsFromACS = function(_commentsCollection, _topicId) {
	var fetchedComments = [];
	var db = Ti.Database.open('Chatterbox'); 
	
	//need to clear records with the given topicId
	var result = db.execute('DELETE FROM comments WHERE topic_id = ?',_topicId);
	
	for(var i=0;i < _commentsCollection.length; i++) {
		var curComment = _commentsCollection[i];
		db.execute("INSERT INTO comments(id,topic_id,content,rating,username, response_to_object_id,updated_at) VALUES(?,?,?,?,?,?,?)", curComment.id,curComment.topic_id,curComment.content,curComment.rating,curComment.user.username,curComment.response_to_object_id,curComment.updated_at);
	}
	db.close();
	Ti.App.fireEvent("commentsDbUpdated");
};

exports.commentModel_updateCommentsOfCommentsFromACS = function(_commentsCollection, _commentId) {
	var fetchedComments = [];
	var db = Ti.Database.open('Chatterbox'); 
	
	//need to clear records with the given topicId
	var result = db.execute('DELETE FROM comments WHERE topic_id = ?',_topicId);
	
	for(var i=0;i < _commentsCollection.length; i++) {
		var curComment = _commentsCollection[i];
		db.execute("INSERT INTO comments(id,topic_id,content,rating,username, response_to_object_id,updated_at) VALUES(?,?,?,?,?,?,?)", curComment.id,curComment.topic_id,curComment.content,curComment.rating,curComment.user.username,curComment.response_to_object_id,curComment.updated_at);
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