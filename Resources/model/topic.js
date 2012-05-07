//Hello jaew!

var Topic = {};
var TopicACS = require('acs/topicACS');
(function() {
	
	var runId = 0;
	function mock(options) {
		var topic = {
			id: "topic_" + (runId++),
			title: (options.title || ""),
			replies: (options.replies || []),
			created_at: options.created_at
		};
		
		topic.addReply = function(content) {
			var reply = mockReply({
				content: content
			});
			
			topic.replies.push(reply);
			return reply;
		};
		
		return topic;
	}
	
	function mockReply(options) {
		return {
			id: "reply_" + (runId++),
			content: options.content || "",
			created_at: options.created_at
		};
	}
	
	
	
	var data = {};
	var topicsOfProgram = [];
	var now = new Date();
	
	{
		var topic = mock({
			title: "What happened to Peter?",
			replies: [
				mockReply({ content: "I don't know", created_at: new Date(now.getTime() - 61 * 60 * 1000) }),
				mockReply({ content: "He was killed, I believe", created_at: new Date(now.getTime() - 91 * 60 * 1000) })
			],
			created_at: new Date(now.getTime() - 25 * 60 * 1000)
		});
		
		data[topic.id] = topic;
	}
	
	{
		var topic = mock({
			title: "How did John die?",
			replies: [
				mockReply({ content: "Somebody hired a hit man", created_at: new Date(now.getTime() - 20 * 60 * 60 * 1000) }),
				mockReply({ content: "He fell off the building", created_at: new Date(now.getTime() - 26 * 60 * 60 * 1000) })
			],
			created_at: new Date(now.getTime() -  2 * 24 * 60 * 60 * 1000)
		});
		
		data[topic.id] = topic;
	}

/*	
	Topic.fetchAllTopicsOfProgramId = function(_programId) {
		for (var id in data) {
			topicsOfProgram.push(data[id]);
		}
		
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
		            	title: post.title,
		            	created_at: post.updated_at
		            }
					topicsOfProgram.push(curTopic);
				}
		        Ti.App.fireEvent("topicsLoadedComplete",{fetchedTopics:topicsOfProgram});
		    } else {
		        Ti.API.info('Fetching Topic Error: ' + ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	}
*/
	
	Topic.get = function(id) {
		return data[id];
	}
	
	/*
	Topic.create = function(_title,_programId) {
		if (Topic.createCallback !== undefined) 
			Topic.createCallback(topic);
	
		//connecting with Cloud
		TopicACS.topicACS_create(_title,_programId);
	}*/
	
	Topic.addCreateListener = function(block) {
		Topic.createCallback = block;
	}
})();


