function WebboardViewWindow() {
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
		
		var DetailedTopicTableViewRow = require('ui/common/Wb_DetailedTopicTableViewRow');
		var header = new DetailedTopicTableViewRow();
		header.topicLabel.text = "What happened to Peter?";
		header.dateLabel.text = "Submitted 3 hours ago by Test";
		
		var data = [];
		
		header.replyTextField.addEventListener('return', function(e) {
			var reply = self.topic.addReply(header.replyTextField.value);
			
			var row = new ReplyTableViewRow(table);
			row._setReply(reply);
			data.push(row);
			
			table.setData(data);	
			
			header.replyTextField.value = "";
		});

		
		var ReplyTableViewRow = require('ui/common/Wb_ReplyTableViewRow');
		
		self._setTopic = function(topic) {
			self.topic = Topic.get(topic.id);
			
			header.topicLabel.text = self.topic.title;
			header.dateLabel.text = "Submitted " + since(self.topic.created_at);
			
			data = [
				header
			];
			
			for (var i=0;i<self.topic.replies.length;i++) {
				var row = new ReplyTableViewRow(table);
				row._setReply(self.topic.replies[i]);
				data.push(row);
			}
			
			table.setData(data);
		};
	})();
	
	return self;
}


module.exports = WebboardViewWindow;