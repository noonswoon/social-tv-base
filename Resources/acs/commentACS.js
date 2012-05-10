exports.commentACS_fetchAllCommentsOfPostId = function(_topicId) {
	var commentsOfPost = [];
	Cloud.Reviews.query({
	    post_id: _topicId,
	    page: 1,
	    per_page: 20, 
	    order: '-created_at'
	}, function (e) {
	    if (e.success) {
	        Ti.API.info('Reviews Count: ' + e.reviews.length);
	        for (var i = 0; i < e.reviews.length; i++) {
	            var review = e.reviews[i];
	            var curComment = {
	            	id: review.id,
	            	topic_id: _topicId,
	            	content: review.content,
	            	rating: review.rating,
	            	user:review.user,
	            	response_to_object_id: review.custom_fields.response_to_object_id,
	            	updated_at: review.updated_at
	            }
				commentsOfPost.push(curComment);
	        }
	       Ti.App.fireEvent("commentsLoadedComplete",{fetchedComments:commentsOfPost});
	    } else {
	        Ti.API.info('Getting Review Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
}
	
exports.commentACS_createCommentOfTopic = function(_comment,_topicId) {
	//connecting with Cloud
	Cloud.Reviews.create({
	    post_id: _topicId, //need to remain as 'post_id' since it is connection to ACS Posts API
	    rating: 0,
	    content: _comment, 
	    custom_fields: {"topic_id": _topicId, "response_to_object_id": _topicId},
	    allow_duplicate: 1
	}, function (e) {
	    if (e.success) {
	        var review = e.reviews[0];
	        Ti.API.info('Commenting Success: id ' + review.id);
	        Ti.App.fireEvent("commentCreatedACS",{newComment:review});
	    } else {
	        Ti.API.info('Comment Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
}

exports.commentACS_createVoteOfComment = function(_voteScore,_commentId) {
	//connecting with Cloud
	//saving user action to CustomObjects, UserVotes class
	Cloud.Objects.create({
	    classname: 'UserVotes',
	    fields: {
	        targeted_comment_id: _commentId,
	        vote: _voteScore
	    }
	}, function (e) {
	    if (e.success) {
	        alert('Success saving user vote: ');
	    } else {
	        alert('Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
	
	//need to update that comment with a new rating +/- 1 -->using KeyValue Par, increment function
	//can't use rating, since we need to make a call to get the currentvalue...too async
	
	//step 1. need to check if KeyValue pair for this commentId exists or not, 
	//if already exsits, run increment function, if no--> create a KeyValue pair with key=commentId, value=1
	Cloud.KeyValues.get({
	    name: _commentId
	}, function (e) {
	    if (e.success) { //value pair exists, do the increment
	       Cloud.KeyValues.increment({  //PROBLEM HERE..ONLY ALLOW INCR OF THE KEYVALUE OWNER T__T
			    name: _commentId,
			    value: _voteScore // +1 or -1..upvote or downvote
			}, function (e) {
			     if (e.success) {
			         var keyvalue = e.keyvalues[0];
			         Ti.API.info('Success incr: name: ' + keyvalue.name + ', value: ' + keyvalue.value);
			     } else {
			         Ti.API.info('Error: cannot incr rating of comment' +
			             ((e.error && e.message) || JSON.stringify(e)));
			     }
			});
	    } else { //value pair doesn't exists, create a new one
	       Cloud.KeyValues.set({
			    name: _commentId,
			    value: 1
			}, function (e) {
			    if (e.success) {
			        Ti.API.info('create a new keyvalue pair for commentId: '+_commentId);
			    } else {
			        Ti.API.info('Error: cannot create new keyvalue pair->' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});
	    }
	});
}

exports.commentACS_getAllVotesOfUser = function(_userId) {
	Ti.API.info("be will implemented...");
}
