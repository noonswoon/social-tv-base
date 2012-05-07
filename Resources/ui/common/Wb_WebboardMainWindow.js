//testing branch
function WebboardMainWindow() {
	var Topic = require('model/topic');
	var TopicACS = require('acs/topicACS');
	
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
		
		var TopicTableViewRow = require('ui/common/Wb_TopicTableViewRow');
		
		Ti.App.addEventListener("topicsLoadedComplete", function(e) {
			//add to db
			Topic.topicModel_updateTopicsFromACS(e.fetchedTopics,1); 
		});
		
		Ti.App.addEventListener("topicsDbUpdated", function(e) {
			//clear current data in the table
			table.data = [];
			var viewRowsData = [header];
			
			//retrieve from db
			var allTopics = Topic.topicModel_fetchFromProgramId(1);
			for (var i=0;i<allTopics.length;i++) {
				var row = new TopicTableViewRow();
				row._setTopic(allTopics[i]);
				viewRowsData.push(row);
			}
			table.setData(viewRowsData);
		});

		
		//just to be safe, TopicACS.topicACS_fetchAllTopicsOfProgramId should come after addEventListener; register should come before firing)
		TopicACS.topicACS_fetchAllTopicsOfProgramId(1);

		
		var WebboardViewWindow = require('ui/common/Wb_WebboardViewWindow');
		var viewWindow = new WebboardViewWindow();
		table.addEventListener('click', function(e){
			if (e.index == 0) return;
			
			viewWindow._setTopic("Hey my friend");
			self.containingTab.open(viewWindow);
		});
		
	})();
	
	return self;
}
module.exports = WebboardMainWindow;