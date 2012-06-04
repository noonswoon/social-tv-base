function facebookAuthenCallback(e) {
	if (e.success) {
		//alert('facebookAuthenListners.js FB login event cb');
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
		    if (e.success) {
		    	var fbGraphObj = JSON.parse(e.result)
		        var email = fbGraphObj.email;
		        var firstName = fbGraphObj.first_name;
		        var lastName = fbGraphObj.last_name;
		        var fbAuthToken = Ti.Facebook.accessToken;
		        
		        //step 2. using the email to query if the user is already registered
		        //Ti.API.info('querying email: '+email);
		        Cloud.Users.query({
				   where: {
				        email: email
				    }
				}, function (e) {
				    if (e.success) {
				    	if(e.users.length > 0) {
				    		Ti.API.info('already registered..logging in; length: '+e.users.length); 	
							Cloud.Users.login({
							    login: email,
							    password: (Ti.Facebook.accessToken).substr(0,20)
							}, function (e) {
							    if (e.success) {
									//Ti.API.info("successful login: "+e.users.length);
									acs.setUserLoggedIn(e.users[0]);
									acs.setLoggedInStatus(true);
									
									var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
									var maintabgroup = new ApplicationTabGroup();
									maintabgroup.open();
							    } else {
							      	alert("login failed: "+e.error);
							    }
							});
				    	} else {
				    		Ti.API.info('not yet creating an account..long story here');
				    		//go to another page to ask user for the username
				    		var EnterUsernameWindow = require('ui/common/Am_EnterUsernameWindow');
				    		var enterusernamewin = new EnterUsernameWindow(email,firstName,lastName);
							enterusernamewin.open();
				    	}
				    } else {
				        alert('Users.query Error: ' +((e.error && e.message) || JSON.stringify(e)));
				    }
				});
			} else if (e.error) {
				Ti.API.info('cannot request GraphPath: '+e.error);		
			}
		});
	} else if (e.error) {
		Ti.API.info("fb login error: "+e.error);
	} else if (e.cancelled) {
		Ti.API.info("fb login Canceled");
	}
}