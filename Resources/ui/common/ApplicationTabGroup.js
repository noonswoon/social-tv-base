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
    
    var myUserId = acs.getUserId();
    
	var programPublic = {
		programId: 'CTB_PUBLIC', 
		programName:'Public', 
		programSubname:'',
		programImage: 'http://a0.twimg.com/profile_images/2208934390/Screen_Shot_2012-05-11_at_3.43.35_PM.png',
		programChannel: 'CTB',
		programNumCheckin: 25345
	};
	
	var selectionwin = new ChannelSelectionMainWindow({height:426, tabBarHidden: true});
	var chatwin = new ChatMainWindow(myCurrentSelectedProgram,{height:426, tabBarHidden: true});
	var messageboardwin = new MessageboardMainWindow(myCurrentSelectedProgram,{height:426, tabBarHidden: true});				
	var productwin = new ProductMainWindow(myCurrentSelectedProgram,{height:426, tabBarHidden: true});
	var profilewin =  new ProfileMainWindow(myUserId,"me",{height:426, tabBarHidden: true});
	var blankwin = new BlankWindow();

	   	
   	var updateCustomTabBar = function(_tab) {
   		myCustomTabBar.back(_tab);
   	}
	
	var tabIndexToComeBack = 0;
	var selectionTab = Ti.UI.createTab({
	//	title: 'Discover',
	//	icon: '/images/discover.png',
		window: selectionwin
	});
	selectionwin.containingTab = selectionTab;
	selectionTab.tabGroup = self; 
	selectionTab.addEventListener('focus', function() {
		tabIndexToComeBack = 0;	 //for redirecting when chat window is close
		updateCustomTabBar(tabIndexToComeBack);
	});
	
    var chatTab = Titanium.UI.createTab({  
      // icon: '/images/chat-2.png',
		// title: 'Chat',
		window: blankwin,
		touchEnabled: false
    });
    chatwin.containingTab = chatTab;
    chatTab.addEventListener('focus', function() {
    	chatwin.containingTab.open(chatwin);
    	myCustomTabBar.hide();
    });
   
    chatwin.addEventListener('close', function() {
    	self.setActiveTab(self.tabs[tabIndexToComeBack]);
    	myCustomTabBar.back(tabIndexToComeBack);
    	myCustomTabBar.show();
    });
    
    var messageboardTab = Titanium.UI.createTab({  
       // icon:'/images/messageboard.png',
      //  title:'Board',
        window: messageboardwin,
    });
    messageboardwin.containingTab = messageboardTab;
    messageboardTab.addEventListener('focus', function() {
		tabIndexToComeBack = 2;
		updateCustomTabBar(tabIndexToComeBack);
	});
	
	var productTab = Ti.UI.createTab({
	//	icon: '/images/product.png',
	//	title: 'Product',
		window: productwin,
	});
	productwin.containingTab = productTab;
	productTab.addEventListener('focus', function() {
		tabIndexToComeBack = 3;	
		updateCustomTabBar(tabIndexToComeBack);
	});
	
	var profileTab = Ti.UI.createTab({
	//	icon: '/images/me.png',
	//	title: 'Me',
		window: profilewin
 	});
	profilewin.containingTab = profileTab;
	profileTab.addEventListener('focus', function() {
		tabIndexToComeBack = 4;
		updateCustomTabBar(tabIndexToComeBack);
	});
	
	//////////////////////
	self.addTab(selectionTab);
    self.addTab(chatTab);  
    self.addTab(messageboardTab);  
    self.addTab(productTab);
    self.addTab(profileTab);

    //save 1-clcik, direct to message board functionality
   	self.setActiveTab(self.tabs[0]);

	self.open();
	
	Ti.include('lib/customTabBar.js');
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
   	
    return self;
};

module.exports = ApplicationTabGroup;