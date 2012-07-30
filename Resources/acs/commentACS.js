exports.commentACS_fetchAllCommentsOfPostId = function(_paramsArray) {
	topicId = _paramsArray[0];
	var commentsInThisTopic = [];
	var numWaits = 0;
	
	var queryReviewsOfCommentsDoneCallback = function () {
		numWaits--;
		if(numWaits==0) {
			Ti.App.fireEvent("commentsLoadedComplete",{fetchedComments:commentsInThisTopic});
			//remove the callback when successfully joined
			Ti.App.removeEventListener('queryReviewsOfCommentsDone',queryReviewsOfCommentsDoneCallback);
		}
	};
	Ti.App.addEventListener('queryReviewsOfCommentsDone',queryReviewsOfCommentsDoneCallback);
		
	var queryCommentsOfComment = function(commentIdsArrayToQuery) { //recursion function
		//getting comments/rating of comment
		// commentIdsWithRatingsOrComments.length, cwroc --> number of Cloud.Reviews.query calls
		//need to fork cwroc times and wait til all the events are done before calling commentsLoadedComplete
			
		for(var i=0; i <commentIdsArrayToQuery.length;i++) {
			var curCommentId = commentIdsArrayToQuery[i];
			//signal the fork
			numWaits++;
			Cloud.Reviews.query({
			    review_object_id:curCommentId,
			    page: 1,
			    per_page: 100,
			    response_json_depth: 2
			}, function (e) {
			    if (e.success) {
			    	var commentIdsWithRatingsOrComments = [];
			        for (var j = 0; j < e.reviews.length; j++) {
            			var review = e.reviews[j];
				        var curComment = {
			            	id: review.id,
			            	topicId: topicId,
			            	content: review.content,
			            	rating: review.rating,
			            	user:review.user,
			            	responseToObjectId: review.custom_fields.response_to_object_id,
			            	isAVote: review.custom_fields.is_a_vote,
			            	isDeleted: review.custom_fields.is_deleted,
			            	updatedAt: review.updated_at
			           	};
			           	commentsInThisTopic.push(curComment);
			           	
			           	if(review.reviews_count !== undefined) {
			           		commentIdsWithRatingsOrComments.push(review.id);
	            		}	 
			        }
			        if(commentIdsWithRatingsOrComments.length == 0) {
						Ti.App.fireEvent("queryReviewsOfCommentsDone");
					} else {
						queryCommentsOfComment(commentIdsWithRatingsOrComments); //recursive call
						Ti.App.fireEvent("queryReviewsOfCommentsDone");
					}
				} else {
			        Debug.debug_print('Getting CommentOfComment Error:\\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			        alert('ERROR: '+'Getting CommentOfComment Error');
			        ErrorHandling.showNetworkError();
			    }
			});
		}
	};
	
	//getting comments on the topic --> need to recursively call the Cloud service
	Cloud.Reviews.query({
	    post_id: topicId,
	    page: 1,
	    per_page: 100, 
	    order: '-created_at',
	    response_json_depth: 2
	}, function (e) {
	    if (e.success) {
	       // Ti.API.info('Reviews Count: ' + e.reviews.length);
	        var commentIdsWithRatingsOrComments = [];
	        for (var i = 0; i < e.reviews.length; i++) {
				var review = e.reviews[i];
	            //Ti.API.info('review: '+JSON.stringify(review)); //do have external_id and stuff
	            var curComment = {
	            	id: review.id,
	            	topicId: topicId,
	            	content: review.content,
	            	rating: review.rating,
	            	user:review.user,
	            	responseToObjectId: review.custom_fields.response_to_object_id,
	            	isAVote: review.custom_fields.is_a_vote,
			        isDeleted: review.custom_fields.is_deleted,
	            	updatedAt: review.updated_at
	            };
	            
				commentsInThisTopic.push(curComment);
				if(review.reviews_count !== undefined) {
	            	commentIdsWithRatingsOrComments.push(review.id);
	            } 
			}
			
			if(commentIdsWithRatingsOrComments.length == 0) { //no comment
				Ti.App.fireEvent("commentsLoadedComplete",{fetchedComments:commentsInThisTopic});
			} else {
				queryCommentsOfComment(commentIdsWithRatingsOrComments);
			}	
	    } else {
	        Debug.debug_print('Getting Review Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	        alert('ERROR: '+'Getting Review Error');
	        ErrorHandling.showNetworkError();
	    }
	});
}
	
exports.commentACS_createCommentOfTopic = function(_comment,_localId,_topicId) {
	//connecting with Cloud
	Cloud.Reviews.create({
	    post_id: _topicId, //need to remain as 'post_id' since it is connection to ACS Posts API
	    rating: 0,
	    content: _comment, 
	    custom_fields: {"topic_id": _topicId, "response_to_object_id": _topicId, "local_id":_localId, "is_a_vote":0, "is_deleted":0},
	    allow_duplicate: 1
	}, function (e) {
	    if (e.success) {
	        var review = e.reviews[0];
	        Debug.debug_print('Commenting Success: id ' + review.id);
	        Ti.App.fireEvent("commentCreatedACS",{newComment:review});	        
	    } else {
	        Debug.debug_print('Comment Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	            alert('ERROR: '+'Comment Error');
	        ErrorHandling.showNetworkError();
	    }
	});
}

exports.commentACS_createCommentOfComment = function(_comment,_localId,_commentId,_topicId,_rowIndexToUpdateACSObjectId,_commentLevel) {
	Cloud.Reviews.create({
	    review_object_id: _commentId,
	    rating: 0,
	    content: _comment, 
	    custom_fields: {"topic_id": _topicId, "response_to_object_id": _commentId, "local_id":_localId, "is_a_vote":0, "is_deleted":0},
	    allow_duplicate: 1
	}, function (e) {
	    if (e.success) {
	        var review = e.reviews[0];
	        Debug.debug_print('Comment of comment success: id ' + review.id);
	        Ti.App.fireEvent("commentOfCommentCreatedACS",{
	        												newCommentOfComment:review, 
	        												rowIndexToUpdateACSObjectId:_rowIndexToUpdateACSObjectId,
	        												commentLevel:_commentLevel
	        											});
	    } else {
	        Debug.debug_print('Comment of comment Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	            alert('ERROR: '+'comment of comment Error');
	        ErrorHandling.showNetworkError();
	    }
	});
}

exports.commentACS_createVoteOfComment = function(_voteScore,_localId,_commentId,_topicId) {
	Cloud.Reviews.create({
	    review_object_id: _commentId,
	    rating: _voteScore,
	    content: "m", 
	    custom_fields: {"topic_id": _topicId, "response_to_object_id": _commentId, "local_id":_localId, "is_a_vote":1, "is_deleted":0},
	    allow_duplicate: 1
	}, function (e) {
	    if (e.success) {
	        var review = e.reviews[0];
	        Debug.debug_print('Vote of comment success: id ' + review.id);
	        Ti.App.fireEvent("voteOfCommentCreatedACS",{newVote:review});
	    } else {
	        Debug.debug_print('Vote of comment Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	            alert('ERROR: '+'vote for comment Error');
	   		ErrorHandling.showNetworkError();
	    }
	});
}

exports.commentACS_deleteComment = function(_respondToObjectId,_commentId) {
	Cloud.Reviews.update({
    	post_id: _respondToObjectId,
    	review_id: _commentId,
     	custom_fields: {"is_deleted": 1}
	}, function (e) {
	    if (e.success) {
	        Debug.debug_print("deleteCommentOfPost: update is_deleted_flag success");
	    } else {
	        Debug.debug_print("deleteCommentOfPost: update is_deleted_flag FAILED");
	        alert('ERROR: '+'delete comment of post Error');
	        ErrorHandling.showNetworkError();
	    }
	});
}

exports.commentACS_deleteCommentOfComment = function(_respondToObjectId,_commentId) {
	Cloud.Reviews.update({
    	review_object_id: _respondToObjectId,
    	review_id: _commentId,
    	custom_fields: {"is_deleted": 1}
	}, function (e) {
	    if (e.success) {
	        Debug.debug_print("deleteCommentOfComment: update is_deleted_flag success");
	    } else {
	        Debug.debug_print("deleteCommentOfComment: update is_deleted_flag FAILED");
	        alert('ERROR: '+'delete comment of comment Error');
	        ErrorHandling.showNetworkError();
	    }
	});
}