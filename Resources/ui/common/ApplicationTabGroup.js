function ApplicationTabGroup() {
    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup();

	var ChannelSelectionMainWindow = require('ui/common/Cs_ChannelSelectionMainWindow');
	var ChatMainWindow = require('ui/common/Ct_ChatMainWindow'); 
	var MessageboardMainWindow = require('ui/common/Mb_MessageboardMainWindow');
	var ProductMainWindow = require('ui/common/Pd_ProductMainWindow');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	var SettingWindow = require('ui/common/Am_SettingWindow');
    
	var selectionMainWin = new SettingWindow();//new ChannelSelectionMainWindow();
	var chatwin = new ChatMainWindow();
	var messageboardwin =  new MessageboardMainWindow(1);		
	var productwin = new SettingWindow();//new ProductMainWindow();
	var profilewin =  new SettingWindow();//new ProfileMainWindow();

	var selectionTab = Ti.UI.createTab({
		title: 'Selection',
		icon: '/images/tv.png',
		window: selectionMainWin
	});
	selectionMainWin.containingTab = selectionTab;
	
    var chatTab = Titanium.UI.createTab({  
        icon:'/images/icon/Chat-Bubble.png',
        title:'Chat',
        window:chatwin
    });
    chatwin.containingTab = chatTab;
    var messageboardTab = Titanium.UI.createTab({  
        icon:'/images/captured.png',
        title:'Board',
        window:messageboardwin
    });
    messageboardwin.containingTab = messageboardTab;
	
	var productTab = Ti.UI.createTab({
		icon: '/images/captured.png',
		title: 'Product',
		window: productwin
	});
	productwin.containingTab = productTab;
	
	var profileTab = Ti.UI.createTab({
		icon: '/images/fugitives.png',
		title: 'Profile',
		window: profilewin
 	});
	profilewin.containingTab = profileTab;
	
	self.addTab(selectionTab);
    self.addTab(chatTab);  
    self.addTab(messageboardTab);  
    self.addTab(productTab);
    self.addTab(profileTab);
    //save 1-clcik, direct to message board functionality
   	self.setActiveTab(self.tabs[2]);
    return self;
};

module.exports = ApplicationTabGroup;