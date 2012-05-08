//testing branch
function MessageboardMainWindow(_programId) {
	var Topic = require('model/topic');
	var TopicACS = require('acs/topicACS');
	
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Message Board",
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
		var MessageboardHeaderTableViewRow = require('ui/common/Mb_MessageboardHeaderTableViewRow');
		var header = new MessageboardHeaderTableViewRow('Reya','Famous Lakorn');
		
		var MessageboardAddWindow = require('ui/common/Mb_MessageboardAddWindow');
		var addWindow = new MessageboardAddWindow();
		header.addButton.addEventListener('click', function(e) {
			self.containingTab.open(addWindow);
		});
		
		var MessageboardTableViewRow = require('ui/common/Mb_MessageboardTableViewRow');
		
		Ti.App.addEventListener("topicsLoadedComplete", function(e) {
			//add to db
			Topic.topicModel_updateTopicsFromACS(e.fetchedTopics,_programId); 
		});
		
		Ti.App.addEventListener("topicsDbUpdated", function(e) {
			//clear current data in the table
			table.data = [];
			var viewRowsData = [header];
			
			//retrieve from db
			var allTopics = Topic.topicModel_fetchFromProgramId(_programId);
			for (var i=0;i<allTopics.length;i++) {
				var row = new MessageboardTableViewRow();
				row._setTopic(allTopics[i]);
				viewRowsData.push(row);
			}
			table.setData(viewRowsData);
		});

		
		//just to be safe, TopicACS.topicACS_fetchAllTopicsOfProgramId should come after addEventListener; register should come before firing)
		TopicACS.topicACS_fetchAllTopicsOfProgramId(_programId);

		
		var CommentWindow = require('ui/common/Mb_CommentWindow');

		table.addEventListener('click', function(e){
			if (e.index == 0) return;
			
			var commentwin = new CommentWindow(e.row.topic.id);			
			//commentwin._setTopic("Hey my friend");
			self.containingTab.open(commentwin);
		});
		
	})();
	
	return self;
}
module.exports = MessageboardMainWindow;