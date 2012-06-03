function facebookAuthenCallback(e) {
	if (e.success) {
		//alert('facebookAuthenListners.js FB login event cb');
		//CREATING/LOGGIN IN TO CHATTERBOX VIA THIRD-PARTY METHOD
		Cloud.SocialIntegrations.externalAccountLogin({
	    	type: 'facebook',
	    	token: Ti.Facebook.accessToken
		}, function (e) {
		    if (e.success) {
			   	//before doing this, need to check if the user already has username, if so, just login, no need to update
			   	//if not, meaning that this is the signup, need to ask for username and update username and email address
			   	//--> calling Ti.Cloud.ShowMe first!--> if it is a signup, then call Cloud.Users.update
			   	Cloud.Users.showMe(function (e) {        
					if (e.success) {
						if(e.users[0].username === undefined) {
							//need to do the registering
							//TODO: future-->need to close the LoginFbOnlyWindow
							
							var EnterUsernameWindow = require('ui/common/Am_EnterUsernameWindow');
							var enterusernamewin = new EnterUsernameWindow();
							enterusernamewin.open();
						} else {
							Ti.API.info('need to close login window to open applicationTabGroup window');
							acs.setUserLoggedIn(e.users[0]);
							acs.setLoggedInStatus(true);
							var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
							new ApplicationTabGroup().open();
				    	}
				   } else {
				   		Ti.API.info("something wrong here at showMe");
				   }
			    });
			} else {
		        Ti.API.info('facebookAuthenCallback Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
			}
		});
	} else if (e.error) {
		Ti.API.info("fb login error: "+e.error);
	} else if (e.cancelled) {
		Ti.API.info("fb login Canceled");
	}
}