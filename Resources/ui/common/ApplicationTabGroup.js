function ApplicationTabGroup() {
    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup({});
		
	var ChannelSelectionMainWindow = require('ui/common/Cs_ChannelSelectionMainWindow');
	var ChatMainWindow = require('ui/common/Ct_ChatMainWindow'); 
	var MessageboardMainWindow = require('ui/common/Mb_MessageboardMainWindow');
	var ProductMainWindow = require('ui/common/Pd_ProductMainWindow');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	var SettingWindow = require('ui/common/Am_SettingWindow');
    var BlankWindow = require('ui/common/BlankWindow');

    var myUserId = acs.getUserId();
	
	Ti.API.info('currentSelectedProgram: '+UserCheckinTracking.getCurrentSelectedProgram());
	Ti.API.info('setOfSelectedProgram: '+UserCheckinTracking.getCurrentCheckinPrograms()+', length: '+UserCheckinTracking.getCurrentCheckinPrograms().length);
	
	var selectionwin = new ChannelSelectionMainWindow();
	var chatwin = new ChatMainWindow(UserCheckinTracking.getCurrentSelectedProgram());
	var messageboardwin = new MessageboardMainWindow(UserCheckinTracking.getCurrentSelectedProgram());				
	var productwin = new ProductMainWindow(UserCheckinTracking.getCurrentSelectedProgram());
	var profilewin =  new ProfileMainWindow(myUserId,"me");
	var blankwin = new BlankWindow();
	
	var tabIndexToComeBack = 0;
	var selectionTab = Ti.UI.createTab({
		title: L('Discover'),
		icon: '/images/discover.png',
		window: selectionwin
	});
	selectionwin.containingTab = selectionTab;
	selectionTab.tabGroup = self; 
	
    var chatTab = Titanium.UI.createTab({  
    	title: L('Chat'),
    	icon: '/images/chat-2.png',
     	window: chatwin
	});
    chatwin.containingTab = chatTab;
  
    var messageboardTab = Titanium.UI.createTab({
    	title: L('Board'),
    	icon: '/images/messageboard.png',
    	window: messageboardwin
    });
    messageboardwin.containingTab = messageboardTab;

	var productTab = Ti.UI.createTab({
		title: L('Product'),
		icon: '/images/product.png',
		window: productwin
	});
	productwin.containingTab = productTab;
	
	var profileTab = Ti.UI.createTab({
		title: L('Me'),
		icon: '/images/me.png',
		window: profilewin
 	});
	profilewin.containingTab = profileTab;

	self.addTab(selectionTab);
    self.addTab(chatTab);  
    self.addTab(messageboardTab);  
    self.addTab(productTab);
    self.addTab(profileTab);

	//reset app badge number
	Ti.UI.iPhone.appBadge = null;
	
    //save 1-clcik, direct to message board functionality
   	self.setActiveTab(self.tabs[0]);
	self.open();
	
	//PROFILE: CALLING ACS
	var CheckinModel = require('model/checkin');
	var FriendModel = require('model/friend');
	var PointModel = require('model/point');
	
	var FriendACS = require('acs/friendsACS');
	var LeaderACS = require('acs/leaderBoardACS');
	
	FriendACS.friendsACS_searchFriend(myUserId);
	FriendACS.friendACS_fetchedUserTotalFriends(myUserId);
 	
	
 	var leaderBoardLoadedCallBack = function(e) {
		PointModel.pointModel_updateLeadersFromACS(e.fetchedLeader);
	};
	Ti.App.addEventListener('leaderBoardLoaded',leaderBoardLoadedCallBack);	

	var friendsDbUpdatedCallBack = function() {
		var rankList = [];
		rankList[0] = myUserId;
		var myFriends = FriendModel.friendModel_fetchFriend(rankList[0]);
		for(var i = 0; i< myFriends.length;i++) {
			var curUser = myFriends[i].friend_id;
			rankList.push(curUser);
		}
		LeaderACS.leaderACS_fetchedRank(rankList);
	};
	Ti.App.addEventListener('friendsDbUpdated',friendsDbUpdatedCallBack);
		
 	var friendLoadedCallBack = function(e){
		FriendModel.friendModel_updateFriendsFromACS(e.fetchedFriends);
	};
	Ti.App.addEventListener('friendsLoaded',friendLoadedCallBack);
	
	var levelLoadedCallBack = function(e) {					
		var LevelModel = require('model/level');
		LevelModel.levelModel_updateLevelFromACS(e.fetchedLevel);
	};
	Ti.App.addEventListener('levelLoaded',levelLoadedCallBack);
	
	var updateContentInAllModules = function(_targetedProgramId) {
		chatwin._updatePageContent(_targetedProgramId);
		messageboardwin._updatePageContent(_targetedProgramId);
		productwin._updatePageContent(_targetedProgramId);
	};
	
	var addGuidelineWindowInAllModules = function() {
		chatwin._addGuidelineView();
		messageboardwin._addGuidelineView();	
		productwin._addGuidelineView();	
	};
	
	var removeGuidelineWindowInAllModules = function() {
		chatwin._removeGuidelineView();
		messageboardwin._removeGuidelineView();
		productwin._removeGuidelineView();
	};
	
	var initializePickerInAllModules = function() {
		messageboardwin._initializePicker();
		productwin._initializePicker();
	};
	
	var addNewPickerRowInAllModules = function(newCheckinProgramId, newCheckinProgramName) {
		messageboardwin._addNewPickerData(newCheckinProgramId,newCheckinProgramName);			
		productwin._addNewPickerData(newCheckinProgramId,newCheckinProgramName);
	};
	
	var clearPickerDataInAllModules = function() {
		productwin._removeAllPickerData();
		messageboardwin._removeAllPickerData();
	};
	
	function checkinLoadedCompleteCallBack(e) {
		CheckinModel.checkinModel_updateCheckinsFromACS(e.fetchedCheckin,myUserId);
	}
	Ti.App.addEventListener('checkinLoadedComplete',checkinLoadedCompleteCallBack);
	
	function checkinDbLoadedCallBack(e) {			
		var TVProgramModel = require('model/tvprogram');

		//populate the current checkins of user
		var eventsCheckedIn = CheckinModel.checkin_fetchCheckinToday(myUserId);
		//if checkin to at least 1 program, enable the chat/board/product bar
		
		var todayCheckinPrograms = [];
		for(var i=0 ;i<eventsCheckedIn.length;i++) {
			var eventId = eventsCheckedIn[i].event_id;
			var programId = TVProgramModel.TVProgramModel_fetchProgramIdOfEventId(eventId);
			Ti.API.info('from checkinDbLoadedCallback ACS..eventId: ' + eventId + ', programId: ' + programId);
			if(programId !== "") todayCheckinPrograms.push(programId);
		}
		//reset currentSelectedProgram, currentCheckinPrograms when loadedup data from ACS
		Ti.API.info('get a chance to reset currentSelectedProgram');
		UserCheckinTracking.setCurrentSelectedProgram('');
		UserCheckinTracking.setCurrentCheckinPrograms(todayCheckinPrograms);
		
		//first load, and the user already checkin in some program
		
		if(todayCheckinPrograms.length > 0) { 
			//handle rare situation, when user checkin and deleted the app halfway, then reinstall it again on the same day
			UserCheckinTracking.setCurrentSelectedProgram(todayCheckinPrograms[0]);
			removeGuidelineWindowInAllModules();
			
			//this will cause number_checkins to be null since checkinDbLoaded delete old checkin data and 
			//insert new ones (the new ones will have the column number_checkins set to null initially)
			//number_checkins column will get populated again by the fn TVProgramModel_updateCheckins
			updateContentInAllModules(UserCheckinTracking.getCurrentSelectedProgram()); 
			initializePickerInAllModules();
		} else {
			addGuidelineWindowInAllModules();
			clearPickerDataInAllModules();
		}
	}	
	Ti.App.addEventListener('checkinDbLoaded',checkinDbLoadedCallBack);

	
	function updateHeaderCheckinCallback() {
		var CheckinACS = require('acs/checkinACS');
		CheckinACS.checkinACS_fetchUserTotalCheckIns(myUserId);
	}
	Ti.App.addEventListener('updateHeaderCheckin',updateHeaderCheckinCallback);
	
	var checkinToProgramCallback = function(e) {
		var checkinProgramId = e.checkinProgramId; 
		var checkinProgramName = e.checkinProgramName;
		var currentCheckinPrograms = UserCheckinTracking.getCurrentCheckinPrograms();
		currentCheckinPrograms.push(checkinProgramId);
		UserCheckinTracking.setCurrentCheckinPrograms(currentCheckinPrograms);
			
		if(productwin._getNumRowsInPicker() === 0 || messageboardwin._getNumRowsInPicker() === 0) { //picker hasn't loaded yet
			removeGuidelineWindowInAllModules();
			updateContentInAllModules(checkinProgramId);
			
			UserCheckinTracking.setCurrentSelectedProgram(checkinProgramId); //after comparison, assign new value to UserCheckinTracking.currentSelectedProgram
			initializePickerInAllModules();
		} else { //already have at least 1 checkin and picker is already loaded, load the picker automatically, add new item to picker
			UserCheckinTracking.setCurrentSelectedProgram(checkinProgramId);
			updateContentInAllModules(checkinProgramId);
			addNewPickerRowInAllModules(checkinProgramId,checkinProgramName);
		}
	};
	Ti.App.addEventListener('checkinToProgram',checkinToProgramCallback);
	
	var changingCurrentSelectedProgramCallback = function(e) {
		var newSelectedProgram = e.newSelectedProgram; 
		UserCheckinTracking.setCurrentSelectedProgram(newSelectedProgram);
		
		////update program content
		updateContentInAllModules(newSelectedProgram);

		//update picker
		messageboardwin._updateSelectedPicker(newSelectedProgram);
		productwin._updateSelectedPicker(newSelectedProgram);		
	};
	Ti.App.addEventListener('changingCurrentSelectedProgram', changingCurrentSelectedProgramCallback);
	
	var testingPlaygroundCallback = function(e) {
		var TVProgramACS = require('acs/tvprogramACS');
		TVProgramACS.tvprogramACS_fetchProgramsShowingNow();
		TVProgramACS.tvprogramACS_fetchProgramsFromChannel('ch3');
	};
	Ti.App.addEventListener('testingPlayground', testingPlaygroundCallback);
	
	var resumeCallback = function() {
		Ti.API.info('resume from ApplicationGroup');	
		//when app resumes, need to do the following: 
		//0. check internet connectivity
		//1. set appBadge to zero if there is some notification
		//2. update time-related stuff, scroll time index on popular page, is the checking in 
		// behavior still work correctly?, popular page shows correctly?
		//3. check if the user checkin data has already expired (if the day already passed)
		//4. check if we need to load new tvprogram (if it is a new day)
		
		//0.
		if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
			var connectivityWarningDialog = Titanium.UI.createAlertDialog({
				title:'No Internet Connection',
				message:L('Please come online and join the Chatterbox experience.')
			});
			connectivityWarningDialog.show();
			nointernetwin = new NoInternetWindow();
			nointernetwin.open();
		} else {
			//if the no connectivity window present, remove it from the view
			if(nointernetwin !== null) {
				nointernetwin.close();
				nointernetwin = null;
				Ti.API.info('closing no internet window: ApplicationTabGroup');
			}
			setTimeout(function() {
				FbAutoPostACS.fbAutoPostACS_AutoPostValue();
			}, 3000);	
		}
		
		//1.
		Ti.UI.iPhone.appBadge = null;
		var startOfToday = moment().sod().format("YYYY-MM-DDTHH:mm:ss");
		
		//3.
		var lastCheckinTime = UserCheckinTracking.getLatestCheckinTime();
		if(lastCheckinTime < startOfToday) { //checkin already expired
			Ti.API.info('checkin already expired!');
			UserCheckinTracking.setCurrentSelectedProgram('');
			UserCheckinTracking.setCurrentCheckinPrograms([]);
			clearPickerDataInAllModules();
			addGuidelineWindowInAllModules();
		}
		
		//4.
		var CacheHelper = require('helpers/cacheHelper');
		var timeLastFetchedTVProgramACS = CacheHelper.getTimeLastFetchedTVProgramACS();
		
		if(timeLastFetchedTVProgramACS < startOfToday) {
			//need to reload all tvprogram data
			var TVProgramACS = require('acs/tvprogramACS');
			TVProgramACS.tvprogramACS_fetchProgramsShowingNow();
			CacheHelper.setTimeLastFetchedTVProgramACS();
		} else { //if still using the same tvprogram data, reset the popular tvprogram data by calling 'showDiscoveryPage' event
			Ti.API.info('updating data in popular tab...')
			Ti.App.fireEvent('showDiscoveryPage');
		}
		FriendACS.friendsACS_searchFriend(myUserId);
		FriendACS.friendACS_fetchedUserTotalFriends(myUserId);
	};
	Ti.App.addEventListener('resume', resumeCallback);
	
   	function closeApplicationTabGroupCallback() {
   		Ti.API.info('closing applicationTabGroup');
   		Ti.App.removeEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
   		Ti.App.removeEventListener('levelLoaded',levelLoadedCallBack);
   		Ti.App.removeEventListener('updateHeaderCheckin',updateHeaderCheckinCallback);
   		Ti.App.removeEventListener('checkinToProgram',checkinToProgramCallback);
   		Ti.App.removeEventListener('changingOfCurrentSelectedProgram', changingCurrentSelectedProgramCallback);
   		Ti.App.removeEventListener('resume',resumeCallback);
   		Ti.App.removeEventListener('closeApplicationTabGroup',closeApplicationTabGroupCallback);
   		self.close();
   	}
  	Ti.App.addEventListener('closeApplicationTabGroup', closeApplicationTabGroupCallback);

    return self;
};

module.exports = ApplicationTabGroup;