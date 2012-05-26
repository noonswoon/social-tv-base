//bootstrap database

var db = Ti.Database.open('Chatterbox');
//response_to_object_id --> object_id can be topic_id (comment of post) or comment_id (comment of comment)
db.execute('CREATE TABLE IF NOT EXISTS comments(id INTEGER PRIMARY KEY, acs_object_id TEXT, topic_id TEXT, content TEXT, rating INTEGER, username TEXT, response_to_object_id TEXT, is_a_vote INTEGER, is_deleted INTEGER, updated_at TEXT);');
db.close();

exports.commentModel_fetchReviewsFromTopicId = function(_topicId) { //reviews = comments + votes
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

commentModel_fetch1stLevelCommentsFromTopicId = function(_topicId) { //getting only comments of the topic (not comment of comment)
	//get both comments and ratings on the topicId [right now ratings and comments are considered comments]
	var fetchedComments = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT id,acs_object_id,content,response_to_object_id FROM comments WHERE response_to_object_id = ? AND is_a_vote = 0 AND is_deleted = 0 ORDER BY updated_at DESC',_topicId);
	
	while(result.isValidRow()) {
		//Ti.API.info('from comments, id: '+result.fieldByName('id')+', acs_object_id: '+result.fieldByName('acs_object_id')+', content: '+result.fieldByName('content'));
		fetchedComments.push({
			hasChild:true,
			color: '#fff',
			title: result.fieldByName('content'),
			id: Number(result.fieldByName('id')),
			acsObjectId: result.fieldByName('acs_object_id'),
			content: result.fieldByName('content'),
			responseToObjectId: result.fieldByName('response_to_object_id')
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedComments;
};
exports.commentModel_fetch1stLevelCommentsFromTopicId = commentModel_fetch1stLevelCommentsFromTopicId;

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
	
	var newId = db.lastInsertRowId;
	
	//if the _comment is a rating, need to do the data update for the targetted comment
	if(_rating != 0)  {
		var result = db.execute('SELECT * FROM comments WHERE acs_object_id = ?',_responseToObjectId);
		var curRating = Number(result.fieldByName('rating'));
		var newRating = curRating + _rating;
		db.execute("UPDATE comments SET rating = ? WHERE acs_object_id = ?", newRating, _responseToObjectId);
		result.close();
	}
		
	db.close();
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

exports.commentModel_updateRankingScore = function(_topicId) {
	var comments = commentModel_fetch1stLevelCommentsFromTopicId(_topicId);
	for(var i = 0;i < comments.length;i++) {
		var commentACSId = comments[i].acsObjectId;
		var totalVotes = commentModel_getNumberOfVotes(commentACSId);
		var positiveVotes = commentModel_getPositiveVotes(commentACSId);
		var rankingScore = calculateRankingScore(totalVotes,positiveVotes);
		Ti.API.info('comment id: '+commentACSId+' has ranking score of: '+rankingScore);
	}
}

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

commentModel_getNumberOfVotes = function(_targetedACSObjectId) {
	var numberOfVotes = 0;
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT COUNT(id) AS number_of_votes FROM comments WHERE response_to_object_id = ? AND is_a_vote = 1 AND is_deleted = 0',_targetedACSObjectId);
	numberOfVotes = Number(result.fieldByName('number_of_votes'));
	result.close();
	db.close();
	return numberOfVotes;
};
exports.commentModel_getNumberOfVotes = commentModel_getNumberOfVotes;

commentModel_getPositiveVotes = function(_targetedACSObjectId) {
	var numberOfPositiveVotes = 0;
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT SUM(rating) AS positive_votes FROM comments WHERE response_to_object_id = ? AND rating = 1 AND is_a_vote = 1 AND is_deleted = 0',_targetedACSObjectId);
	numberOfPositiveVotes = Number(result.fieldByName('positive_votes'));

	result.close();
	db.close();
	return numberOfPositiveVotes;
};
exports.commentModel_getPositiveVotes = commentModel_getPositiveVotes;

exports.contentsDuringOffline = function() {
	var db = Ti.Database.open('Chatterbox'); 
	//clean stuff
	db.execute("DELETE FROM comments");
	
	
	//comment 1
	var ct1 = moment();
	ct1.add('days',-7);
	ct1Str = ct1.format("YYYY-MM-DDTHH:mm:ss");
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
				"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'a','4fbfbcdb002044729301dd73','Paris is nice!',0,'titaniummick','4fbfbcdb002044729301dd73',0,ct1Str);

	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
				"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'ab','4fbfbcdb002044729301dd73','Bangkok is nicer!',0,'bangkokian','a',0,ct1Str);
	
	
	//rating of comment 1 -- +1, -0
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
							"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'b','4fbfbcdb002044729301dd73','m',1,'dude','a',1,ct1Str);
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
							"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'bb','4fbfbcdb002044729301dd73','m',1,'dude','a',1,ct1Str);
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
							"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'bbbb','4fbfbcdb002044729301dd73','m',-1,'dude','a',1,ct1Str);												
	
	var commentACSId = 'a'
	var result = db.execute('SELECT sum(rating) as comment_rating FROM comments WHERE response_to_object_id = ?',commentACSId);
	var comment_rating = Number(result.fieldByName('comment_rating'));
	db.execute("UPDATE comments SET rating = ? WHERE acs_object_id = ?", comment_rating, commentACSId);	
					
	//comment 2
	var ct2 = moment();
	ct2.add('days',-5);
	ct2Str = ct2.format("YYYY-MM-DDTHH:mm:ss");

	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
				"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'aa','4fbfbcdb002044729301dd73','Chenonceau is awesome!',0,'philton','4fbfbcdb002044729301dd73',0,ct2Str);
					
	//rating of comment 2 -- +5, -3
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
					"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'd','4fbfbcdb002044729301dd73','m',1,'dude','aa',1,ct2Str);
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
					"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'e','4fbfbcdb002044729301dd73','m',1,'dude','aa',1,ct2Str);
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
					"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'f','4fbfbcdb002044729301dd73','m',1,'dude','aa',1,ct2Str);
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
					"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'g','4fbfbcdb002044729301dd73','m',1,'dude','aa',1,ct2Str);
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
					"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'h','4fbfbcdb002044729301dd73','m',1,'dude','aa',1,ct2Str);
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
					"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'i','4fbfbcdb002044729301dd73','m',-1,'dude','aa',1,ct2Str);
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
					"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'j','4fbfbcdb002044729301dd73','m',-1,'dude','aa',1,ct2Str);
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
					"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'k','4fbfbcdb002044729301dd73','m',-1,'dude','aa',1,ct2Str);				
	
	commentACSId = 'aa'
	result = db.execute('SELECT sum(rating) as comment_rating FROM comments WHERE response_to_object_id = ?',commentACSId);
	comment_rating = Number(result.fieldByName('comment_rating'));
	db.execute("UPDATE comments SET rating = ? WHERE acs_object_id = ?", comment_rating, commentACSId);	
		
	//comment 3
	var ct3 = moment();
	ct3.add('days',-1);
	ct3Str = ct3.format("YYYY-MM-DDTHH:mm:ss");
	db.execute("INSERT INTO comments(id,acs_object_id,topic_id,content,rating,username, response_to_object_id,is_a_vote, is_deleted, updated_at) "+
				"VALUES(NULL,?,?,?,?,?,?,?,0,?)", 'aaa','4fbfbcdb002044729301dd73','Effle Tower is so pretty..and Apple rocks!',0,'effle','4fbfbcdb002044729301dd73',0,ct3Str);
				
	//rating of comment 3 -- +100, -65
	
	result = db.execute('SELECT * FROM comments WHERE topic_id = ?','4fbfbcdb002044729301dd73');
	var numCount = 0;
	while(result.isValidRow()) {
		numCount++
		result.next();
	}	
	result.close();
	db.close();
};
