var SettingWindow = function(_containingTab) {

	//UI STUFF
	var SettingWindowAccount = require('ui/common/Am_SettingWindowAccount');
	var SettingWindowSocialsharing = require('ui/common/Am_SettingWindowSocialsharing');
	var SettingWindowNotification = require('ui/common/Am_SettingWindowNotification');
	
	var setting = [
	{title:'Account Setting', hasChild:true},
	{title:'Social Sharing', hasChild:true},
	{title:'Notifications', hasChild:true}
	]
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/back_button.png',
        width:57,height:34
	});

	var self = Ti.UI.createWindow({
		backgroundImage: '/images/admin/cb_back.png',
		barImage: 'images/NavBG.png',
		title: "Setting",
		leftNavButton: backButton
	});
	self.containingTab = _containingTab;
	
	backButton.addEventListener('click', function(){
   		self.close();
	});
	
	// create table view
	var settingTableView = Ti.UI.createTableView({
		data: setting,
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'transparent',
		rowBackgroundColor:'white',
		scrollable:false
	});

	var text = [];
	
	var fbLogoutButtonTableViewRow = Ti.UI.createTableViewRow({
		height: 40
	});
	
	var fbLogoutButtonLabel = Ti.UI.createLabel({
		text: 'Logout',
		font:{fontWeight:'bold',fontSize:16}
	});
	fbLogoutButtonTableViewRow.add(fbLogoutButtonLabel);
	
	var fbLogoutButton = Ti.UI.createTableView({
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'transparent',
		rowBackgroundColor:'white',
		scrollable:false,
		top: 160,
		separatorColor: 'white'
	});
	
	text.push(fbLogoutButtonTableViewRow);
	fbLogoutButton.setData(text);
	self.add(settingTableView);
	self.add(fbLogoutButton);
	
	//Get UserID
	var userInfo = acs.getUserLoggedIn();
	Ti.API.info(userInfo);
	
	
	// create table view event listener
	settingTableView.addEventListener('click', function(e){
		if(e.index === 0){
			var account = new SettingWindowAccount();
			self.containingTab.open(account);
		}
		else if(e.index === 1){
			var social = new SettingWindowSocialsharing();
			self.containingTab.open(social);			
		}
		else if(e.index === 2){
			var notification = new SettingWindowNotification();
			self.containingTab.open(notification);			
		}
	});


	
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

