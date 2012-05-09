<<<<<<< HEAD
/*
exports.tvprogramACS_fetchAllTVProgram = function(_programTitle) {
	var topicsOfProgram = [];
	
	Cloud.Events.query({
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
	*/
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
=======
exports.tvprogramACS_fetchAllProgram = function() {
	var programs = [];
	var url = "https://api.cloud.appcelerator.com/v1/events/query.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	
	      	for (var i = 0; i < responseJSON.response.length; i++) {
	            var program = responseJSON.response.events[i];
	            var curProgram = {
	            	id: program.id,
	            	title: "MickeyMouse show" //program.title,
	            }
				programs.push(curProgram);
			}
	        Ti.App.fireEvent("programsLoadedComplete",{fetchedPrograms:programs});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('event error');
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();  // request is actually sent with this statement
>>>>>>> MessageBoard-Feature
}