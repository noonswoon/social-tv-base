function facebookAuthenCallback(e) {
	if (e.success) {
		alert('facebookAuthenListners.js FB login event cb');
		//CREATING/LOGGIN IN TO CHATTERBOX VIA THIRD-PARTY METHOD
		Cloud.SocialIntegrations.externalAccountLogin({
	    	type: 'facebook',
	    	token: Ti.Facebook.accessToken
		}, function (e) {
		    if (e.success) {
		   	
		   	//before doing this, need to check if the user already has username, if so, just login, no need to update
		   	//if not, meaning that this is the signup, need to ask for username and update username and email address
		   	//--> calling Ti.Cloud.ShowMe first!--> if it is a signup, then call Cloud.Users.update
		   	
		   	//GETTING EMAIL ADDRESS
				Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
				    if (e.success) {
				    	var fbGraphObj = JSON.parse(e.result)
				        var email = fbGraphObj.email;
				        //need to ask explicitly for username from the user
				        //UPDATING THE ACCOUNT WITH EMAIL PROVIDED BY FB GRAPH API
				        Cloud.Users.update({email: email} , function (e) {
						    if (e.success) {
						        var user = e.users[0];
						        Ti.API.info('Update success-acct has fb email');
						    } else {
						        Ti.API.info('UPDATE Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
						      }
						});
					} else if (e.error) {
				        Ti.API.info(e.error);
				    } else {
				        Ti.API.info('Unknown response');
				    }
				});
			} else {
		        Ti.API.info('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
			}
		});
		
	} else if (e.error) {
		Ti.API.info("fb login error: "+e.error);
	} else if (e.cancelled) {
		Ti.API.info("fb login Canceled");
	}
}

Ti.Facebook.addEventListener('login', facebookAuthenCallback);