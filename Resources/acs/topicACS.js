//testing Events ACS --var network = require('lib/network');

exports.topicACS_fetchAllTopicsOfProgramId = function(_programId) {
	var topicsOfProgram = [];
	
	//..just testing ACS network.getEvents();
	
	Cloud.Posts.query({
	    page: 1,
	    per_page: 20,
	    where: {
	        program_id: _programId
	    }
	}, function (e) {
	    if (e.success) {
	        for (var i = 0; i < e.posts.length; i++) {
	            var post = e.posts[i];
	            var curTopic = {
	            	id: post.id,
	            	program_id: _programId,
	            	title: post.title,
	            	user:post.user,
	            	updated_at: post.updated_at
	            }
				topicsOfProgram.push(curTopic);
			}
	        Ti.App.fireEvent("topicsLoadedComplete",{fetchedTopics:topicsOfProgram});
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