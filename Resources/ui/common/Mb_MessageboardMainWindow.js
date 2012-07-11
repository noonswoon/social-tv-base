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
	var CheckinGuidelineWindow = require('ui/common/Am_CheckinGuideline');
	var checkinguidelinewin = null;
		
	//Google Analytics
	Titanium.App.Analytics.trackPageview('/Messageboard');
	
	var self = Titanium.UI.createWindow({
		backgroundImage: 'images/messageboard/appBG.png',
		barImage: 'images/nav_bg_w_pattern.png',
		title: "Message Board",
	});
	
	//OBJECTS INSTANTIATION		
	var currentProgramId = _programId;
	var messageboardHeader = new MessageboardHeader('Chatterbox','Chatterbox Message Board');	
	
	//Check whether user has checkin to any program
	if(currentProgramId === '') { //have not checkedin to any program yet
		var CheckinGuidelineWindow = require('ui/common/Am_CheckinGuideline');
		checkinguidelinewin = new CheckinGuidelineWindow('messageboard');
		self.add(checkinguidelinewin);
		currentProgramId = 'CTB_PUBLIC';
		messageboardHeader._setHeader('Chatterbox','CTB subname','ctbdummy.png',0,'ch3');
	} else {
		var program = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
		messageboardHeader._setHeader(program[0].name,program[0].subname,program[0].photo,program[0].number_checkins,program[0].channel_id);	
	}	
	
	var addWindow = new MessageboardAddWindow(currentProgramId);	
	var usingPull2Refresh = false;
	var pickerSelectedIndex = 0;
	
	//UI STUFF
	var callPicker = Ti.UI.createButton({
		width: 39,
		height: 32,
		backgroundImage: 'images/messageboard/option_button.png'
	});
	
	self.rightNavButton = callPicker;
	
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
		barColor:'#43a5cf',
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
	var pickerView = Titanium.UI.createView({
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

	var toolbar =  Ti.UI.iOS.createToolbar({
		top:0,
		zIndex: 3,
		items:[cancel,spacer,done]
	});

	var picker = Titanium.UI.createPicker({
		top:43
	});
		
	picker.selectionIndicator=true;	
	pickerView.add(toolbar);

	var slide_in =  Titanium.UI.createAnimation({bottom:0});
	var slide_out =  Titanium.UI.createAnimation({bottom:-251});
	
	callPicker.addEventListener('click',function() {
		pickerView.animate(slide_in);
		self.add(opacityView);
	});

	cancel.addEventListener('click',function() {
		pickerView.animate(slide_out);
		self.remove(opacityView);
	});

	done.addEventListener('click',function() {
		pickerView.animate(slide_out);
		self.remove(opacityView);
		
		currentProgramId = picker.getSelectedRow(0).programId;
		var selectedProgram = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
		messageboardHeader._setHeader(selectedProgram[0].name,selectedProgram[0].subname,selectedProgram[0].photo,selectedProgram[0].number_checkins,selectedProgram[0].channel_id);	
		
		//reset programId for addWindow
		addWindow._setProgramId(currentProgramId);
		
		//reset data in the tableview
		CacheHelper.fetchACSDataOrCache('topicsOfProgram'+currentProgramId, TopicACS.topicACS_fetchAllTopicsOfProgramId, currentProgramId, 'topicsDbUpdated');
	});

	picker.addEventListener('change',function(e) {
		pickerSelectedIndex = e.rowIndex;
	});
	
	self.add(pickerView);
//////////////////

	var allTopicTable = Ti.UI.createTableView({
		top: 165,
		//bottom: 10,
		bottom:0,
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

	self._initializePicker = function() {
		var dataForPicker = [];
		var preSelectedRow = 0;
		for(var i=0;i<myCurrentCheckinPrograms.length;i++){
			var programId = myCurrentCheckinPrograms[i];
			if(myCurrentSelectedProgram === programId) 
				preSelectedRow = i;
					
			var programInfo = TVProgram.TVProgramModel_fetchProgramsWithProgramId(programId);
			var programName = programInfo[0].name;
			dataForPicker.push({title:programName, programId:programId});
		}
		picker.setSelectedRow(0,preSelectedRow,false);
		picker.add(dataForPicker);
		pickerView.add(picker);
	}
	
	self._updatePickerData = function(checkinProgramId) {
		
	}
	
	self._removeGuidelineWindow = function(checkinProgramId) {
		self.remove(checkinguidelinewin);
		
		//update content on the page
		currentProgramId = checkinProgramId;
		var program = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
		messageboardHeader._setHeader(program[0].name,program[0].subname,program[0].photo,program[0].number_checkins,program[0].channel_id);
		
		CacheHelper.fetchACSDataOrCache('topicsOfProgram'+currentProgramId, TopicACS.topicACS_fetchAllTopicsOfProgramId, currentProgramId, 'topicsDbUpdated');	
	};
	
	//CALLBACK FUNCTIONS
	function topicsLoadedCompleteCallback(e) {
		//add to local db
		Topic.topicModel_updateTopicsFromACS(e.topicsOfProgram,currentProgramId); 
		
		//signify pull2refresh to be done [if it comes from Pull2Refresh] 
		if(usingPull2Refresh) {
			Ti.API.info('using pull to refresh..finish up');
			allTopicTable.refreshFinished();
			usingPull2Refresh = false;
			CacheHelper.resetCacheTime('topicsOfProgram'+currentProgramId);
		}
	}

	function topicsDbUpdatedCallback(e) {
		//clear current data in the table
		allTopicTable.data = [];
		var viewRowsData = [];

		//retrieve from db
		var allTopics = Topic.topicModel_fetchFromProgramId(currentProgramId);
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
			// photo: newTopic.photo,
			content: newTopic.content,
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
	var lastUpdatedDateObj = CacheHelper.getCacheTime('topicsOfProgram'+currentProgramId);
	var lastUpdatedStr = "No updated";
	if(lastUpdatedDateObj != null) {
		lastUpdatedStr = lastUpdatedDateObj.format("DD-MM-YYYY HH:mm"); 
	}
	PullToRefresh.addASyncPullRefreshToTableView(allTopicTable, function() {
		Ti.API.info('using pull to refresh');
		usingPull2Refresh = true;
		TopicACS.topicACS_fetchAllTopicsOfProgramId(currentProgramId);
	}, { //settings
		backgroundColor: '#959595', 
		statusLabel: {
			color: 'white'
		},
		updateLabel: {
			text: 'Last Updated: '+lastUpdatedStr,
			color: 'white'
		}
	});	

	//just to be safe, TopicACS.topicACS_fetchAllTopicsOfProgramId should come after addEventListener; register should come before firing)
	CacheHelper.fetchACSDataOrCache('topicsOfProgram'+currentProgramId, TopicACS.topicACS_fetchAllTopicsOfProgramId, currentProgramId, 'topicsDbUpdated');

	return self;
}
module.exports = MessageboardMainWindow;