function ApplicationTabGroup() {
    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup({
    	backgroundColor: '#fff',
    });
		
	var ChannelSelectionMainWindow = require('ui/common/Cs_ChannelSelectionMainWindow');
	var ChatMainWindow = require('ui/common/Ct_ChatMainWindow'); 
	var MessageboardMainWindow = require('ui/common/Mb_MessageboardMainWindow');
	var ProductMainWindow = require('ui/common/Pd_ProductMainWindow');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	var SettingWindow = require('ui/common/Am_SettingWindow');
    var BlankWindow = require('ui/common/BlankWindow');
        
	Ti.include('lib/customTabBar.js');
    
    var myUserId = acs.getUserId();
	
	var updateCustomTabBar = function(_tab) {
		myCustomTabBar.back(_tab);
	}
	
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
	selectionTab.addEventListener('focus',function(){
		tabIndexToComeBack = 0;	 //for redirecting when chat window is close
		updateCustomTabBar(tabIndexToComeBack);
	});
		
    var chatTab = Titanium.UI.createTab({  
     	window: chatwin,
	});
    chatwin.containingTab = chatTab;
	chatTab.addEventListener('focus',function(){
		tabIndexToComeBack = 1;	 //for redirecting when chat window is close
		updateCustomTabBar(tabIndexToComeBack);
	});   
   
    var messageboardTab = Titanium.UI.createTab({  
        window: messageboardwin,
    });
    messageboardwin.containingTab = messageboardTab;
	messageboardTab.addEventListener('focus',function(){
		tabIndexToComeBack = 2;	 //for redirecting when chat window is close
		updateCustomTabBar(tabIndexToComeBack);
	});
	
	var productTab = Ti.UI.createTab({
		window: productwin,
	});
	productwin.containingTab = productTab;
	productTab.addEventListener('focus',function(){
		tabIndexToComeBack = 3;	 //for redirecting when chat window is close
		updateCustomTabBar(tabIndexToComeBack);
	});
	
	var profileTab = Ti.UI.createTab({
		window: profilewin
 	});
	profilewin.containingTab = profileTab;
	profileTab.addEventListener('focus',function(){
		tabIndexToComeBack = 4;	 //for redirecting when chat window is close
		updateCustomTabBar(tabIndexToComeBack);
	});
	
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
	
	function checkinDbLoadedCallBack(e) {			
		CheckinModel.checkinModel_updateCheckinsFromACS(e.fetchedCheckin);
		//populate the current checkins of user
		var eventsCheckedIn = CheckinModel.checkin_fetchCheckinToday();
		//if checkin to at least 1 program, enable the chat/board/product bar
		
		for(var i=0 ;i<eventsCheckedIn.length;i++) {
			var eventId = eventsCheckedIn[i].event_id; 
			var programId = TVProgramModel.TVProgramModel_fetchProgramIdOfEventId(eventId);
			myCurrentCheckinPrograms.push(programId);
		}
		
		if(myCurrentSelectedProgram === '' && myCurrentCheckinPrograms.length >= 0) {
			myCurrentSelectedProgram = myCurrentCheckinPrograms[0];
			chatwin = new ChatMainWindow(myCurrentSelectedProgram,{height:426, tabBarHidden: true});			
			chatwin.containingTab = chatTab;
//			messageboardwin._removeGuidelineWindow();
//			productwin._removeGuidelineWindow();
			Ti.App.fireEvent('myCurrentCheckinProgramsReady');	//fire event to update chatroom in ChatMainWindow
		}
		Ti.API.info('myCurrentCheckinPrograms: '+JSON.stringify(myCurrentCheckinPrograms));
	}	
	Ti.App.addEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
	
	function updateHeaderCheckinCallback() {
		CheckinACS.checkinACS_fetchedUserTotalCheckIns(myUserId);
	}
	Ti.App.addEventListener('updateHeaderCheckin',updateHeaderCheckinCallback);
	
   	function closeApplicationTabGroupCallback() {
   		Ti.API.info('closing applicationTabGroup');
   		Ti.App.removeEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
   		Ti.App.removeEventListener('levelLoaded',levelLoadedCallBack);
   		Ti.App.removeEventListener('updateHeaderCheckin',updateHeaderCheckinCallback);
   		Ti.App.removeEventListener('closeApplicationTabGroup',closeApplicationTabGroupCallback);
   		self.close();
   	}
  	Ti.App.addEventListener('closeApplicationTabGroup', closeApplicationTabGroupCallback);
   	
   	var checkinToProgramCallbackInAppTabGroup = function(e) {
		var checkinProgramId = e.checkinProgramId; 
		var checkinProgramName = e.checkinProgramName;
		myCurrentSelectedProgram = checkinProgramId;
		myCurrentCheckinPrograms.push(checkinProgramId);
		if(!myCurrentCheckinPrograms.length) {
			chatwin._createChatMainWindowView();
		};
		if(myCurrentSelectedProgram === '') {
			chatwin = new ChatMainWindow(myCurrentSelectedProgram,{height:426, tabBarHidden: true});
			messageboardwin._removeGuidelineWindow();
			productwin._removeGuidelineWindow();
			alert('productwin-should remove guidelinewindow');
		}
	};
	Ti.App.addEventListener('checkinToProgram',checkinToProgramCallbackInAppTabGroup);
    return self;
};

module.exports = ApplicationTabGroup;