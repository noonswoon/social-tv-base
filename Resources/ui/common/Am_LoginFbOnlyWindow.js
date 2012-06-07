var LoginFbOnlyWindow = function() {
		
	//UI STUFF
	var lWin = Ti.UI.createWindow({
		backgroundColor:'white',
		title: "Login",
		barColor: '#6d0a0c',
		layout: 'vertical'
	});
		
	var fbLoginButton = Ti.UI.createButton({
		top:5,
		width:200,
		height:40,
		visible:true,
		backgroundImage: 'images/loginbutton.png'
	});
	
	var fbLoginStatuslbl = Ti.UI.createLabel({
		text:'We will not auto-post to your account. ',
		font:{fontSize:14},
		height:'auto',
		top:10,
		textAlign:'center'
	});
	
	var whyFbBtn = Ti.UI.createButton({
		title:'Why Facebook?',
		top:5,
		width:200,
		height:40,
		visible:true
	});
	
	
	//ADDING UI COMPONENTS TO WINDOW
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

