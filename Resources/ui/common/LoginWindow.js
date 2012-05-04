var LoginWindow = function() {
	var acs = require('lib/acs');
	var Cloud = require('ti.cloud');
	Titanium.Facebook.appid = "197422093706392";
	Titanium.Facebook.permissions = ['publish_stream', 'read_stream', 'email'];
		
	//UI STUFF
	var lWin = Ti.UI.createWindow({
		backgroundColor: 'transparent',
		top:10,
		width:'300dp',
		height:'450dp',
		borderWidth:2,
		borderRadius: 6, 
		borderColor:'#ddd',
		backgroundColor:'#999',
		layout:'vertical',
		title: 'Login'
	});
	
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

	var loginButton = Ti.UI.createButton({
		title:'Login',
		top:5,
		width: 200,
		height: Ti.UI.SIZE,
		visible: true
	});	
	
	var logoutButton = Ti.UI.createButton({
		title:'Logout',
		top:5,
		width: 200,
		height: Ti.UI.SIZE,
		visible: false
	});
	
	var checkUserStatusButton = Ti.UI.createButton({
		title:'Check Login Status',
		top:5,
		width: 200,
		height: Ti.UI.SIZE
	});
	
	var fbLoginButton = Ti.UI.createButton({
		title:'Login using Facebook',
		top:5,
		width:200,
		height:20,
		visible:true
	});
	
	var fbLogoutButton = Ti.UI.createButton({
			title:'Logout from Chatterbox/Fb',
			top:5,
			width:200,
			height:20,
			visible:true
	});
	
	var fbLoginStatuslbl = Ti.UI.createLabel({
		text:'Fb Logged In = ' + Titanium.Facebook.loggedIn,
		font:{fontSize:14},
		height:'auto',
		top:10,
		textAlign:'center'
	});
	
	var nextPageBtn = Ti.UI.createButton({
		title:'Next page',
		top:5,
		width:200,
		height:20,
		visible:true
	});
	
	
	//ADDING UI COMPONENTS TO WINDOW
	lWin.add(usernameOrEmail);
	lWin.add(password);
	lWin.add(loginButton);
	lWin.add(logoutButton);
	lWin.add(checkUserStatusButton);
	lWin.add(fbLoginButton);
	lWin.add(fbLogoutButton);
	lWin.add(fbLoginStatuslbl);
	lWin.add(nextPageBtn);
	
	//CALLBACK FUNCTIONS
	function cb(status) {
		if(acs.isLoggedIn()) {
			var PlaceholderWindow = require('ui/common/PlaceholderWindow');
			var placeholderwin = new PlaceholderWindow();
			lWin.containingTab.open(placeholderwin);
			Ti.API.info("successfully logged in");
			loginButton.visible = false;
			logoutButton.visible = true;
		} else {
			alert("nope..wrong username/password");
		}
	}
	
	function logoutCallback(event) {
		if(event.success) {
			Ti.API.info("successfully logged out");
			loginButton.visible = true;
			logoutButton.visible = false;
		} else {
			Ti.API.info("something wrong with logout mechanism");
		}
	}
	
	//EVENTS REGISTERING
	loginButton.addEventListener('click',function() {
		acs.login(usernameOrEmail.value,password.value,cb);
	});
	
	logoutButton.addEventListener('click',function() {
		acs.logout(logoutCallback);
	});
	
	checkUserStatusButton.addEventListener('click',function() {
		Cloud.Users.showMe(function (e) {
		    if (e.success) {
		        var user = e.users[0];
		        Ti.API.info('currently logged in: ' +
		            'id: ' + user.id + ',FN: ' + user.first_name + 'LN: ' + user.last_name);
		    } else {
		        Ti.API.info('Error: ' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	});
	
	fbLoginButton.addEventListener('click', function() {
		Ti.Facebook.authorize();
	});
	
	fbLogoutButton.addEventListener('click', function() {
		Ti.Facebook.logout(); //logout from fb
		acs.logout(logoutCallback); //logout from chatterbox
		fbLoginButton.visible = true;
		fbLogoutButton.visible = false;
	});
	
	nextPageBtn.addEventListener('click', function() {
		var PlaceholderWindow = require('ui/common/PlaceholderWindow');
		var placeholderwin = new PlaceholderWindow();
		lWin.containingTab.open(placeholderwin);
	});
	
	Titanium.Facebook.addEventListener('login', function(e) {
		fbLoginStatuslbl.text = 'Logged In = ' + Titanium.Facebook.loggedIn;
		if (e.success) {
	        var PlaceholderWindow = require('ui/common/PlaceholderWindow');
			var placeholderwin = new PlaceholderWindow();
			lWin.containingTab.open(placeholderwin); 
			fbLoginStatuslbl.text = 'Fb Logged In = ' + Titanium.Facebook.loggedIn;
			fbLoginButton.visible = false;
			fbLogoutButton.visible = true;
			
			//CREATING/LOGGIN IN TO CHATTERBOX VIA THIRD-PARTY METHOD
			Cloud.SocialIntegrations.externalAccountLogin({
	    		type: 'facebook',
	    		token: Ti.Facebook.accessToken
			}, function (e) {
			    if (e.success) {
			    	fbLoginButton.visible = false;
					fbLogoutButton.visible = true;
			        
			        //GETTING EMAIL ADDRESS
					Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
					    if (e.success) {
					    	var fbGraphObj = JSON.parse(e.result)
					        var email = fbGraphObj.email;
					        var username = fbGraphObj.username;
					        //UPDATING THE ACCOUNT WITH EMAIL PROVIDED BY FB GRAPH API
					        Cloud.Users.update({
									username: username,
						    		email: email
						    	} , function (e) {
							    if (e.success) {
							        var user = e.users[0];
							        Ti.API.info('Success:\\n' +
							            'id: ' + user.id + '\\n' +
							            'first name: ' + user.first_name + '\\n' +
							            'last name: ' + user.last_name);
							    } else {
							        Ti.API.info('UPDATE Error:\\n' +
							            ((e.error && e.message) || JSON.stringify(e)));
							    }
							});
					    } else if (e.error) {
					        Ti.API.info(e.error);
					    } else {
					        Ti.API.info('Unknown response');
					    }
					});
			    } else {
			        Ti.API.info('Error:\\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});
	    } else if (e.error) {
	        Ti.API.info("fb login error: "+e.error);
			fbLoginButton.visible = true;
			fbLogoutButton.visible = false;
	    } else if (e.cancelled) {
	        Ti.API.info("fb login Canceled");
			fbLoginButton.visible = true;
			fbLogoutButton.visible = false;
	    }
	});
	
	Titanium.Facebook.addEventListener('logout', function() {
		fbLoginStatuslbl.text = 'Fb Logged In = ' + Titanium.Facebook.loggedIn;
		fbLoginButton.visible = true;
		fbLogoutButton.visible = false;
	});
	
	//MISCELLENOUS
		
	Cloud.Users.showMe(function (e) {
		if (e.success) {
			Ti.API.info("currently logged in");
	        acs.setLoggedInStatus(true);
	        loginButton.visible = false;
			logoutButton.visible = true;
	   }
	    else {
			Ti.API.info("currently NOT logged in");
			acs.setLoggedInStatus(false);
			loginButton.visible = true;
			logoutButton.visible = false;
		}
	});
	
	if(Titanium.Facebook.loggedIn) {
		fbLoginButton.visible = false;
		fbLogoutButton.visible = true;
	} else {
		fbLoginButton.visible = true;
		fbLogoutButton.visible = false;
	}
	
	return lWin;
	
};

module.exports = LoginWindow;
