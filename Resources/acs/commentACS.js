exports.commentACS_fetchAllCommentsOfPostId = function(_topicId) {
	var commentsInThisTopic = [];
	var commentIdsWithRatingsOrComments = [];
	var numWaits = 0;
	
	function queryReviewsOfCommentsDoneCallback() {
		numWaits--;
		if(numWaits==0) {
			Ti.App.fireEvent("commentsLoadedComplete",{fetchedComments:commentsInThisTopic});
			//remove the callback when successfully joined
			Ti.App.removeEventListener('queryReviewsOfCommentsDone',queryReviewsOfCommentsDoneCallback);
		}
	}
	
	Ti.App.addEventListener('queryReviewsOfCommentsDone',queryReviewsOfCommentsDoneCallback);
	
	//getting comments on the topic
	Cloud.Reviews.query({
	    post_id: _topicId,
	    page: 1,
	    per_page: 20, 
	    order: '-created_at'
	}, function (e1) {
	    if (e1.success) {
	        Ti.API.info('Reviews Count: ' + e1.reviews.length);
	        for (var i = 0; i < e1.reviews.length; i++) {
				var review = e1.reviews[i];
	            var curComment = {
	            	id: review.id,
	            	topic_id: _topicId,
	            	content: review.content,
	            	rating: review.rating,
	            	user:review.user,
	            	response_to_object_id: review.custom_fields.response_to_object_id,
	            	is_a_vote: review.custom_fields.is_a_vote,
	            	updated_at: review.updated_at
	            };
	            
				commentsInThisTopic.push(curComment);
				if(review.reviews_count !== undefined) {
	            	commentIdsWithRatingsOrComments.push(review.id);
	            } 
			}
			
			if(commentIdsWithRatingsOrComments.length == 0) {
				Ti.App.fireEvent("commentsLoadedComplete",{fetchedComments:commentsInThisTopic});
			} 
			//getting comments/rating of comment
			// commentIdsWithRatingsOrComments.length, cwroc --> number of Cloud.Reviews.query calls
			//need to fork cwroc times and wait til all the events are done before calling commentsLoadedComplete
			numWaits = commentIdsWithRatingsOrComments.length;
			for(var i=0; i <commentIdsWithRatingsOrComments.length;i++) {
				var curCommentId = commentIdsWithRatingsOrComments[i];
				Cloud.Reviews.query({
				    review_object_id:curCommentId,
				    page: 1,
				    per_page: 20
				}, function (e2) {
				    if (e2.success) {
				        Ti.API.info('commentID '+e2.reviews[0].custom_fields.response_to_object_id+' has ' + e2.reviews.length +' ratings/comments');
				        for (var j = 0; j < e2.reviews.length; j++) {
	            			var review = e2.reviews[j];
					        var curComment = {
				            	id: review.id,
				            	topic_id: _topicId,
				            	content: review.content,
				            	rating: review.rating,
				            	user:review.user,
				            	response_to_object_id: review.custom_fields.response_to_object_id,
				            	is_a_vote: review.custom_fields.is_a_vote,
				            	updated_at: review.updated_at
				           	};
				        	commentsInThisTopic.push(curComment);   
				        }
				        //FIXED!! Mickey == smartass --> true: 
				        //problematic here..it isn't really complete since we fire
				        //many Cloud.Reviews.Query events..each will fire commentsLoadedComplete
				        //Ti.App.fireEvent("commentsLoadedComplete",{fetchedComments:commentsInThisTopic});
						Ti.App.fireEvent("queryReviewsOfCommentsDone");
					} else {
				        Ti.API.info('Getting CommentOfComment Error:\\n' +
				            ((e2.error && e.message) || JSON.stringify(e2)));
				    }
				});
			}
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
	    custom_fields: {"topic_id": _topicId, "response_to_object_id": _topicId, "is_a_vote":0},
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

exports.commentACS_createCommentOfComment = function(_comment,_commentId,_topicId) {
	Cloud.Reviews.create({
	    review_object_id: _commentId,
	    rating: 0,
	    content: _comment, 
	    custom_fields: {"topic_id": _topicId, "response_to_object_id": _commentId, "is_a_vote":0},
	    allow_duplicate: 1
	}, function (e) {
	    if (e.success) {
	        var review = e.reviews[0];
	        Ti.API.info('Comment of comment success: id ' + review.id);
	        Ti.App.fireEvent("commentOfCommentCreatedACS",{newCommentOfComment:review});
	    } else {
	        Ti.API.info('Comment of comment Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
}

exports.commentACS_createVoteOfComment = function(_voteScore,_commentId,_topicId) {
	Cloud.Reviews.create({
	    review_object_id: _commentId,
	    rating: _voteScore,
	    content: "m", 
	    custom_fields: {"topic_id": _topicId, "response_to_object_id": _commentId, "is_a_vote":1},
	    allow_duplicate: 1
	}, function (e) {
	    if (e.success) {
	        var review = e.reviews[0];
	        Ti.API.info('Vote of comment success: id ' + review.id);
	        Ti.App.fireEvent("voteOfCommentCreatedACS",{newVote:review});
	    } else {
	        Ti.API.info('Comment of comment Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
}

exports.commentACS_getAllVotesOfUser = function(_userId) {
	Ti.API.info("may be no need to implement");
}
