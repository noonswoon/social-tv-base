function LoginTabGroup() {
    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup();
	
	var LoginFbOnlyWindow = require('ui/common/Am_LoginFbOnlyWindow');	
	var SettingWindow = require('ui/common/Am_SettingWindow');
    var BlankWindow = require('ui/common/BlankWindow');
    
    var loginwin = new LoginFbOnlyWindow();
	var blankwin = new BlankWindow();

	var loginTab = Ti.UI.createTab({
		title: 'Login',
		icon: '/images/discover.png',
		window: loginwin
	});
	loginwin.containingTab = loginTab;
	
	self.addTab(loginTab);

    //save 1-clcik, direct to message board functionality
   	self.setActiveTab(self.tabs[0]);
   	
   	//closing loginTabGroup
   	Ti.App.addEventListener('closeLoginTabGroup', function() {
   		Ti.API.info('closing loginTabGroup');
   		self.close();
   	});
    return self;
};

module.exports = LoginTabGroup;