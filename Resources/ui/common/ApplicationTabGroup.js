
function ApplicationTabGroup() {

    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup();

    var LoginWindow = require('ui/common/LoginWindow');
	var MessageboardMainWindow = require('ui/common/Ct_ChatMainWindow');//require('ui/common/Mb_MessageboardMainWindow');
	
	var ChatMainWindow = require('ui/common/Ct_ChatMainWindow'); 
	var ProductMainWindow = require('ui/common/Pd_ProductMainWindow');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	var ChannelSelectionMainWindow = require('ui/common/Cs_ChannelSelectionMainWindow');	
	
	var chatwin = new ChatMainWindow();

	var messageboardwin =   new ChatMainWindow();//new MessageboardMainWindow(1);		
    var loginwin =  new LoginWindow();
	var productwin =  new ChatMainWindow();//new ProductMainWindow();
	var profilewin =  new ProfileMainWindow();
	var selectionMainWin =  new ChatMainWindow();//new ChannelSelectionMainWindow();

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
	
	var selectionTab = Ti.UI.createTab({
		title: 'Selection',
		icon: '/images/tv.png',
		window: selectionMainWin
	});
	selectionMainWin.containingTab = selectionTab;
	
    //self.addTab(chatTab);  
    self.addTab(messageboardTab);  
    self.addTab(selectionTab);
    self.addTab(profileTab);
   	self.addTab(loginTab);
    //self.addTab(productTab);
    
    //save 1-clcik, direct to message board functionality
   	self.setActiveTab(self.tabs[1]);
		//coming to this page, should already loggin
	
	//checking the current login and setup the currentLoggedIn user to query anywhere
	Cloud.Users.showMe(function (e) {        
		if (e.success) {
			acs.setUserLoggedIn(e.users[0]);
			acs.setLoggedInStatus(true);
	    } else {
   			self.setActiveTab(self.tabs[3]);
   		}
    });
   
    return self;
};

module.exports = ApplicationTabGroup;