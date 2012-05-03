var LoginWindow = function() {
	var acs = require('lib/acs');
	var Cloud = require('ti.cloud');
	Cloud.Users.showMe(function (e) {
		if (e.success) {
	        acs.setLoggedInStatus(true);
	   }
	    else {
			acs.setLoggedInStatus(false);
		}
		alert(acs.isLoggedIn());
	});
			
	var lWin = Ti.UI.createWindow({
		backgroundColor: '#333',
		top:10,
		width:'300dp',
		height:'400dp',
		borderWidth:2,
		borderRadius: 6, 
		borderColor:'#ddd',
		backgroundColor:'#999',
		layout:'vertical',
		title: 'Login'
	});
	

	/*var lwDialog = Ti.UI.createView({
		top:20,
		width:'300dp',
		height:'300dp',
		borderWidth:2,
		borderRadius: 6, 
		borderColor:'#ddd',
		backgroundColor:'#999',
		layout:'vertical'
	});*/
	
	var usernameOrEmail = Ti.UI.createTextField({
		hintText:'Username/email',
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
	lWin.add(usernameOrEmail);
	
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
	lWin.add(password);
	
	var loginButton = Ti.UI.createButton({
		title:'Login',
		top:15,
		width: 200,
		height: Ti.UI.SIZE,
		visible: true
	});
	
	function cb(status) {
		if(acs.isLoggedIn()) {
		/*
			var PlaceholderWindow = require('ui/common/PlaceholderWindow');
			var placeholderwin = new PlaceholderWindow();
			lWin.containingTab.open(placeholderwin);
		*/
		
		} else {
			alert("nope..wrong username/password");
		}
	}
	loginButton.addEventListener('click',function() {
		acs.login(usernameOrEmail.value,password.value,cb);
	});
	lWin.add(loginButton);
	
	var logoutButton = Ti.UI.createButton({
		title:'Logout',
		top:15,
		width: 200,
		height: Ti.UI.SIZE,
		visible: false
	});
	logoutButton.addEventListener('click',function() {
		acs.logout();
	});
	lWin.add(logoutButton);
	
	var signupButton = Ti.UI.createButton({
		title:'Signup',
		top:15,
		width: 200,
		height: Ti.UI.SIZE
	});
	signupButton.addEventListener('click',function() {
		//lWin.close();
		var SignupWindow = require('ui/common/SignupWindow');
		var signupwin = new SignupWindow();
		signupwin.open();
	});
	lWin.add(signupButton);
	
	var checkUserStatusButton = Ti.UI.createButton({
		title:'Check Login Status',
		top:15,
		width: 200,
		height: Ti.UI.SIZE
	});
	checkUserStatusButton.addEventListener('click',function() {
		Cloud.Users.showMe(function (e) {
		    if (e.success) {
		        var user = e.users[0];
		        alert('Success:\\n' +
		            'id: ' + user.id + '\\n' +
		            'first name: ' + user.first_name + '\\n' +
		            'last name: ' + user.last_name);
		    } else {
		        alert('Error:\\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	});
	lWin.add(checkUserStatusButton);
	
	//***************FACEBOOK STUFF
	Titanium.Facebook.appid = "197422093706392";
	Titanium.Facebook.permissions = ['publish_stream', 'read_stream'];
	//
	// Login Status
	//
	var label = Ti.UI.createLabel({
		text:'Logged In = ' + Titanium.Facebook.loggedIn,
		font:{fontSize:14},
		height:'auto',
		top:10,
		textAlign:'center'
	});
	lWin.add(label);
	
	var fbLoginButton = Ti.UI.createButton({
			title:'Login with Facebook',
			top:10,
			width:200,
			height:40,
			visible:true
		});
		
	fbLoginButton.addEventListener('click', function() {
		Ti.Facebook.authorize();
		fbLoginButton.visible = false;
		fbLogoutButton.visible = true;
		label.text = 'Logged In = ' + Titanium.Facebook.loggedIn;
	});
	lWin.add(fbLoginButton);
	
	var fbLogoutButton = Ti.UI.createButton({
			title:'Logout from Facebook',
			top:10,
			width:200,
			height:40,
			visible:false
		});
	fbLogoutButton.addEventListener('click', function() {
		Ti.Facebook.logout();
		fbLoginButton.visible = true;
		fbLogoutButton.visible = false;
		label.text = 'Logged In = ' + Titanium.Facebook.loggedIn;
	});
	lWin.add(fbLogoutButton);
	
	if(Titanium.Facebook.loggedIn) {
		fbLoginButton.visible = false;
		fbLogoutButton.visible = true;
	} else {
		fbLoginButton.visible = true;
		fbLogoutButton.visible = false;
	}
	
	if(acs.isLoggedIn()) {
		loginButton.visible = false;
		logoutButton.visible = true;
	} else {
		loginButton.visible = true;
		logoutButton.visible = false;
	}
/*	var forceButton = Ti.UI.createButton({
		title:'Force dialog: '+Titanium.Facebook.forceDialogAuth,
		top:10,
		width:160,
		height:40
	});
	forceButton.addEventListener('click', function() {
		Titanium.Facebook.forceDialogAuth = !Titanium.Facebook.forceDialogAuth;
		forceButton.title = "Force dialog: "+Titanium.Facebook.forceDialogAuth;
	});
	lWin.add(forceButton);
*/	
	function updateLoginStatus() {
		label.text = 'Logged In = ' + Titanium.Facebook.loggedIn;
	}
		
	Titanium.Facebook.addEventListener('login', function(e) {
		label.text = 'Logged In = ' + Titanium.Facebook.loggedIn;
		if (e.success) {
/*	        var PlaceholderWindow = require('ui/common/PlaceholderWindow');
			var placeholderwin = new PlaceholderWindow();
			lWin.containingTab.open(placeholderwin); */
			Cloud.Users.showMe(function (e) {
			    if (e.success) {
			        var user = e.users[0];
			        alert('Success:\\n' +
			            'id: ' + user.id + '\\n' +
			            'first name: ' + user.first_name + '\\n' +
			            'last name: ' + user.last_name);
			    } else {
			        alert('Error:\\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});
			fbLoginButton.visible = false;
			fbLogoutButton.visible = true;
	    } else if (e.error) {
	        alert(e.error);
			fbLoginButton.visible = true;
			fbLogoutButton.visible = false;
	    } else if (e.cancelled) {
	        alert("Canceled");
			fbLoginButton.visible = true;
			fbLogoutButton.visible = false;
	    }
	});
	Titanium.Facebook.addEventListener('logout', updateLoginStatus);
	
	//
	// Login Button
	//
/*	
	if(Titanium.Platform.name == 'iPhone OS'){
		lWin.add(Titanium.Facebook.createLoginButton({
			style:Ti.Facebook.BUTTON_STYLE_WIDE,
			bottom:30
		}));
	}
	else{
		lWin.add(Titanium.Facebook.createLoginButton({
			style:'wide',
			bottom:30
		}));
	}
*/
	
	return lWin;
	
};

module.exports = LoginWindow;
