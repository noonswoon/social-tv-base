var SettingWindow = function() {
	
	//UI STUFF
	var win = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Setting",
		barColor: '#6d0a0c',
		layout: 'vertical'
	});
		
	var fbLogoutButton = Ti.UI.createButton({
		title:'Logout',
		top:5,
		width:200,
		height:40,
		visible:true
	});
	
	//ADDING UI COMPONENTS TO WINDOW
	win.add(fbLogoutButton);
	
	
	//CALLBACK FUNCTIONS	
	function logoutCallback(event) {
		if(event.success) {
			Ti.API.info("successfully logged out");
			//TODO: future-->close the tabgroup before openning login window
			
			//go to login page
			var LoginFbOnlyWindow = require('ui/common/Am_LoginFbOnlyWindow');	
			var loginwin = new LoginFbOnlyWindow();
			loginwin.open();   
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

