var SignupWindow = function() {
	var acs = require('lib/acs');
	
	var suWin = Ti.UI.createWindow({
		backgroundColor: '#333',
		top:50,
		width:'300dp',
		height:'450dp',
		borderWidth:2,
		borderRadius: 6, 
		borderColor:'#ddd',
		backgroundColor:'#999',
		layout:'vertical',
		title: 'Signup'
		
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
	suWin.add(email);

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
	suWin.add(username);
	
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
	suWin.add(password);
	
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
	suWin.add(confirm);
	
	var signupButton = Ti.UI.createButton({
		title:'Signup',
		top:15,
		width: 200,
		height: Ti.UI.SIZE
	});
	
	function cb() {
		if(acs.isLoggedIn()===true) {
			alert("successfully signup.")
		} else {
			alert('something wrong during signup process');
		}
	}
	
	signupButton.addEventListener('click',function() {
		if(password.value === confirm.value)
			acs.createUser(email.value,username.value,password.value,Ti.Platform.macaddress,cb);
		else alert("Passwords do not match. Try again.");
	});
	suWin.add(signupButton);

	var loginButton = Ti.UI.createButton({
		title:'Login',
		top:15,
		width: 200,
		height: Ti.UI.SIZE
	});
	loginButton.addEventListener('click',function() {
		suWin.close();
		LoginWindow = require('ui/common/LoginWindow');
		var loginwin = new LoginWindow();
		loginwin.open();
	});
	suWin.add(loginButton);
	
	return suWin;
	
};

module.exports = SignupWindow;