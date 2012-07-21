exports.topicACS_fetchAllTopicsOfProgramId = function(_paramsArray) {

	var programId = _paramsArray[0];
	var messageboardACSPageIndex = _paramsArray[1];
	var topicsOfProgram = [];
	Cloud.Posts.query({
	    page: messageboardACSPageIndex,
	    per_page: 10,
	    where: {
	        program_id: programId
	    }, 
	    order: '-created_at',
	    response_json_depth: 2
	}, function (e) {
	    if (e.success) {
	        for (var i = 0; i < e.posts.length; i++) {
	            var post = e.posts[i];
	            var numComments = 0; 
	            if(post.reviews_count !== undefined)
	            	numComments = post.reviews_count;
	            var curTopic = {
	            	id: post.id,
	            	programId: programId,
	            	title: post.title,
	            	content: post.content,
	            	photo: post.photo,
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
	
exports.topicACS_create = function(_title,_content,_filename,_programId,_localId) {
	//connecting with Cloud
	if(_filename !==null) {
		Ti.API.info('filename is NOT NULL');
		Cloud.Posts.create({
			title: _title,
			photo: Titanium.Filesystem.getFile(_filename.nativePath),
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
		});
	} else {
		Ti.API.info('filename is NULL');
		Cloud.Posts.create({
			title: _title,
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
		});
	}
}