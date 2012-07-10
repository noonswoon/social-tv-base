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
	
	//Google Analytics
	Titanium.App.Analytics.trackPageview('/Messageboard');

	//OBJECTS INSTANTIATION		
	var currentProgramId = _programId;
	var messageboardHeader = new MessageboardHeader('General Board','Chatterbox General Board');	
	if(currentProgramId === 'CTB_PUBLIC') {
		messageboardHeader._setHeader('General Board','Chatterbox General Board','http://a0.twimg.com/profile_images/2208934390/Screen_Shot_2012-05-11_at_3.43.35_PM.png',452,'CTB');
	} else {
		var program = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
		messageboardHeader._setHeader(program[0].name,program[0].subname,program[0].photo,program[0].number_checkins,program[0].channel_id);	
	}	
	
	
	var addWindow = new MessageboardAddWindow(currentProgramId);	
	var usingPull2Refresh = false;
	var hasLoadedPicker = false;
	var pickerSelectedIndex = 0;
	
	//UI STUFF
	var callPicker = Ti.UI.createButton({
		width: 39,
		height: 32,
		backgroundImage: 'images/messageboard/option_button.png'
	});
	
	var self = Titanium.UI.createWindow({
		backgroundImage: 'images/messageboard/appBG.png',
		barImage: 'images/nav_bg_w_pattern.png',
		title: "Message Board",
		rightNavButton: callPicker
	});
	
	if(myCurrentCheckinPrograms.length<=0) {
		var CheckinFirstWindow = require('ui/common/Howto_CheckinFirst');
		var checkinFirstWindow = new CheckinFirstWindow('messageboard');
		self.add(checkinFirstWindow);
	}
	
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

	var toolbar =  Ti.UI.iOS.createToolbar({
		top:0,
		zIndex: 3,
		items:[cancel,spacer,done]
	});

	var picker = Titanium.UI.createPicker({
		top:43
	});
		
	picker.selectionIndicator=true;	
	picker_view.add(toolbar);

	var slide_in =  Titanium.UI.createAnimation({bottom:0});
	var slide_out =  Titanium.UI.createAnimation({bottom:-251});
	
	callPicker.addEventListener('click',function() {
		if(!hasLoadedPicker) {
			var dataForPicker = [];
			for(var i=0;i<myCurrentCheckinPrograms.length;i++){
				var programId = myCurrentCheckinPrograms[i];
				if(programId === 'CTB_PUBLIC') {
					dataForPicker.push({title:'Public Board', progId:'CTB_PUBLIC'});
				} else {
					var programInfo = TVProgram.TVProgramModel_fetchProgramsWithProgramId(programId);
					Ti.API.info('programId: '+programId+', programInfo: '+JSON.stringify(programInfo));
					var programName = programInfo[0].name;
					var program_id = programInfo[0].program_id;
					dataForPicker.push({title:programName, progId:program_id});
				}
			}
			picker.add(dataForPicker);
			picker_view.add(picker);
			hasLoadedPicker = true;
		}
		picker_view.animate(slide_in);
		self.add(opacityView);
	});

	cancel.addEventListener('click',function() {
		picker_view.animate(slide_out);
		self.remove(opacityView);
	});

	done.addEventListener('click',function() {
		picker_view.animate(slide_out);
		self.remove(opacityView);
		if(pickerSelectedIndex === 0) {
			currentProgramId = 'CTB_PUBLIC';
			messageboardHeader._setHeader('ธรณีนี่นี้ใครครอง','ตอนที่ 17','images/messageboard/yaya.jpg',2000,'ch3');
		} else {
			currentProgramId = picker.getSelectedRow(0).progId;
			var selectedProgram = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
			messageboardHeader._setHeader(selectedProgram[0].name,selectedProgram[0].subname,selectedProgram[0].photo,selectedProgram[0].number_checkins,selectedProgram[0].channel_id);	
		}
		//reset programId for addWindow
		addWindow._setProgramId(currentProgramId);
		
		//reset data in the tableview
		CacheHelper.fetchACSDataOrCache('topicsOfProgram'+currentProgramId, TopicACS.topicACS_fetchAllTopicsOfProgramId, currentProgramId, 'topicsDbUpdated');
	});

	picker.addEventListener('change',function(e) {
		pickerSelectedIndex = e.rowIndex;
	});
	
	self.add(picker_view);
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