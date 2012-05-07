function CommentWindow(_postId) {
	var Topic = require('model/comment');
	var TopicACS = require('acs/commentACS');
	
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
		
		var CommentHeaderTableViewRow = require('ui/common/Mb_CommentHeaderTableViewRow');
		var header = new CommentHeaderTableViewRow();
		header.topicLabel.text = "What happened to Peter?";
		header.dateLabel.text = "Submitted 3 hours ago by Test";
		
		var data = [];
		
		header.replyTextField.addEventListener('return', function(e) {
			//var reply = self.topic.addReply(header.replyTextField.value);
			
			//var row = new CommentTableViewRow(table);
			//row._setReply(reply);
			//data.push(row);
			
			//table.setData(data);	
			
			header.replyTextField.value = "";
		});

		
		var CommentTableViewRow = require('ui/common/Mb_CommentReplyTableViewRow');
		
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