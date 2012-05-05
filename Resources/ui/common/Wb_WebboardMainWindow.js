function WebboardMainWindow() {
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Webboard",
		barColor: '#6d0a0c'
	});
	
	
	var table = Ti.UI.createTableView({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		scrollable: true
	});
	
	self.add(table);
	
	(function() {
		var WebboardHeaderTableViewRow = require('ui/common/Wb_WebboardHeaderTableViewRow');
		var header = new WebboardHeaderTableViewRow('Reya','Famous Lakorn');
		
		var WebboardAddWindow = require('ui/common/Wb_WebboardAddWindow');
		var addWindow = new WebboardAddWindow();
		header.addButton.addEventListener('click', function(e) {
			self.containingTab.open(addWindow);
		});
		
		var data = [
			header
		];
		
		var TopicTableViewRow = require('ui/common/Wb_TopicTableViewRow');
		var topics = Topic.all();
		for (var i=0;i<topics.length;i++) {
			var row = new TopicTableViewRow();
			row._setTopic(topics[i]);
			data.push(row);
		}
	
		table.setData(data);
		
		Topic.addCreateListener(function(topic) {
			Ti.API.warn('hello');
			
			var row = new TopicTableViewRow();
			row._setTopic(topic);
			data.push(row);
			
			table.setData(data);
		});
		
		var WebboardViewWindow = require('ui/common/Wb_WebboardViewWindow');
		var viewWindow = new WebboardViewWindow();
		table.addEventListener('click', function(e){
			if (e.index == 0) return;
			
			viewWindow._setTopic(data[e.index].topic);
			self.containingTab.open(viewWindow);
		});
	})();
	
	return self;
}

module.exports = WebboardMainWindow;