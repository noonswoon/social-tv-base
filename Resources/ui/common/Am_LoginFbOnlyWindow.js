var LoginFbOnlyWindow = function() {
		
	//UI STUFF
	var lWin = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/admin/cb_back.png',
		title: "Login",
		barColor: '#398bb0',
		layout: 'vertical'
	});
	var cbLogo = Ti.UI.createImageView({
		image: '/images/admin/chatterbox_logo_2@.png',
		top: 100,
		height: 57,
		width: 174
	});	
	var cbLabel = Ti.UI.createLabel({
		text: 'Changing the way you watch TV',
		top: 5,
		height: 30,
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#8b8b8b'
	});
	var fbLoginButton = Ti.UI.createButton({
		top: 5,
		width: 200,
		height: 35,
		backgroundImage: '/images/admin/button/fb_button_login.png',
		visible: true
	});	
	
	var fbLoginStatuslbl = Ti.UI.createLabel({
		text:'We will not auto-post to your account.',
		color: '#fff',
		font:{fontSize:13, },//fontWeight: 'bold'},
		height:'auto',
		top: 170,
		textAlign:'center'
	});
	
	var whyFbBtn = Ti.UI.createButton({
		backgroundImage: '/images/admin/button/button_whyfb.png',
		top:7,
		width:145,
		height:25,
		visible:true
	});
	
	
	//ADDING UI COMPONENTS TO WINDOW
	lWin.add(cbLogo);
	lWin.add(cbLabel);
	lWin.add(fbLoginButton);
	lWin.add(fbLoginStatuslbl);
	lWin.add(whyFbBtn);
	
	//EVENTS REGISTERING		
	fbLoginButton.addEventListener('click', function() {
		Ti.Facebook.authorize();
	});
	
	whyFbBtn.addEventListener('click', function() {
		var PlaceholderWindow = require('ui/common/PlaceholderWindow');
		var placeholderwin = new PlaceholderWindow();
		placeholderwin.open({modal:true});
	});
			
	Ti.include('helpers/facebookAuthenListeners.js'); //fb authen functionality		
	Ti.Facebook.addEventListener('login', facebookAuthenCallback); //facebookAuthenCallback def is in helpers/facebookAuthenListeners.js
	
	lWin.addEventListener('blur', function() {
		Ti.Facebook.removeEventListener('login',facebookAuthenCallback);
	});
	return lWin;
};

module.exports = LoginFbOnlyWindow;

