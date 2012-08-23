function facebookAuthenCallback(e) {
	Debug.debug_print("in fbAuthenCallback");
	if (e.success) {
		Ti.Analytics.featureEvent('fb.login.success');
		Titanium.App.Analytics.trackPageview('/fb.login.success');
		
		//Successfully login to facebook
		//1. check if this fb user already has an account >> need to do this just to make Friend Module works
		//2. if so, get the email address and authtoken (as a password) and then login 
		//3. if NOT, need to go through the who user registration process 
		//  --> a. ask for username from the user
		//  --> b. create an account through Cloud.Users.create with email from graph api, password=authtoken, username->user provided
		//  --> c. link the new account with third party link
		//  --> d. login and redirect to ApplicationTab group [check if we need to do explicit login in order for friend to work]
		
		//step 1. getting email from facebook graph path
		Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
		    Debug.debug_print("using FbGraphAPI to query email");
		    if (e.success) {
		    	var fbGraphObj = JSON.parse(e.result)
		        var email = fbGraphObj.email;
		        var firstName = fbGraphObj.first_name;
		        var lastName = fbGraphObj.last_name;
		        var fbAuthToken = Ti.Facebook.accessToken;
		        
		        //step 2. using the email to query if the user is already registered
		        //Ti.API.info('querying email: '+email);
		        Debug.debug_print("pass graphAPI, querying email: "+email);
		        Cloud.Users.query({
				   where: {
				        email: email
				    }
				}, function (e) {
				    if (e.success) {
				    	Debug.debug_print("pass querying email..try to logging in");
				    	if(e.users.length > 0) {
				    		Cloud.SocialIntegrations.externalAccountLogin({
        						type: 'facebook',
						        token: Ti.Facebook.accessToken
						    }, function (e) {
						        if (e.success) {
							    	Debug.debug_print("Done login..redirect to maintabgroup");
									acs.setUserLoggedIn(e.users[0]);
									acs.setLoggedInStatus(true);
									
									var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
									Debug.debug_print("fbAuthenListener.js - creating new appTabGroup [watchout!]");
									
									Ti.App.fireEvent('closeLoginTabGroup'); //done with login, close the tabgroup
									var maintabgroup = new ApplicationTabGroup();
									maintabgroup.open();
							    } else {
							      	Debug.debug_print("Login failed: "+JSON.stringify(e));
							      	ErrorHandling.showNetworkError();
							    }
							});
				    	} else {
				    		//go to another page to ask user for the username
				    		Debug.debug_print("No email: new user registration");
				    		var EnterUsernameWindow = require('ui/common/Am_EnterUsernameWindow');
				    		Ti.Analytics.featureEvent('registration.start');
				    		Titanium.App.Analytics.trackPageview('/registration.start');
				    		var enterusernamewin = new EnterUsernameWindow(email,firstName,lastName);
				    		enterusernamewin.open();
				    	}
				    } else {
				    	Debug.debug_print('Users.query Error: ' +((e.error && e.message) || JSON.stringify(e)));
				    	//ErrorHandling.showNetworkError();
				    }
				});
			} else if (e.error) {
				Ti.Analytics.featureEvent('fb.login.error');
				Titanium.App.Analytics.trackPageview('/fb.login.error');
				Debug.debug_print('cannot request GraphPath: '+ JSON.stringify(e));		
				//ErrorHandling.showNetworkError();
			} else {
				Ti.Analytics.featureEvent('fb.login.error');
				Titanium.App.Analytics.trackPageview('/fb.login.error');
				Debug.debug_print("what the hell is going on_2? " + JSON.stringify(e));
				//ErrorHandling.showNetworkError();
			}
		});
	} else if (e.error) {
		Ti.Analytics.featureEvent('fb.login.error');
		Titanium.App.Analytics.trackPageview('/fb.login.error');
		Debug.debug_print("fb login error: ");
	} else if (e.cancelled) {
		Ti.Analytics.featureEvent('fb.login.cancel');
		Titanium.App.Analytics.trackPageview('/fb.login.cancel');
		Debug.debug_print("fb login Canceled");
	} else {
		Ti.Analytics.featureEvent('fb.login.error');
		Titanium.App.Analytics.trackPageview('/fb.login.error');
		alert("Facebook Login Error...please try again");
	}
}