function ApplicationTabGroup() {
    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup({
    	backgroundColor: '#fff',
    	
    });
	Ti.include('lib/customTabBar.js');
		
	var ChannelSelectionMainWindow = require('ui/common/Cs_ChannelSelectionMainWindow');
	var ChatMainWindow = require('ui/common/Ct_ChatMainWindow'); 
	var MessageboardMainWindow = require('ui/common/Mb_MessageboardMainWindow');
	var ProductMainWindow = require('ui/common/Pd_ProductMainWindow');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	var SettingWindow = require('ui/common/Am_SettingWindow');
    var BlankWindow = require('ui/common/BlankWindow');
    
    var myUserId = acs.getUserId();
	
	var selectionwin = new ChannelSelectionMainWindow({height:426, tabBarHidden: true});
	var chatwin = new ChatMainWindow(myCurrentSelectedProgram,{height:426, tabBarHidden: true});
	var messageboardwin = new MessageboardMainWindow(myCurrentSelectedProgram,{height:426, tabBarHidden: true});				
	var productwin = new ProductMainWindow(myCurrentSelectedProgram,{height:426, tabBarHidden: true});
	var profilewin =  new ProfileMainWindow(myUserId,"me",{height:426, tabBarHidden: true});
	var blankwin = new BlankWindow();
	
	var tabIndexToComeBack = 0;
	var selectionTab = Ti.UI.createTab({
		window: selectionwin
	});
	selectionwin.containingTab = selectionTab;
	selectionTab.tabGroup = self; 
	
    var chatTab = Titanium.UI.createTab({  
     	window: chatwin,
	});
    chatwin.containingTab = chatTab;
   
    var messageboardTab = Titanium.UI.createTab({  
        window: messageboardwin,
    });
    messageboardwin.containingTab = messageboardTab;
	
	var productTab = Ti.UI.createTab({
		window: productwin,
	});
	productwin.containingTab = productTab;
	
	var profileTab = Ti.UI.createTab({
		window: profilewin
 	});
	profilewin.containingTab = profileTab;
	
	//////////////////////
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
	
	var myCustomTabBar = new CustomTabBar({
		tabBar: self,
		imagePath: 'images/tabgroup/',
		width: 64,
		height: 54,
		items: [
			{ image: 'discover.png', selected: 'discover_over.png' },
			{ image: 'chat.png', selected: 'chat_over.png' },
			{ image: 'board.png', selected: 'board_over.png' },
			{ image: 'shop.png', selected: 'shop_over.png' },
			{ image: 'me.png', selected: 'me_over.png' }
		]
	});
	myCustomTabBar.show();
   	
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
	
	function checkinDbLoadedCallBack(e){			
		CheckinModel.checkinModel_updateCheckinsFromACS(e.fetchedCheckin);
		//populate the current checkins of user
		var eventsCheckedIn = CheckinModel.checkin_fetchCheckinToday();
		//if checkin to at least 1 program, enable the chat/board/product bar
		
		for(var i=0 ;i<eventsCheckedIn.length;i++) {
			var eventId = eventsCheckedIn[i].event_id;
			var programId = TVProgramModel.TVProgramModel_fetchProgramIdOfEventId(eventId);
			myCurrentCheckinPrograms.push(programId);
		}
		
		//first load, and the user already checkin in some program
		if(myCurrentSelectedProgram === '' && myCurrentCheckinPrograms.length > 0) {
			myCurrentSelectedProgram = myCurrentCheckinPrograms[0];
			//chatwin = new ChatMainWindow(myCurrentSelectedProgram,{height:426, tabBarHidden: true});			
			//chatwin.containingTab = chatTab;
			//alert('calling _removeGuidelineWindow: AppTabGroup ln 122: currentSelectedProgram: '+myCurrentSelectedProgram);
			messageboardwin._removeGuidelineWindow(myCurrentSelectedProgram);
			productwin._removeGuidelineWindow(myCurrentSelectedProgram);
			
			messageboardwin._updatePageContent(myCurrentSelectedProgram);
			productwin._updatePageContent(myCurrentSelectedProgram);
			
			messageboardwin._initializePicker();
			productwin._initializePicker();
		}
	}	
	Ti.App.addEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
	
	function updateHeaderCheckinCallback() {
		CheckinACS.checkinACS_fetchedUserTotalCheckIns(myUserId);
	}
	Ti.App.addEventListener('updateHeaderCheckin',updateHeaderCheckinCallback);
	
	var checkinToProgramCallbackInAppTabGroup = function(e) {
		var checkinProgramId = e.checkinProgramId; 
		var checkinProgramName = e.checkinProgramName;
		myCurrentCheckinPrograms.push(checkinProgramId);
		if(myCurrentSelectedProgram === '') { //haven't checkin before, picker hasn't loaded yet
			
			//chatwin = new ChatMainWindow(myCurrentSelectedProgram,{height:426, tabBarHidden: true});
			messageboardwin._removeGuidelineWindow(checkinProgramId);
			productwin._removeGuidelineWindow(checkinProgramId);
			
			messageboardwin._updatePageContent(checkinProgramId);
			productwin._updatePageContent(checkinProgramId);
			
			myCurrentSelectedProgram = checkinProgramId; //after comparison, assign new value to myCurrentSelectedProgram
			messageboardwin._initializePicker();
			productwin._initializePicker();
		} else { //already have at least 1 checkin and picker is already loaded, load the picker automatically, add new item to picker
			myCurrentSelectedProgram = checkinProgramId;

			messageboardwin._updatePageContent(checkinProgramId);
			productwin._updatePageContent(checkinProgramId);
			
			messageboardwin._addNewPickerData(checkinProgramId,checkinProgramName);			
			productwin._addNewPickerData(checkinProgramId,checkinProgramName);
		}
	};
	Ti.App.addEventListener('checkinToProgram',checkinToProgramCallbackInAppTabGroup);
	
	var changingCurrentSelectedProgramCallback = function(e) {
		var newSelectedProgram = e.newSelectedProgram; 
		myCurrentSelectedProgram = newSelectedProgram;
		
		////update program content
		messageboardwin._updatePageContent(newSelectedProgram);
		productwin._updatePageContent(newSelectedProgram);

		//update picker
		messageboardwin._updateSelectedPicker(newSelectedProgram);
		productwin._updateSelectedPicker(newSelectedProgram);		
	};
	Ti.App.addEventListener('changingCurrentSelectedProgram', changingCurrentSelectedProgramCallback);
	
   	function closeApplicationTabGroupCallback() {
   		Ti.API.info('closing applicationTabGroup');
   		Ti.App.removeEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
   		Ti.App.removeEventListener('levelLoaded',levelLoadedCallBack);
   		Ti.App.removeEventListener('updateHeaderCheckin',updateHeaderCheckinCallback);
   		Ti.App.removeEventListener('checkinToProgram',checkinToProgramCallbackInAppTabGroup);
   		Ti.App.removeEventListener('changingOfCurrentSelectedProgram', changingCurrentSelectedProgramCallback);
   		Ti.App.removeEventListener('closeApplicationTabGroup',closeApplicationTabGroupCallback);
   		self.close();
   	}
  	Ti.App.addEventListener('closeApplicationTabGroup', closeApplicationTabGroupCallback);
   	   	
    return self;
};

module.exports = ApplicationTabGroup;