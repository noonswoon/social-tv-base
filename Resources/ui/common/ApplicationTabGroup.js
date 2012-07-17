function ApplicationTabGroup() {
    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup({
    });
		
	var ChannelSelectionMainWindow = require('ui/common/Cs_ChannelSelectionMainWindow');
	var ChatMainWindow = require('ui/common/Ct_ChatMainWindow'); 
	var MessageboardMainWindow = require('ui/common/Mb_MessageboardMainWindow');
	var ProductMainWindow = require('ui/common/Pd_ProductMainWindow');
//	var ProductMainWindow = require('ui/common/Am_NoInternetConnect');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	var SettingWindow = require('ui/common/Am_SettingWindow');
    var BlankWindow = require('ui/common/BlankWindow');

    var myUserId = acs.getUserId();
	
	Ti.API.info('setOfSelectedProgram: '+UserCheckinTracking.getCurrentSelectedProgram());
	Ti.API.info('currentSelectedProgram: '+UserCheckinTracking.getCurrentCheckinPrograms());
	
	var selectionwin = new ChannelSelectionMainWindow();
	var chatwin = new ChatMainWindow(UserCheckinTracking.getCurrentSelectedProgram());
	var messageboardwin = new MessageboardMainWindow(UserCheckinTracking.getCurrentSelectedProgram());				
	var productwin = new ProductMainWindow(UserCheckinTracking.getCurrentSelectedProgram());
	var profilewin =  new ProfileMainWindow(myUserId,"me");
	var blankwin = new BlankWindow();
	
	var tabIndexToComeBack = 0;
	var selectionTab = Ti.UI.createTab({
		title: 'Discover',
		icon: '/images/discover.png',
		window: selectionwin
	});
	selectionwin.containingTab = selectionTab;
	selectionTab.tabGroup = self; 
	
    var chatTab = Titanium.UI.createTab({  
    	title: 'Chat',
    	icon: '/images/chat-2.png',
     	window: chatwin
	});
    chatwin.containingTab = chatTab;
  
    var messageboardTab = Titanium.UI.createTab({
    	title: 'Board',
    	icon: '/images/messageboard.png',
    	window: messageboardwin
    });
    messageboardwin.containingTab = messageboardTab;

	var productTab = Ti.UI.createTab({
		title: 'Product',
		icon: '/images/product.png',
		window: productwin
	});
	productwin.containingTab = productTab;
	
	var profileTab = Ti.UI.createTab({
		title: 'Me',
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
	var LevelACS = require('acs/levelACS');	
	var BadgesACS = require('acs/badgesACS');
	var FriendACS = require('acs/friendsACS');
	var CheckinACS = require('acs/checkinACS');	
	var LevelModel = require('model/level');
	var CheckinModel = require('model/checkin');
	var TVProgramModel = require('model/tvprogram');
	//not frequently update
	LevelACS.levelACS_fetchedLevel();
	BadgesACS.fetchedBadges();
	//my user ACS
	
	CheckinACS.checkinACS_fetchedUserCheckIn(myUserId);
	//debug why is it not showing on device
	FriendACS.showFriendsRequest();	
	FriendACS.searchFriend(myUserId);
	FriendACS.friendACS_fetchedUserTotalFriends(myUserId);
 	
	function levelLoadedCallBack(e) {					
		LevelModel.levelModel_updateLevelFromACS(e.fetchedLevel);
	}
	Ti.App.addEventListener('levelLoaded',levelLoadedCallBack);
	
	var updateContentInAllModules = function(_targetedProgramId) {
		chatwin._updatePageContent(_targetedProgramId);
		messageboardwin._updatePageContent(_targetedProgramId);
		productwin._updatePageContent(_targetedProgramId);
	};
	
	var addGuidelineWindowInAllModules = function() {
		chatwin._addGuidelineWindow();
		messageboardwin._addGuidelineWindow();	
		productwin._addGuidelineWindow();	
	};
	
	var removeGuidelineWindowInAllModules = function() {
		chatwin._removeGuidelineWindow();
		messageboardwin._removeGuidelineWindow();
		productwin._removeGuidelineWindow();
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
		messageboardwin._removeAllPickerData();	
		productwin._removeAllPickerData();
	};
	
	function checkinDbLoadedCallBack(e) {			
		CheckinModel.checkinModel_updateCheckinsFromACS(e.fetchedCheckin);
		//populate the current checkins of user
		var eventsCheckedIn = CheckinModel.checkin_fetchCheckinToday(myUserId);
		//if checkin to at least 1 program, enable the chat/board/product bar
		
		var todayCheckinPrograms = [];
		for(var i=0 ;i<eventsCheckedIn.length;i++) {
			var eventId = eventsCheckedIn[i].event_id;
			var programId = TVProgramModel.TVProgramModel_fetchProgramIdOfEventId(eventId);
			todayCheckinPrograms.push(programId);
		}
		//reset currentCheckinPrograms when loadedup data from ACS
		UserCheckinTracking.setCurrentCheckinPrograms(todayCheckinPrograms);
		
		//first load, and the user already checkin in some program
		
		if(UserCheckinTracking.getCurrentSelectedProgram() === '' && todayCheckinPrograms.length > 0) { 
			//handle rare situation, when user checkin and deleted the app halfway, then reinstall it again on the same day
			UserCheckinTracking.setCurrentSelectedProgram(todayCheckinPrograms[0]);
			removeGuidelineWindowInAllModules();
			updateContentInAllModules(UserCheckinTracking.getCurrentSelectedProgram());
			initializePickerInAllModules();
		}
	}	
	Ti.App.addEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
	
	function updateHeaderCheckinCallback() {
		CheckinACS.checkinACS_fetchedUserTotalCheckIns(myUserId);
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
		Ti.API.info('productwin:numRowsInPicker: '+productwin._getNumRowsInPicker()); 
		Ti.API.info('messageboardwin:numRowsInPicker: '+messageboardwin._getNumRowsInPicker()); 
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
				message:'Please come online and join the Chatterbox experience.'
			});
			connectivityWarningDialog.show();
			
			//TODO: add no connectivity window that block everything
		} else {
			//if the no connectivity window present, remove it from the view
		}
		
		//1.
		Ti.UI.iPhone.appBadge = null;
		var startOfToday = moment().sod().format("YYYY-MM-DDTHH:mm:ss");
		
		//3.
		var lastCheckinTime = UserCheckinTracking.getLatestCheckinTime();
		if(lastCheckinTime < startOfToday) { //checkin already expired
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
			TVProgramACS.tvprogramACS_fetchAllProgramShowingToday();
			CacheHelper.setTimeLastFetchedTVProgramACS();
		} else { //if still using the same tvprogram data, reset the popular tvprogram data by calling 'showDiscoveryPage' event
			Ti.API.info('updating data in popular tab...')
			Ti.App.fireEvent('showDiscoveryPage');
		}
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