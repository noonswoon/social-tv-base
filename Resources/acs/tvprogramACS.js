exports.tvprogramACS_fetchAllTVProgram = function(_programTitle) {
	var topicsOfProgram = [];
	
	Cloud.Posts.query({
	    page: 1,
	    per_page: 20,
	}, function (e) {
	    if (e.success) {
	        Ti.API.info("num programtv: "+e.events.length);
	    } else {
	        Ti.API.info('Fetching Topic Error: ' + ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
}
	
exports.topicACS_create = function(_title,_programId) {
	//connecting with Cloud
	Cloud.Posts.create({
    		content: 'dummy text',
			title: _title, 
			custom_fields: {"program_id": _programId}
		}, function (e) {
			if (e.success) {
		    	var post = e.posts[0];
		    	Ti.API.info('Posting Success: id: ' + post.id);
		    	Ti.App.fireEvent("topicCreatedACS",{newTopic:post});
		    } else {
		        Ti.API.info('Posting Error: '+((e.error && e.message) || JSON.stringify(e)));
		   	}
		}
	);
}