function MessageboardMainWindow(_programId) {
	//HEADERS
	var Topic = require('model/topic');
	var TopicACS = require('acs/topicACS');
	
	var MessageboardHeaderTableViewRow = require('ui/common/Mb_MessageboardHeaderTableViewRow');
	var MessageboardTableViewRow = require('ui/common/Mb_MessageboardTableViewRow');
	var MessageboardAddWindow = require('ui/common/Mb_MessageboardAddWindow');
	var CommentWindow = require('ui/common/Mb_CommentWindow');
	var CacheHelper = require('helpers/cacheHelper');
		
	//OBJECTS INSTANTIATION
	var messageboardHeader = new MessageboardHeaderTableViewRow('Reya','Famous Lakorn');	
	var addWindow = new MessageboardAddWindow();	
		
	//UI STUFF
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Message Board",
		barColor: '#6d0a0c'
	});
	
	var allTopicTable = Ti.UI.createTableView({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		scrollable: true
	});
	
	//ADDING UI COMPONENTS TO WINDOW
	self.add(allTopicTable);

	//CALLBACK FUNCTIONS
	function topicsLoadedCompleteCallback(e) {
		//add to local db
		Topic.topicModel_updateTopicsFromACS(e.aa,_programId); 
	}

	function topicsDbUpdatedCallback(e) {
		//clear current data in the table
		allTopicTable.data = [];
		var viewRowsData = [messageboardHeader];
		
		//retrieve from db
		var allTopics = Topic.topicModel_fetchFromProgramId(_programId);
		for (var i=0;i<allTopics.length;i++) {
			var row = new MessageboardTableViewRow(allTopics[i]);
			viewRowsData.push(row);
		}
		allTopicTable.setData(viewRowsData);
	}
	
	//BEGIN -- ADD EVENTLISTNERS
	messageboardHeader.addButton.addEventListener('click', function(e) {
		self.containingTab.open(addWindow);
	});

	allTopicTable.addEventListener('click', function(e){
		if (e.index == 0) return;
		var commentwin = new CommentWindow(e.row.topic.id);			
		self.containingTab.open(commentwin);
	});		
	
	Ti.App.addEventListener("topicsLoadedComplete", topicsLoadedCompleteCallback);
	Ti.App.addEventListener("topicsDbUpdated", topicsDbUpdatedCallback);

	self.addEventListener("close", function(e) {
		alert("closing MbMainWindow-rarely see this");
		Ti.App.removeEventListener("topicsLoadedComplete", topicsLoadedCompleteCallback);
		Ti.App.removeEventListener("topicsDbUpdated", topicsDbUpdatedCallback);
	});	
	//END -- ADD EVENTLISTNERS
	
	//just to be safe, TopicACS.topicACS_fetchAllTopicsOfProgramId should come after addEventListener; register should come before firing)
	CacheHelper.fetchACSDataOrCache('topicsOfProgram'+_programId, TopicACS.topicACS_fetchAllTopicsOfProgramId, _programId, 'topicsDbUpdated');
	
	return self;
}
module.exports = MessageboardMainWindow;
