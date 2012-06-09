var SettingWindow = function() {
	
	//UI STUFF
	var win = Ti.UI.createWindow({
		backgroundColor:'#ccc',
		backgroundImage: '/images/admin/cb_back.png',
		//backgroundImage: '/images/admin/splashscreen_logOut.png',
		title: "Setting",
		barColor: '#398bb0',
		layout: 'vertical'
	});
		
	var fbLogoutButton = Ti.UI.createButton({
		backgroundImage: '/images/admin/button/button_logout.png',
		top:5,
		width:200,
		height:35,
		visible:true
	});
	
	//ADDING UI COMPONENTS TO WINDOW
	win.add(fbLogoutButton);
	
	//CALLBACK FUNCTIONS	
	function logoutCallback(event) {
		if(event.success) {
			Ti.API.info("successfully logged out");
			//TODO: future-->close the tabgroup before openning login window
			
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
	
	return win;
};

module.exports = SettingWindow;

