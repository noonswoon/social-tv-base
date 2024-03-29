function MessageboardMainWindow(_programId) {
	//HEADERS
	var CheckinModel = require('model/checkin');
	var Topic = require('model/topic');
	var TopicACS = require('acs/topicACS');
	var TVProgram = require('model/tvprogram');
	
	var MessageboardHeader = require('ui/common/Mb_MessageboardHeader');
	var MessageboardTableViewRow = require('ui/common/Mb_MessageboardTableViewRow');
	var MessageboardAddWindow = require('ui/common/Mb_MessageboardAddWindow');
	var CommentWindow = require('ui/common/Mb_CommentWindow');
	var CacheHelper = require('helpers/cacheHelper');
	var CheckinGuidelineView = require('ui/common/Am_CheckinGuideline');
	var checkinguidelineview = null;
	var messageboardACSPageIndex = 1;
	var hasMoreTopics = true; 
	var allTopicTableY = -0;	
	
	//Google Analytics
	Titanium.App.Analytics.trackPageview('/Messageboard');
	
	var self = Titanium.UI.createWindow({
		backgroundImage: 'images/messageboard/appBG.png',
		barImage: 'images/nav_bg_w_pattern.png',
		title: L("Message Board"),
	});
	
	//OBJECTS INSTANTIATION		
	var currentProgramId = _programId;
	var messageboardHeader = new MessageboardHeader('Chatterbox','Chatterbox Message Board');	
	
	//Check whether user has checkin to any program
	var programPhoto = DEFAULT_CTB_IMAGE_URL;	
	
	if(currentProgramId === '') { //have not checkedin to any program yet
		checkinguidelineview = new CheckinGuidelineView('messageboard');
		self.add(checkinguidelineview);
		currentProgramId = 'CTB_PUBLIC';
		messageboardHeader._setHeader('Chatterbox','CTB subname','ctbdummy.png',435,2,'ch3');
	} else {
		var myUserId = acs.getUserId();
		var program = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
		//race condition..do not have data for currentProgramId...?
		if(program[0] === undefined)
			Ti.API.info(L('bad stuff...from: ')+currentProgramId);

		programPhoto = program[0].photo;
		var numFriendsCheckins = CheckinModel.checkin_fetchNumFriendsCheckinsOfProgram(program[0].id, myUserId);
		messageboardHeader._setHeader(program[0].name,program[0].subname,program[0].photo,program[0].number_checkins,numFriendsCheckins, program[0].channel_id);	
	}
	var addWindow = new MessageboardAddWindow(currentProgramId,programPhoto);	
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
		hintText:L('Search here...'),
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
		
	picker.selectionIndicator = true;	
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
		
		if(currentProgramId !== picker.getSelectedRow(0).programId) { //only change if user selected a new programId
			var myUserId = acs.getUserId();
			currentProgramId = picker.getSelectedRow(0).programId;
			var selectedProgram = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
			var numFriendsCheckins = CheckinModel.checkin_fetchNumFriendsCheckinsOfProgram(selectedProgram[0].id, myUserId);
			messageboardHeader._setHeader(selectedProgram[0].name,selectedProgram[0].subname,selectedProgram[0].photo,selectedProgram[0].number_checkins,numFriendsCheckins,selectedProgram[0].channel_id);	
		
			//reset programId for addWindow
			addWindow._setProgramId(currentProgramId);
		
			//reset data in the tableview
			CacheHelper.fetchACSDataOrCache('topicsOfProgram'+currentProgramId, TopicACS.topicACS_fetchAllTopicsOfProgramId, [currentProgramId,messageboardACSPageIndex], 'topicsDbUpdated',CACHE_TIMEOUT_SHORT);
			Ti.App.fireEvent('changingCurrentSelectedProgram',{newSelectedProgram:currentProgramId});
		}
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

	self._getNumRowsInPicker = function() {
		if(picker.columns === null) return 0;
		else if(picker.columns.length > 0) return picker.columns[0].rowCount;
		else return 0;
	};
	
	self._initializePicker = function() {
		//on the safe side, remove lingering pickers (if there are any)
		if(picker.columns.length > 0) {	
			var pickerColumn = picker.columns[0];
	    	var numRows = pickerColumn.rowCount;
	    	for(var i = numRows-1; i >= 0; i-- ){
	        	var curRow = pickerColumn.rows[i]
	        	pickerColumn.removeRow(curRow);
	    	}
	    	picker.reloadColumn(pickerColumn);
	    }
	    
	    setTimeout(function() {
	    	var dataForPicker = [];
			var selectedProgramId = "";
			var selectedProgramName = "";
			var currentCheckinPrograms = UserCheckinTracking.getCurrentCheckinPrograms();
			for(var i = 0; i < currentCheckinPrograms.length; i++){
				var programId = currentCheckinPrograms[i];
				var programInfo = TVProgram.TVProgramModel_fetchProgramsWithProgramId(programId);
				var programName = "Chatterbox";
				if(programInfo === undefined || programInfo[0] === undefined)
					Ti.API.info('msgboard: bad time...cannot find info for programId: '+programId+', arrayOfCheckinPrograms: '+JSON.stringify(currentCheckinPrograms));
				else programName = programInfo[0].name;
				
				if(UserCheckinTracking.getCurrentSelectedProgram() === programId) {
					//skip, not adding to array, will add it to the top of array at the end
					selectedProgramId = programId;	
					selectedProgramName = programName;
				}
				else dataForPicker.push({title:programName, programId:programId});
			}
			//for some reason, the fn picker.setSelectedRow doesn't work here (it keeps setting to picker index 0), 
			//need ad-hoc fix by setting the current selected program to be at the top of the picker
			dataForPicker.unshift({title:selectedProgramName, programId:selectedProgramId})
	
			picker.add(dataForPicker);
			pickerView.add(picker);
	    }, 500);
	};
	
	self._addNewPickerData = function(checkinProgramId, checkinProgramName) {
		var newPickerRow = Ti.UI.createPickerRow({title:checkinProgramName, programId: checkinProgramId});
		picker.add(newPickerRow);
		setTimeout(function(e) {
			var latestRow = picker.columns[0].rowCount - 1; 
			picker.setSelectedRow(0,latestRow,false);
		}, 500); //wait half-a-sec
	};
	
	self._updateSelectedPicker = function(newSelectedProgram) {
		var numRows = picker.columns[0].rowCount; 
		var selectedRow = 0;
		for(var i = 0; i < numRows; i++){
			var curProgramId = picker.columns[0].rows[i].programId; 
			if(curProgramId === newSelectedProgram) {
				selectedRow = i;
				break;
			}		
		}
		picker.setSelectedRow(0,selectedRow,false);
	};
	
	self._removeAllPickerData = function() {
		if(picker.columns.length > 0) {
			var pickerColumn = picker.columns[0];
			var numRows = pickerColumn.rowCount;
	    	for(var i = numRows-1; i >= 0; i-- ){
	        	var curRow = pickerColumn.rows[i]
	        	pickerColumn.removeRow(curRow);
	    	}
	    	picker.reloadColumn(pickerColumn);
	    } 
	};
	
	self._updatePageContent = function(_newProgramId) {
		currentProgramId = _newProgramId;
		var programData = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
		//TODO: something wrong here, programData is undefined!
		if(programData === undefined || programData[0]===undefined)
			Ti.API.info('bad time man..msgboardwin cannot find data for '+currentProgramId);
		else {
			var myUserId = acs.getUserId();
			var numFriendsCheckins = CheckinModel.checkin_fetchNumFriendsCheckinsOfProgram(programData[0].id, myUserId);
			messageboardHeader._setHeader(programData[0].name,programData[0].subname,programData[0].photo,
										programData[0].number_checkins,numFriendsCheckins,programData[0].channel_id);
			addWindow._setProgramId(_newProgramId);
		}
		CacheHelper.fetchACSDataOrCache('topicsOfProgram'+currentProgramId, TopicACS.topicACS_fetchAllTopicsOfProgramId, [currentProgramId,messageboardACSPageIndex], 'topicsDbUpdated', CACHE_TIMEOUT_SHORT);	
	};
	
	self._addGuidelineView = function() {
		if(checkinguidelineview === null)
			checkinguidelineview = new CheckinGuidelineView('messageboard');
		self.add(checkinguidelineview);
	};
	
	self._removeGuidelineView = function() {
		if(checkinguidelineview !== null) {
			self.remove(checkinguidelineview);
			checkinguidelineview = null;
		}	
	};
	
	//CALLBACK FUNCTIONS
	function topicsLoadedCompleteCallback(e) {
		//add to local db
		var isTableChanged = Topic.topicModel_updateTopicsFromACS(e.topicsOfProgram,currentProgramId); 
		if(!isTableChanged && messageboardACSPageIndex > 1) {
			hasMoreTopics = false; //insert nothing new to the table, thus, no more topics to load
			Ti.API.info('set hasMoreTopics to false');
		}
		
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
		
		//row for fetch more topics
		var fetchMoreTopicsRow = Ti.UI.createTableViewRow({
			top:0,
			height:50,
			backgroundColor: '#eeeeee',
			allowsSelection: true,
			title: L('                  Load more...'),
			color: 'gray'
		});
		viewRowsData.push(fetchMoreTopicsRow);
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
			photo: newTopic.photo,
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
	
	function numberCheckinsUpdatedCallback(e) {	
		//get the eventId of the currentProgramId
		var updatedOfProgramId = TVProgram.TVProgramModel_fetchProgramIdOfEventId(e.eventId);
		if(updatedOfProgramId !== "") {
			//Ti.API.info('eventId: '+e.eventId+' ==> programId: '+updatedOfProgramId)
			if(updatedOfProgramId === currentProgramId) {
				messageboardHeader._setNumberCheckins(e.numberCheckins);
				//Ti.API.info('updating header of '+updatedOfProgramId+', set to '+e.numberCheckins);
			}
		}
	}

	//BEGIN -- ADD EVENTLISTNERS
	addButton.addEventListener('click', function(e) {
		self.containingTab.open(addWindow);
	});

	allTopicTable.addEventListener('click', function(e){
		//check if it is the last row, if so, fetch data from the next messageboardACSPageIndex
		if(e.row.topic !== undefined) {
			var commentwin = new CommentWindow(e.row.topic.acsObjectId);			
			self.containingTab.open(commentwin);
		} else { //if click on Load More...
			if(hasMoreTopics) {
				TopicACS.topicACS_fetchAllTopicsOfProgramId([currentProgramId,messageboardACSPageIndex+1])
				messageboardACSPageIndex++; 
			} else {
				var noMoreDialog = Titanium.UI.createAlertDialog({
					title:L('Nothing more to load'),
					message:L('You have seen all the topics. Create a new one!')
				});
				noMoreDialog.show();	
			}
		}
	});		

/* //scrolling the header up...still glitches
	var animateUp_messageboardHeader = Ti.UI.createAnimation({
		top: -121,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});
	var animateDown_messageboardHeader = Ti.UI.createAnimation({
		top: 0,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});

	var animateUp_searchView = Ti.UI.createAnimation({
		top: 0,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});
	var animateDown_searchView = Ti.UI.createAnimation({
		top: 121,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});

	var animateUp_allTopicTable = Ti.UI.createAnimation({
		top: 47,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});
	var animateDown_allTopicTable = Ti.UI.createAnimation({
		top: 165,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});

	allTopicTable.addEventListener('scroll',function(e){
		if(allTopicTableY<=e.contentOffset.y && e.contentOffset.y > 100) {
			messageboardHeader.animate(animateUp_messageboardHeader);
			searchView.animate(animateUp_searchView);
			allTopicTable.animate(animateUp_allTopicTable);
			allTopicTableY = e.contentOffset.y;
		} else if(e.contentOffset.y <= 100){
			messageboardHeader.animate(animateDown_messageboardHeader);	
			searchView.animate(animateDown_searchView);
			allTopicTable.animate(animateDown_allTopicTable);
			allTopicTableY = e.contentOffset.y;
		}
	});
*/

	Ti.App.addEventListener("topicsLoadedComplete", topicsLoadedCompleteCallback);
	Ti.App.addEventListener("topicsDbUpdated", topicsDbUpdatedCallback);
	Ti.App.addEventListener("insertingTopicTableViewRow", addNewTopicTableViewRowCallback);
	Ti.App.addEventListener('topicCreatedACS', topicCreatedACSCallback);
	Ti.App.addEventListener('numberCheckinsUpdated', numberCheckinsUpdatedCallback);

	searchTextField.addEventListener('return', function(e) {
		searchTextField.blur();
	});
	
	searchTextField.addEventListener('cancel', function(e) {
		searchTextField.blur();
	});

	self.addEventListener("close", function(e) {
		Ti.API.info("closing MbMainWindow-rarely see this");
		Ti.App.removeEventListener("topicsLoadedComplete", topicsLoadedCompleteCallback);
		Ti.App.removeEventListener("topicsDbUpdated", topicsDbUpdatedCallback);
		Ti.App.removeEventListener("insertingTopicTableViewRow", addNewTopicTableViewRowCallback);
		Ti.App.removeEventListener('topicCreatedACS', topicCreatedACSCallback);
		Ti.App.removeEventListener('numberCheckinsUpdated',numberCheckinsUpdatedCallback);
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
		TopicACS.topicACS_fetchAllTopicsOfProgramId([currentProgramId,1]);
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
	CacheHelper.fetchACSDataOrCache('topicsOfProgram'+currentProgramId, TopicACS.topicACS_fetchAllTopicsOfProgramId, [currentProgramId,messageboardACSPageIndex], 'topicsDbUpdated',CACHE_TIMEOUT_SHORT);

	return self;
}
module.exports = MessageboardMainWindow;