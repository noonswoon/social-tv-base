exports.topicACS_fetchAllTopicsOfProgramId = function(_programId) {

	var topicsOfProgram = [];

	Cloud.Posts.query({
	    page: 1,
	    per_page: 20,
	    where: {
	        program_id: _programId
	    }, 
	    order: '-created_at'
	}, function (e) {
	    if (e.success) {
	        for (var i = 0; i < e.posts.length; i++) {
	            var post = e.posts[i];
	            var numComments = 0; 
	            if(post.reviews_count !== undefined)
	            	numComments = post.reviews_count;
	            var curTopic = {
	            	id: post.id,
	            	programId: _programId,
	            	title: post.title,
	            	user:post.user,
	            	commentsCount: numComments,
	            	isDeleted: post.custom_fields.is_deleted,
	            	updatedAt: post.updated_at
	            }
				topicsOfProgram.push(curTopic);
			}
	        Ti.App.fireEvent("topicsLoadedComplete",{topicsOfProgram:topicsOfProgram});
	    } else {
	        Ti.API.info('topicACS_fetchAllTopicsOfProgramId Error: ' + ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
}
	
exports.topicACS_create = function(_title,_photo,_content,_programId,_localId) {
	//connecting with Cloud
	Cloud.Posts.create({
			title: _title,
			//photo: _photo,
			content: _content, 
			custom_fields: {"program_id": _programId,"local_id":_localId,"is_deleted":0}
		}, function (e) {
			if (e.success) {
		    	var post = e.posts[0];
		    	Ti.API.info('Posting Success: id: ' + post.id);
		    	Ti.App.fireEvent("topicCreatedACS",{newTopic:post});
		    } else {
		        Ti.API.info('topicACS_create Error: '+((e.error && e.message) || JSON.stringify(e)));
		   	}
		}
	);
}