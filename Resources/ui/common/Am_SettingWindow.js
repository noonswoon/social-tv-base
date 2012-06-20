var SettingWindow = function() {
	
	//UI STUFF
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/Backbutton.png',
        width:57,height:34
	});

	var self = Ti.UI.createWindow({
		backgroundImage: '/images/admin/cb_back.png',
		barImage: 'images/NavBG.png',
		title: "Setting",
		leftNavButton: backButton
	});
	
	backButton.addEventListener('click', function(){
   		self.close();
	});
	
	var switchView = Ti.UI.createView({
		backgroundImage: 'images/switchBG.png',
		top: 160,
		width: 270,
		height: 98
	});
	
	var pushSwitch = Ti.UI.createSwitch({
		value: true,
		top: 10,
		right: 10,
	});
	switchView.add(pushSwitch);
	
	var shareSwitch = Ti.UI.createSwitch({
		value: true,
		top: 60,
		right: 10,
	});
	switchView.add(shareSwitch);
	
	var saveButton = Ti.UI.createButton({
		backgroundImage: '/images/buttonBG.png',
		title: 'Save Changes',
		bottom:50,
		width:228,
		height:41,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'}
	});
		
	var fbLogoutButton = Ti.UI.createButton({
		backgroundImage: '/images/buttonBG.png',
		title: 'Log out',
		bottom:10,
		width:228,
		height:41,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'}
	});
	
	//ADDING UI COMPONENTS TO WINDOW
	self.add(switchView);
	self.add(fbLogoutButton);
	self.add(saveButton);

	
	//CALLBACK FUNCTIONS	
	function logoutCallback(event) {
		if(event.success) {
			Ti.API.info("successfully logged out");
			//TODO: future-->close the tabgroup before openning login selfdow
			
			Ti.App.fireEvent('closeApplicationTabGroup'); //done with login, close the tabgroup
			//go to login page
			var LoginTabGroup = require('ui/common/Am_LoginTabGroup');
			var logintabgroup = new LoginTabGroup();
			logintabgroup.open(); 
		} else {
			Ti.API.info("something wrong with logout mechanism");
		}
	}
	
	//EVENTS REGISTERING		
	fbLogoutButton.addEventListener('click', function() {
		Ti.Facebook.logout(); //logout from fb
		acs.logout(logoutCallback); //logout from chatterbox
	});
	
	return self;
};

module.exports = SettingWindow;

