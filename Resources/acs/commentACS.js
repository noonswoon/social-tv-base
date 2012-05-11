exports.commentACS_fetchAllCommentsOfPostId = function(_topicId) {
	var commentsOfPost = [];
	var commentIdsWithRatingsOrComments = [];
	var commentsOfComments = [];
	//getting comments on the topic
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
	            	user:review.user,
	            	response_to_object_id: review.custom_fields.response_to_object_id,
	            	updated_at: review.updated_at
	            };
				commentsOfPost.push(curComment);
				if(review.reviews_count !== undefined) {
	            	commentIdsWithRatingsOrComments.push(review.id);
	            } 
			}
			
			if(commentIdsWithRatingsOrComments.length == 0)
				Ti.App.fireEvent("commentsLoadedComplete",{fetchedComments:commentsOfPost, fetchedCommentsOfComments:commentsOfComments});
			
			//getting comments/rating of comment
			for(var i=0; i <commentIdsWithRatingsOrComments.length;i++) {
				var curCommentId = commentIdsWithRatingsOrComments[i];
				Cloud.Reviews.query({
				    review_object_id:curCommentId,
				    page: 1,
				    per_page: 20
				}, function (e) {
				    if (e.success) {
				        Ti.API.info('commentID '+curCommentId+' has ' + e.reviews.length);
				        for (var i = 0; i < e.reviews.length; i++) {
	            			var review = e.reviews[i];
					        var curComment = {
				            	id: review.id,
				            	topic_id: _topicId,
				            	content: review.content,
				            	rating: review.rating,
				            	user:review.user,
				            	response_to_object_id: curCommentId,
				            	is_a_vate: review.custom_fields.is_a_vote,
				            	updated_at: review.updated_at
				           	};
				        	commentsOfComments.push(curComment);   
				        }
				        
				       	Ti.App.fireEvent("commentsLoadedComplete",{fetchedComments:commentsOfPost, fetchedCommentsOfComments:commentsOfComments});
					} else {
				        Ti.API.info('Getting CommentOfComment Error:\\n' +
				            ((e.error && e.message) || JSON.stringify(e)));
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
	Ti.API.info("will create Review object to represent the voteup/down");
}

exports.commentACS_getAllVotesOfUser = function(_userId) {
	Ti.API.info("may be no need to implement");
}
