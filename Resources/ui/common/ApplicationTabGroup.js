function ApplicationTabGroup() {
    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup();

	var ChannelSelectionMainWindow = require('ui/common/Cs_ChannelSelectionMainWindow');
	var ChatMainWindow = require('ui/common/Ct_ChatMainWindow'); 
	var MessageboardMainWindow = require('ui/common/Mb_MessageboardMainWindow');
	var ProductMainWindow = require('ui/common/Pd_ProductMainWindow');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	var SettingWindow = require('ui/common/Am_SettingWindow');
    	
	var programDummy = {
		programId: '4fb3618c0020442a2b0186c0', 
		programTitle:'Khun Suuk', 
		programSubname:'Fighting!',
		programImage: 'dummy.png',
		programChannel: 'C3',
		programNumCheckin: 25345
	};
	
	var myUserId = acs.getUserId();
// 	
	// var checkStatus = function(myUserId,profileId){
		// var status = "stranger";
		// if(myUserId===profileId) status = "me"
			// else if(FriendModel.friendModel_findMyFriend(myUserId,profileId)) status = "friend"
			// return status;
	// };
	
	var selectionwin = new ChannelSelectionMainWindow();//SettingWindow(); //ChannelSelectionMainWindow();
	var chatwin = new SettingWindow(); //ChatMainWindow(programDummy);
	var messageboardwin = new SettingWindow(); //MessageboardMainWindow(1);		
	var productwin = new SettingWindow(); //ProductMainWindow();
	var profilewin =  new ProfileMainWindow(myUserId,"me");

	var tabIndexToComeBack = 0;
	var selectionTab = Ti.UI.createTab({
		title: 'Selection',
		icon: '/images/tv.png',
		window: selectionwin
	});
	selectionwin.containingTab = selectionTab;
	selectionTab.addEventListener('focus', function() {
		tabIndexToComeBack = 0;	 //for redirecting when chat window is close
	});
	
    var chatTab = Titanium.UI.createTab({  
        icon: '/images/fugitives.png',
		title: 'Chat',
		//window: NO WINDOW FOR CHAT
    });
    chatwin.containingTab = chatTab;
    chatTab.addEventListener('focus', function() {
    	 chatwin.containingTab.open(chatwin);
    });
   
    chatwin.addEventListener('close', function() {
    	self.setActiveTab(self.tabs[tabIndexToComeBack]);
    });
    
    var messageboardTab = Titanium.UI.createTab({  
        icon:'/images/captured.png',
        title:'Board',
        window: messageboardwin
    });
    messageboardwin.containingTab = messageboardTab;
    messageboardTab.addEventListener('focus', function() {
		tabIndexToComeBack = 2;
	});
	
	var productTab = Ti.UI.createTab({
		icon: '/images/captured.png',
		title: 'Product',
		window: productwin
	});
	productwin.containingTab = productTab;
	productTab.addEventListener('focus', function() {
		tabIndexToComeBack = 3;	
	});
	
	var profileTab = Ti.UI.createTab({
		icon: '/images/fugitives.png',
		title: 'Profile',
		window: profilewin
 	});
	profilewin.containingTab = profileTab;
	profileTab.addEventListener('focus', function() {
		tabIndexToComeBack = 4;	
	});
	
	//PROFILE: CALLING ACS
	var LevelACS = require('acs/levelACS');	
	var BadgesACS = require('acs/badgesACS');
	var FriendACS = require('acs/friendsACS');
	var CheckinACS = require('acs/checkinACS');	
//	var LeaderACS = require('acs/leaderBoardACS');	
	var LevelModel = require('model/level');
//	var FriendModel = require('model/friend');
	var CheckinModel = require('model/checkin');
//	var PointModel = require('model/point');	
	
	//not frequently update
	LevelACS.levelACS_fetchedLevel();
	//TODO: think about where to put this statement; 
	//load badge image data	
		BadgesACS.fetchedBadges();
		
	//my user ACS
	CheckinACS.checkinACS_fetchedUserCheckIn(myUserId);
	FriendACS.showFriendsRequest();	
	FriendACS.searchFriend(myUserId);
	FriendACS.friendACS_fetchedUserTotalFriends(myUserId);

	
	function levelLoadedCallBack(e){					
		LevelModel.levelModel_updateLevelFromACS(e.fetchedLevel);
	};
	Ti.App.addEventListener('levelLoaded',levelLoadedCallBack);
	function checkinDbLoadedCallBack(e){			
		CheckinModel.checkinModel_updateCheckinsFromACS(e.fetchedCheckin);
	};
	Ti.App.addEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
	Ti.App.addEventListener('updateHeaderCheckin',function(){
		CheckinACS.checkinACS_fetchedUserTotalCheckIns(myUserId);
	});

	//////////////////////
	self.addTab(selectionTab);
    self.addTab(chatTab);  
    self.addTab(messageboardTab);  
    self.addTab(productTab);
    self.addTab(profileTab);

    //save 1-clcik, direct to message board functionality
   	self.setActiveTab(self.tabs[0]);

    return self;
};

module.exports = ApplicationTabGroup;