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
	
exports.commentToPostACS_create = function(_comment,_topicId) {
	//connecting with Cloud
	Cloud.Reviews.create({
	    post_id: _topicId, //need to remain as 'post_id' since it is connection to ACS Posts API
	    rating: 1,
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