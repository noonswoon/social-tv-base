var LoginFbOnlyWindow = function() {
		
	//UI STUFF
	var lWin = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Login",
		barColor: '#6d0a0c',
		layout: 'vertical'
	});
		
	var fbLoginOrOutButton = Ti.UI.createButton({
		title:'fb_login',
		top:5,
		width:200,
		height:40,
		visible:true
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
	lWin.add(fbLoginOrOutButton);
	lWin.add(fbLoginStatuslbl);
	lWin.add(whyFbBtn);
	
	//CALLBACK FUNCTIONS
	function cb(status) {
		if(acs.isLoggedIn()) {
			Ti.API.info("successfully logged in");
			fbLoginOrOutButton.title = 'fb_logout';
		} else {
			alert("nope..wrong username/password");
		}
	}
	
	function logoutCallback(event) {
		if(event.success) {
			Ti.API.info("successfully logged out");
			fbLoginOrOutButton.title = 'fb_login';
		} else {
			Ti.API.info("something wrong with logout mechanism");
		}
	}
	
	function loginWindowFacebookCallback(e) {
		if (e.success) {
			alert('LoginWindow.js FB login event cb');
			fbLoginOrOutButton.title = 'fb_logout';
			var EnterUsernameWindow = require('ui/common/Am_EnterUsernameWindow');
			var enterusernamewin = new EnterUsernameWindow();
			lWin.containingTab.open(enterusernamewin);
		} else if (e.error) {
			fbLoginOrOutButton.title = 'fb_login';
		} else if (e.cancelled) {
			fbLoginOrOutButton.title = 'fb_login';
		}
	}
	
	//EVENTS REGISTERING		
	fbLoginOrOutButton.addEventListener('click', function() {
		if(fbLoginOrOutButton.title === 'fb_login')
			Ti.Facebook.authorize();
		else {
			Ti.Facebook.logout(); //logout from fb
			acs.logout(logoutCallback); //logout from chatterbox
		}
	});
	
	whyFbBtn.addEventListener('click', function() {
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
		   }
		    else {
				Ti.API.info("currently NOT logged in");
				acs.setLoggedInStatus(false);
		        if(Ti.Facebook.loggedIn) { //if fb is logged in, need to logout so that user can login via fb again
		        	Ti.Facebook.logout();
		        }
			}
		});
	});
	return lWin;
	
};

module.exports = LoginFbOnlyWindow;

