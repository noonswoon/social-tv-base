function MessageboardMainWindow(_programId) {
	//HEADERS
	var Topic = require('model/topic');
	var TopicACS = require('acs/topicACS');
	
	var MessageboardHeader = require('ui/common/Mb_MessageboardHeader');
	var MessageboardTableViewRow = require('ui/common/Mb_MessageboardTableViewRow');
	var MessageboardAddWindow = require('ui/common/Mb_MessageboardAddWindow');
	var CommentWindow = require('ui/common/Mb_CommentWindow');
	var CacheHelper = require('helpers/cacheHelper');
		
	//OBJECTS INSTANTIATION
	var messageboardHeader = new MessageboardHeader('Reya','Famous Lakorn');	
	var addWindow = new MessageboardAddWindow(_programId);	
		
	//UI STUFF
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Message Board",
		barColor: '#6d0a0c'
	});

	var searchTextField = Titanium.UI.createSearchBar({
		left: 50,
		top: 130,
		barColor:'#6d0a0c',
		showCancel:false,
		hintText:'Search here...',
	});
	
	var allTopicTable = Ti.UI.createTableView({
		top: 120,
		left: 0,
		right: 0,
		bottom: 0,
		scrollable: true,
		search: searchTextField,//messageboardHeader.searchTextField,
		filterAttribute: 'filter',
		searchHidden: false
	});	


	var addButton = Ti.UI.createButton({
		right: 10,
		top: 0,
		width: 30,
		height: 30,
		title: '+'
	});
	
	//var searchbarTableViewRow = Ti.UI.createTableViewRow();
	//searchbarTableViewRow.add(searchTextField);
	//searchbarTableViewRow.add(addButton);
	
	//ADDING UI COMPONENTS TO WINDOW
	self.add(messageboardHeader);
	self.add(allTopicTable);

	//CALLBACK FUNCTIONS
	function topicsLoadedCompleteCallback(e) {
		//add to local db
		Topic.topicModel_updateTopicsFromACS(e.topicsOfProgram,_programId); 
	}

	function topicsDbUpdatedCallback(e) {
		//clear current data in the table
		allTopicTable.data = [];
		var viewRowsData = [];//[searchbarTableViewRow];
		
		//retrieve from db
		var allTopics = Topic.topicModel_fetchFromProgramId(_programId);
		for (var i=0;i<allTopics.length;i++) {
			var row = new MessageboardTableViewRow(allTopics[i]);
			viewRowsData.push(row);
		}
		allTopicTable.setData(viewRowsData);
	}
	
	function addNewTopicTableViewRowCallback(e) {
		var tableViewRowDetail = e.topicDetailForNewTableViewRow;
		var topicRow = new MessageboardTableViewRow(tableViewRowDetail);
		allTopicTable.insertRowAfter(0,topicRow);
	}
	
	function topicCreatedACSCallback(e) {	
		var newTopic = e.newTopic;	
		var topicForTableViewRow = {
			title: newTopic.title,
			id: newTopic.custom_fields.local_id,
			acsObjectId:newTopic.id,
			hasChild:true,
			color: '#fff',
			username: acs.getUserLoggedIn().username,
			updatedAt: convertACSTimeToLocalTime(newTopic.updated_at)
		};
		var topicRow = new MessageboardTableViewRow(topicForTableViewRow);
		allTopicTable.updateRow(1,topicRow);
		
		Topic.topicModel_updateACSObjectIdField(e.newTopic);
	}
	
	//BEGIN -- ADD EVENTLISTNERS
	addButton.addEventListener('click', function(e) {
		self.containingTab.open(addWindow);
	});
	

	allTopicTable.addEventListener('click', function(e){
		if (e.index == 0) return;
		var commentwin = new CommentWindow(e.row.topic.acsObjectId);			
		self.containingTab.open(commentwin);
	});		
	
	Ti.App.addEventListener("topicsLoadedComplete", topicsLoadedCompleteCallback);
	Ti.App.addEventListener("topicsDbUpdated", topicsDbUpdatedCallback);
	Ti.App.addEventListener("insertingTopicTableViewRow", addNewTopicTableViewRowCallback);
	Ti.App.addEventListener('topicCreatedACS', topicCreatedACSCallback);
	
	searchTextField.addEventListener('return', function(e) {
		searchTextField.blur();
	});
	searchTextField.addEventListener('cancel', function(e) {
		searchTextField.blur();
	});

	self.addEventListener("close", function(e) {
		alert("closing MbMainWindow-rarely see this");
		Ti.App.removeEventListener("topicsLoadedComplete", topicsLoadedCompleteCallback);
		Ti.App.removeEventListener("topicsDbUpdated", topicsDbUpdatedCallback);
		Ti.App.removeEventListener("insertingTopicTableViewRow", addNewTopicTableViewRowCallback);
		Ti.App.removeEventListener('topicCreatedACS', topicCreatedACSCallback);
	});	
	//END -- ADD EVENTLISTNERS
	
	//just to be safe, TopicACS.topicACS_fetchAllTopicsOfProgramId should come after addEventListener; register should come before firing)
	CacheHelper.fetchACSDataOrCache('topicsOfProgram'+_programId, TopicACS.topicACS_fetchAllTopicsOfProgramId, _programId, 'topicsDbUpdated');
	
	return self;
}
module.exports = MessageboardMainWindow;
