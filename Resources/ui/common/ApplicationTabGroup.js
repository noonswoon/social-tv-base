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
	
	var selectionwin =new ChannelSelectionMainWindow();
	var chatwin = new SettingWindow(); //ChatMainWindow(programDummy);
	var messageboardwin =  new MessageboardMainWindow(1);		
	var productwin = new ProductMainWindow();
	var profilewin = new ProfileMainWindow();

	var tabIndexToComeBack = 0;
	var selectionTab = Ti.UI.createTab({
		title: 'Selection',
		icon: '/images/tv.png',
		window: selectionwin
	});
	selectionwin.containingTab = selectionTab;
	selectionTab.addEventListener('focus', function() {
		tabIndexToComeBack = 0;	 //for redirecting when chat window is close
		productwin._closeProductPopupWindow();
	});
	
    var chatTab = Titanium.UI.createTab({  
        icon: '/images/fugitives.png',
		title: 'Chat',
		//window: NO WINDOW FOR CHAT
    });
    chatwin.containingTab = chatTab;
    chatTab.addEventListener('focus', function() {
    	chatwin.containingTab.open(chatwin);
		productwin._closeProductPopupWindow();
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
		productwin._closeProductPopupWindow();
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
		productwin._closeProductPopupWindow();
	});
	
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