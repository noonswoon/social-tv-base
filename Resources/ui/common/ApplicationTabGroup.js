
function ApplicationTabGroup() {

    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup();

    var LoginWindow = require('ui/common/LoginWindow');
	var MessageboardMainWindow = require('ui/common/Mb_MessageboardMainWindow');
	
	var ChatMainWindow = require('ui/common/Ct_ChatMainWindow'); 
	var ProductMainWindow = require('ui/common/Pd_ProductMainWindow');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	
	var chatwin = new ChatMainWindow();
	var messageboardwin = new MessageboardMainWindow(1);		
    var loginwin = new LoginWindow();
	var productwin = new ProductMainWindow();
	var profilewin = new ProfileMainWindow();

    var chatTab = Titanium.UI.createTab({  
        icon:'/images/fugitives.png',
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

	var loginTab = Ti.UI.createTab({
		icon: '/images/fugitives.png',
		title: 'Login',
		window: loginwin
	});
	loginwin.containingTab = loginTab;
	
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
	
    self.addTab(chatTab);  
    self.addTab(messageboardTab);  
    self.addTab(loginTab);
    self.addTab(productTab);
    self.addTab(profileTab);
   
    //save 1-clcik, direct to message board functionality
   	self.setActiveTab(self.tabs[1]);


    // open tab group
    return self;
};

module.exports = ApplicationTabGroup;