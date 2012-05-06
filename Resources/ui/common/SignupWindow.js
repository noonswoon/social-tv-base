var SignupWindow = function(_containingTab) {
	//UI STUFF
	var suWin = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Signup",
		barColor: '#6d0a0c',
		layout: 'vertical'
	});

	var email = Ti.UI.createTextField({
		hintText:'Email',
		autocorrect:false,
		autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		top:5,
		width:'90%',
		height:40,
		font: {
			fontWeight: 'normal',
			fontSize: '17'
		},
		textAlign: 'center',
		color:'#333',
		backgroundColor: '#ddd',
		borderRadius:3,
		paddingLeft:2, 
		paddingRight:2
	});

	var username = Ti.UI.createTextField({
		hintText:'Username',
		autocorrect:false,
		autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		top:5,
		width:'90%',
		height:40,
		font: {
			fontWeight: 'normal',
			fontSize: '17'
		},
		textAlign: 'center',
		color:'#333',
		backgroundColor: '#ddd',
		borderRadius:3,
		paddingLeft:2, 
		paddingRight:2
	});
	
	var password = Ti.UI.createTextField({
		hintText:'Password',
		passwordMask:true,
		autocorrect:false,
		autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		top:5,
		width:'90%',
		height:40,
		font: {
			fontWeight: 'normal',
			fontSize: '17'
		},
		textAlign: 'center',
		color:'#333',
		backgroundColor: '#ddd',
		borderRadius:3,
		paddingLeft:2, 
		paddingRight:2
	});
	
	var confirm = Ti.UI.createTextField({
		hintText:'Confirm Password',
		passwordMask:true,
		autocorrect:false,
		autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		top:5,
		width:'90%',
		height:40,
		font: {
			fontWeight: 'normal',
			fontSize: '17'
		},
		textAlign: 'center',
		color:'#333',
		backgroundColor: '#ddd',
		borderRadius:3,
		paddingLeft:2, 
		paddingRight:2
	});
	
	var signupButton = Ti.UI.createButton({
		title:'Signup',
		top:15,
		width: 200,
		height: Ti.UI.SIZE
	});
	
	var fbConnectButton = Ti.UI.createButton({
		title:'Connect with Facebook',
		top:5,
		width:200,
		height:20,
		visible:true
	});

	//ADDING UI COMPONENTS TO WINDOW
	suWin.add(email);
	suWin.add(username);
	suWin.add(password);
	suWin.add(confirm);
	suWin.add(signupButton);
	suWin.add(fbConnectButton);
	
	//CALLBACK FUNCTIONS
	function cb() {
		if(acs.isLoggedIn()===true) {
			alert("successfully signup.")
		} else {
			alert('something wrong during signup process');
		}
	}
		
	//EVENTS REGISTERING	
	signupButton.addEventListener('click',function() {
		if(password.value === confirm.value)
			acs.createUser(email.value,username.value,password.value,Ti.Platform.macaddress,cb);
		else alert("Passwords do not match. Try again.");
	});
	
	fbConnectButton.addEventListener('click', function() {
		if(Ti.Facebook.loggedIn) {
			Ti.Facebook.logout(); //logout from fb
		}
		Ti.Facebook.authorize();
	});
	
	Ti.include('helpers/facebookAuthenListeners.js'); //fb authen functionality
	Ti.Facebook.addEventListener('login', function(e) {
		if (e.success) {
			alert('SignupWindow.js FB login event cb');
			var PlaceholderWindow = require('ui/common/PlaceholderWindow');
			var placeholderwin = new PlaceholderWindow();
			_containingTab.open(placeholderwin);
		}
	});
	
	return suWin;	
};

module.exports = SignupWindow;