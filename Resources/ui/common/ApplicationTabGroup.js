function ApplicationTabGroup() {
    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup();

	var ChannelSelectionMainWindow = require('ui/common/Cs_ChannelSelectionMainWindow');
	var ChatMainWindow = require('ui/common/Ct_ChatMainWindow'); 
	var MessageboardMainWindow = require('ui/common/Mb_MessageboardMainWindow');
	var ProductMainWindow = require('ui/common/Pd_ProductMainWindow');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	
	var SettingWindow = require('ui/common/Am_SettingWindow');
    var BlankWindow = require('ui/common/BlankWindow');
    
    var areTabsDiabled = true;
 	var myUserId = acs.getUserId();
	   
	var programDummy = {
		programId: '4fb3618c0020442a2b0186c0', 
		programTitle:'Khun Suuk', 
		programSubname:'Fighting!',
		programImage: 'dummy.png',
		programChannel: 'C3',
		programNumCheckin: 25345
	};
	
	var selectionwin = new ChannelSelectionMainWindow();
	var chatwin = new ChatMainWindow(programDummy);
	var messageboardwin = new MessageboardMainWindow(7);		
	var productwin = new ProductMainWindow();
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
	selectionTab.addEventListener('focus', function() {
		tabIndexToComeBack = 0;	 //for redirecting when chat window is close
	});
	
    var chatTab = Titanium.UI.createTab({  
        icon: '/images/chat-2.png',
		title: 'Chat',
		window: blankwin,
		touchEnabled: false
    });
    chatwin.containingTab = chatTab;
    chatTab.addEventListener('focus', function() {
    	chatwin.containingTab.open(chatwin);
    });
   
    chatwin.addEventListener('close', function() {
    	self.setActiveTab(self.tabs[tabIndexToComeBack]);
    });
    
    var messageboardTab = Titanium.UI.createTab({  
        icon:'/images/messageboard.png',
        title:'Board',
        window: messageboardwin,
		touchEnabled: false
    });
    messageboardwin.containingTab = messageboardTab;
    messageboardTab.addEventListener('focus', function() {
		tabIndexToComeBack = 2;
	});
	
	var productTab = Ti.UI.createTab({
		icon: '/images/product.png',
		title: 'Product',
		window: productwin,
	});
	productwin.containingTab = productTab;
	productTab.addEventListener('focus', function() {
		tabIndexToComeBack = 3;	
	});
	
	var profileTab = Ti.UI.createTab({
		icon: '/images/me.png',
		title: 'Me',
		window: profilewin
 	});
	profilewin.containingTab = profileTab;
	profileTab.addEventListener('focus', function() {
		tabIndexToComeBack = 4;
	});
	
	var disableTabsView = Titanium.UI.createView({
	    backgroundColor: '#ffff',
	    opacity: 0.2,
	    height: 49,
	    width:'60%',
	    bottom:0,
	    left:'20%'
	});
	
	var checkinAlert = Titanium.UI.createAlertDialog({
	    title:'Please checkin',
	    message:'Please checkin to a program first.'
	});

	disableTabsView.addEventListener('click', function(e){
   		checkinAlert.show();
	});
	
	//////////////////////
	self.add(disableTabsView);
	self.addTab(selectionTab);
    self.addTab(chatTab);  
    self.addTab(messageboardTab);  
    self.addTab(productTab);
    self.addTab(profileTab);

    //save 1-clcik, direct to message board functionality
   	self.setActiveTab(self.tabs[0]);
   	
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
		if(eventsCheckedIn.length > 0)  {
			self.remove(disableTabsView);
			areTabsDiabled = false;
		}

		for(var i=0 ;i<eventsCheckedIn.length;i++) {
			var eventId = eventsCheckedIn[i].event_id; 
			var programId = TVProgramModel.TVProgramModel_fetchProgramIdOfEventId(eventId);
			myCurrentCheckinPrograms.push(programId);
		}
		Ti.API.info('myCurrentCheckinPrograms: '+JSON.stringify(myCurrentCheckinPrograms));
	}
	
	Ti.App.addEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
	
	function updateHeaderCheckinCallback() {
		CheckinACS.checkinACS_fetchedUserTotalCheckIns(myUserId);
	}
	
	Ti.App.addEventListener('updateHeaderCheckin',updateHeaderCheckinCallback);
	
	//checkinToProgram event fires from Cs_CheckinMainWindow
	function checkinToProgramCallback() {
		if(areTabsDiabled) {
   			self.remove(disableTabsView);
			areTabsDiabled = false;	
   		}
	}
	
   	Ti.App.addEventListener('checkinToProgram', checkinToProgramCallback);
   	
   	function closeApplicationTabGroupCallback() {
   		Ti.API.info('closing applicationTabGroup');
   		Ti.App.removeEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
   		Ti.App.removeEventListener('levelLoaded',levelLoadedCallBack);
   		Ti.App.removeEventListener('updateHeaderCheckin',updateHeaderCheckinCallback);
   		Ti.App.removeEventListener('checkinToProgram', checkinToProgramCallback);
   		Ti.App.removeEventListener('closeApplicationTabGroup',closeApplicationTabGroupCallback);
   		self.close();
   	}
   	
   	Ti.App.addEventListener('closeApplicationTabGroup', closeApplicationTabGroupCallback);
   	
    return self;
};

module.exports = ApplicationTabGroup;