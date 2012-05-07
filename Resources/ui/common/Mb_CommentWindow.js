function CommentWindow(_postId) {
	var Comment = require('model/comment');
	var CommentACS = require('acs/commentACS');
	
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Webboard",
		barColor: '#6d0a0c'
	});

	var table = Titanium.UI.createTableView({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		scrollable: true
	});
	self.add(table);
	
	(function() {
		table.addEventListener('click', function(e){
			Ti.API.warn(e.index);
		});
		
		
		var viewRowsArray = [];
		//Create a header
		var CommentHeaderTableViewRow = require('ui/common/Mb_CommentHeaderTableViewRow');
		var header = new CommentHeaderTableViewRow();
		header.topicLabel.text = "What happened to Peter?";
		header.dateLabel.text = "Submitted 3 hours ago by Test";
		
		header.replyTextField.addEventListener('return', function(e) {
			//var reply = self.topic.addReply(header.replyTextField.value);
			
			//var row = new CommentTableViewRow(table);
			//row._setReply(reply);
			//data.push(row);
			
			//table.setData(data);	
			CommentACS.commentToPostACS_create(header.replyTextField.value,_postId);
			header.replyTextField.value = "";
		});
		
		Ti.App.addEventListener('commentCreatedACS', function(e) {
			header.replyTextField.value = "";
			var newComment = e.newComment;	
			alert("receving fired event from CommentACS create");
			//Comment.commentModel_add(newComment);
		});
		
		viewRowsArray.push(header);
		table.setData(viewRowsArray);	
		var CommentTableViewRow = require('ui/common/Mb_CommentReplyTableViewRow');

		//listening when Cloud-comment is done, then add to the db
		Ti.App.addEventListener("commentsLoadedComplete", function(e) {
			//add to db
			
			//TODO: duplicate addEventListener for commentsLoadedComplete..by going back and forth between pages
			alert("Cloud CommentACS fetchAllComments - DONE");
			Ti.API.info(e.fetchedComments);
//			Comment.commentModel_updateCommentsFromACS(e.fetchedComments,_postId); 
		});
		
		//just to be safe, TopicACS.topicACS_fetchAllTopicsOfProgramId should come after addEventListener; register should come before firing)
		CommentACS.commentACS_fetchAllCommentsOfPostId(_postId);
			
		/*self._setTopic = function(topic) {
			self.topic = Topic.get(topic.id);
			header.topicLabel.text = self.topic.title;
			header.dateLabel.text = "Submitted " + since(self.topic.created_at);
			data = [
				header
			];
			
			for (var i=0;i<self.topic.replies.length;i++) {
				var row = new CommentTableViewRow(table);
				row._setReply(self.topic.replies[i]);
				data.push(row);
			}
			table.setData(data);
		};*/
	})();
	
	return self;
}


module.exports = CommentWindow;