//testing branch
function WebboardMainWindow() {
	var TopicACS = require('acs/topicACS');
	var TopicDb = require('model/topicDb'); //will rename to Topic after cleanup
	
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
		
		Ti.App.addEventListener("topicsLoadedComplete", function(e) {
			//add to db
			TopicDb.topicModel_updateTopicsFromACS(e.fetchedTopics,1); 
			
			//retrieve from db --> need to clear table by table.setData();
			var allTopics = TopicDb.topicModel_fetchFromProgramId(1);
			for (var i=0;i<allTopics.length;i++) {
				var row = new TopicTableViewRow();
				row._setTopic(allTopics[i]);
				data.push(row);
			}
			table.setData(data);
		});
		
		//just to be safe, TopicACS.topicACS_fetchAllTopicsOfProgramId should come after addEventListener; register should come before firing)
		TopicACS.topicACS_fetchAllTopicsOfProgramId(1);
		
		//Topic.fetchAllTopicsOfProgramId(1);
		
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