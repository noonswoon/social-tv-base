function MessageboardMainWindow(_programId) {
	//HEADERS
	var Topic = require('model/topic');
	var TopicACS = require('acs/topicACS');
	var TVProgram = require('model/tvprogram');

	var MessageboardHeader = require('ui/common/Mb_MessageboardHeader');
	var MessageboardTableViewRow = require('ui/common/Mb_MessageboardTableViewRow');
	var MessageboardAddWindow = require('ui/common/Mb_MessageboardAddWindow');
	var CommentWindow = require('ui/common/Mb_CommentWindow');
	var CacheHelper = require('helpers/cacheHelper');

	//OBJECTS INSTANTIATION
	var messageboardHeader = new MessageboardHeader('Reya','Famous Lakorn');	
	var addWindow = new MessageboardAddWindow(_programId);	
	var usingPull2Refresh = false;
	
	//UI STUFF

	var callPicker = Ti.UI.createButton({
		width: 39,
		height: 32,
		backgroundImage: 'images/messageboard/optionbutton.png'
	});

	var self = Titanium.UI.createWindow({
		backgroundImage: 'images/messageboard/appBG.png',
		barImage: 'images/NavBG.png',
		title: "Message Board",
		rightNavButton: callPicker
	});
	
	var searchView = Ti.UI.createView({
		top: 120,
		width:'auto',
		height:50,
		zIndex: 1,
		// backgroundColor: 'green'
		backgroundImage: 'images/messageboard/testBG.png'
	});
	

	var searchTextField = Titanium.UI.createSearchBar({
		top: 1, 
		left: 7,
		width: 265,
		backgroundImage: 'images/messageboard/test2.png',
        backgroundRepeat:true,
		showCancel:false,
		hintText:'Search here...',
	});

	var addButton = Ti.UI.createButton({
		right: 10,
		top: 9,
		width: 32,
		height: 32,
		backgroundImage: 'images/messageboard/add.png',
		backgroundSelectedImage: 'images/messageboard/add_onclick.png'
	});
	searchView.add(searchTextField);
	searchView.add(addButton);

//Opacity window when picker is shown
	var opacityView = Ti.UI.createView({
		opacity : 0.6,
		top : 0,
		height : 120,
		zIndex : 7777,
		backgroundColor: '#000'
	});

//Picker
	var picker_view = Titanium.UI.createView({
		height:251,
		bottom:-251,
		zIndex: 2
	});

	var cancel =  Titanium.UI.createButton({
		title:'Cancel',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});

	var done =  Titanium.UI.createButton({
		title:'Done',
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
	});

	var spacer =  Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});


	var toolbar =  Titanium.UI.createToolbar({
		top:0,
		zIndex: 3,
		items:[cancel,spacer,done]
	});

	var picker = Titanium.UI.createPicker({
		top:43
	});
	picker.selectionIndicator=true;
	
	for(var i=0;i<myCurrentCheckinPrograms.length;i++){
		var programId = myCurrentCheckinPrograms[i];
		var programInfo = TVProgram.TVProgramModel_fetchProgramsWithProgramId(programId);
		var programName = programInfo[0].name;
		var row = Ti.UI.createPickerRow();
		var programNameInRow = Ti.UI.createLabel({
			text: programName
		});
		row.add(programNameInRow);
		picker.add(row);
	}
	
	picker_view.add(toolbar);
	picker_view.add(picker);

	var slide_in =  Titanium.UI.createAnimation({bottom:0});
	var slide_out =  Titanium.UI.createAnimation({bottom:-251});

	callPicker.addEventListener('click',function() {
		picker_view.animate(slide_in);
		self.add(opacityView);
	});

	cancel.addEventListener('click',function() {
		picker_view.animate(slide_out);
		self.remove(opacityView);
	});

	done.addEventListener('click',function() {
		var test = picker.getSelectedRow(0);
		alert(test);
		picker_view.animate(slide_out);
		self.remove(opacityView);
	});

	self.add(picker_view);
//////////////////

	var allTopicTable = Ti.UI.createTableView({
		top: 170,
		bottom: 10,
		scrollable: true,
		//separatorColor: 'transparent',
		search: searchTextField,//messageboardHeader.searchTextField,
		filterAttribute: 'filter',
		searchHidden: true, //the bar is outside the table
		backgroundColor: 'transparent',
		style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
	});	

	//ADDING UI COMPONENTS TO WINDOW
	self.add(messageboardHeader);
	self.add(searchView);
	self.add(allTopicTable);


	//CALLBACK FUNCTIONS
	function topicsLoadedCompleteCallback(e) {
		//add to local db
		Topic.topicModel_updateTopicsFromACS(e.topicsOfProgram,_programId); 
		
		//signify pull2refresh to be done [if it comes from Pull2Refresh] 
		if(usingPull2Refresh) {
			Ti.API.info('using pull to refresh..finish up');
			allTopicTable.refreshFinished();
			usingPull2Refresh = false;
			CacheHelper.resetCacheTime('topicsOfProgram'+_programId);
		}
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
		
		if(allTopicTable.data[0] === undefined) {
			var firstDataArray = [topicRow];
			allTopicTable.setData(firstDataArray);	
		} else allTopicTable.insertRowBefore(0,topicRow);
	}

	function topicCreatedACSCallback(e) {	
		var newTopic = e.newTopic;	
		var topicForTableViewRow = {
			title: newTopic.title,
			id: newTopic.custom_fields.local_id,
			acsObjectId:newTopic.id,
			hasChild:true,
			color: '#fff',
			commentsCount: 0,
			username: acs.getUserLoggedIn().username,
			updatedAt: convertACSTimeToLocalTime(newTopic.updated_at)
		};
		var topicRow = new MessageboardTableViewRow(topicForTableViewRow);
		allTopicTable.updateRow(0,topicRow);

		Topic.topicModel_updateACSObjectIdField(e.newTopic);
	}

	//BEGIN -- ADD EVENTLISTNERS
	addButton.addEventListener('click', function(e) {
		self.containingTab.open(addWindow);
	});


	allTopicTable.addEventListener('click', function(e){
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

	//pull2refresh
	//pull2refresh module

	var lastUpdatedDateObj = CacheHelper.getCacheTime('topicsOfProgram'+_programId);
	var lastUpdatedStr = "No updated";
	if(lastUpdatedDateObj != null) {
		lastUpdatedStr = lastUpdatedDateObj.format("DD-MM-YYYY HH:mm"); 
	}
	
	PullToRefresh.addASyncPullRefreshToTableView(allTopicTable, function() {
		Ti.API.info('using pull to refresh');
		usingPull2Refresh = true;
		TopicACS.topicACS_fetchAllTopicsOfProgramId(_programId);
	}, { //settings
		updateLabel: {
			text: 'Last Updated: '+lastUpdatedStr,
		}
	});	

	//just to be safe, TopicACS.topicACS_fetchAllTopicsOfProgramId should come after addEventListener; register should come before firing)
	CacheHelper.fetchACSDataOrCache('topicsOfProgram'+_programId, TopicACS.topicACS_fetchAllTopicsOfProgramId, _programId, 'topicsDbUpdated');

	return self;
}
module.exports = MessageboardMainWindow;