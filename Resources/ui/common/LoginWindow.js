var LoginWindow = function() {
		
	//UI STUFF
	var lWin = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Login",
		barColor: '#6d0a0c',
		layout: 'vertical'
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
		borderRadius:3
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

	var loginOrOutButton = Ti.UI.createButton({
		title:'Login',
		top:5,
		width: 200,
		height: Ti.UI.SIZE,
		visible: true
	});	
	
	var signupButton = Ti.UI.createButton({
		title:'Signup',
		top:5,
		width: 200,
		height: Ti.UI.SIZE,
		visible: true
	});	
	
	var checkUserStatusButton = Ti.UI.createButton({
		title:'Check Login Status',
		top:5,
		width: 200,
		height: Ti.UI.SIZE
	});
	
	var fbLoginOrOutButton = Ti.UI.createButton({
		title:'fb_login',
		top:5,
		width:200,
		height:20,
		visible:true
	});
	
	var fbLoginStatuslbl = Ti.UI.createLabel({
		text:'Fb Logged In = ' + Ti.Facebook.loggedIn,
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
	lWin.add(loginOrOutButton);
	lWin.add(signupButton);
	lWin.add(checkUserStatusButton);
	lWin.add(fbLoginOrOutButton);
	lWin.add(fbLoginStatuslbl);
	lWin.add(nextPageBtn);
	
	//CALLBACK FUNCTIONS
	function cb(status) {
		if(acs.isLoggedIn()) {
			var PlaceholderWindow = require('ui/common/PlaceholderWindow');
			var placeholderwin = new PlaceholderWindow();
			lWin.containingTab.open(placeholderwin);
			Ti.API.info("successfully logged in");
			loginOrOutButton.title = 'Logout';
			fbLoginOrOutButton.title = 'fb_logout';
		} else {
			alert(L("nope..wrong username/password"));
		}
	}
	
	function logoutCallback(event) {
		if(event.success) {
			Ti.API.info("successfully logged out");
			loginOrOutButton.title = 'Login';
			fbLoginOrOutButton.title = 'fb_login';
		} else {
			Ti.API.info("something wrong with logout mechanism");
		}
	}
	
	function loginWindowFacebookCallback(e) {
		if (e.success) {
			alert('LoginWindow.js FB login event cb');
			var PlaceholderWindow = require('ui/common/PlaceholderWindow');
			var placeholderwin = new PlaceholderWindow();
			lWin.containingTab.open(placeholderwin); 
			fbLoginStatuslbl.text = 'Fb Logged In = ' + Ti.Facebook.loggedIn;
			fbLoginOrOutButton.title = 'fb_logout';
			loginOrOutButton.title = 'Logout';
		} else if (e.error) {
			fbLoginOrOutButton.title = 'fb_login';
		} else if (e.cancelled) {
			fbLoginOrOutButton.title = 'fb_login';
		}
	}
	
	//EVENTS REGISTERING
	loginOrOutButton.addEventListener('click',function() {
		if(loginOrOutButton.title === 'Login')
			acs.login(usernameOrEmail.value,password.value,cb);
		else {
			acs.logout(logoutCallback);
			Ti.Facebook.logout();
		}
	});
	
	signupButton.addEventListener('click',function() {
		//before going to another page, unregister facebook login event listener
		Ti.include('helpers/removeFacebookAuthenListeners.js')
		Ti.Facebook.removeEventListener("login",loginWindowFacebookCallback);
		
		var SignupWindow = require('ui/common/SignupWindow');	
		var signupwin = new SignupWindow(lWin.containingTab);
		lWin.containingTab.open(signupwin); 
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
	
	fbLoginOrOutButton.addEventListener('click', function() {
		if(fbLoginOrOutButton.title === 'fb_login')
			Ti.Facebook.authorize();
		else {
			Ti.Facebook.logout(); //logout from fb
			acs.logout(logoutCallback); //logout from chatterbox
		}
	});
	
	nextPageBtn.addEventListener('click', function() {
		var PlaceholderWindow = require('ui/common/PlaceholderWindow');
		var placeholderwin = new PlaceholderWindow();
		lWin.containingTab.open(placeholderwin);
	});
		
	Ti.Facebook.addEventListener('logout', function() {
		fbLoginStatuslbl.text = 'Fb Logged In = ' + Ti.Facebook.loggedIn;
		fbLoginOrOutButton.title = 'fb_login';
		loginOrOutButton.title = 'Login';
	});
	
	//What to do when this page is showing!
	lWin.addEventListener('focus', function(){
		//add the Ti.Facebook.addEventlistener('login') when this page is active
        Ti.include('helpers/facebookAuthenListeners.js'); //fb authen functionality
		Ti.Facebook.addEventListener('login', loginWindowFacebookCallback);                           
	
		//Text handling stuff
		if(Ti.Facebook.loggedIn) {
			fbLoginOrOutButton.title = 'fb_logout';
		} else {
			fbLoginOrOutButton.title = 'fb_login';
		}
		
		Cloud.Users.showMe(function (e) {
			if (e.success) {
				Ti.API.info("currently logged in");
		        acs.setLoggedInStatus(true);
		        loginOrOutButton.title = 'Logout';
		   }
		    else {
				Ti.API.info("currently NOT logged in");
				acs.setLoggedInStatus(false);
		        loginOrOutButton.title = 'Login';
		        if(Ti.Facebook.loggedIn) { //if fb is logged in, need to logout so that user can login via fb again
		        	Ti.Facebook.logout();
		        }
			}
		});
	});
		
	return lWin;
	
};

module.exports = LoginWindow;
