exports.commentACS_fetchAllCommentsOfPostId = function(_postId) {
	var commentsOfPost = [];
	Cloud.Reviews.query({
	    post_id: _postId,
	    page: 1,
	    per_page: 20
	}, function (e) {
	    if (e.success) {
	        Ti.API.info('Reviews Count: ' + e.reviews.length);
	        for (var i = 0; i < e.reviews.length; i++) {
	            var review = e.reviews[i];
	            var curComment = {
	            	id: review.id,
	            	post_id: _postId,
	            	content: review.content,
	            	user:review.user,
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
	
exports.commentToPostACS_create = function(_comment,_postId) {
	//connecting with Cloud
	Cloud.Reviews.create({
	    post_id: _postId,
	    rating: 1,
	    content: _comment, 
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