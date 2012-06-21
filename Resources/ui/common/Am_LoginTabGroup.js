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
   	function closeLoginTabGroupCallback() {
   		Ti.API.info('closing loginTabGroup');
   		Ti.App.removeEventListener('closeLoginTabGroup', closeLoginTabGroupCallback);
   		self.close();
   	}
   	
   	Ti.App.addEventListener('closeLoginTabGroup',closeLoginTabGroupCallback);
   	
   	self.addEventListener('close', function() {
   		//remove event listener of facebook login
   		//alert('Am_LoginTabGroup.js -> removeEventListener: Fb login');
   		//Ti.include('helpers/facebookAuthenListeners.js'); //fb authen functionality	
   		Ti.Facebook.removeEventListener("login",facebookAuthenCallback);
   	});
    return self;
};

module.exports = LoginTabGroup;