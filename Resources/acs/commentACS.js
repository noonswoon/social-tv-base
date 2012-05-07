exports.commentACS_fetchAllCommentsOfPostId = function(_postId) {
	var commentsOfPost = [];
	Cloud.Reviews.query({
	    post_id: _postId,
	    page: 1,
	    per_page: 20
	}, function (e) {
	    if (e.success) {
	        alert('Reviews Count: ' + e.reviews.length);
	        /*for (var i = 0; i < e.reviews.length; i++) {
	            var review = e.reviews[i];
	            alert('id: ' + review.id + '\\n' +
	                'id: ' + review.id + '\\n' +
	                'rating: ' + review.rating + '\\n' +
	                'content: ' + review.content + '\\n' +
	                'updated_at: ' + review.updated_at);
	        }*/
	    } else {
	        alert('Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
}
	
exports.commentToPostACS_create = function(_comment,_postId) {
	//connecting with Cloud
	Cloud.Reviews.create({
	    post_id: _postId,
	    rating: 1,
	    content: _comment
	}, function (e) {
	    if (e.success) {
	        var review = e.reviews[0];
	        alert('Commenting Success: id ' + review.id);
	    } else {
	        alert('Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
}