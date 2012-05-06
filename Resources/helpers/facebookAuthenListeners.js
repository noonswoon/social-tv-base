function facebookAuthenCallback(e) {
	if (e.success) {
		alert('facebookAuthenListners.js FB login event cb');
		//CREATING/LOGGIN IN TO CHATTERBOX VIA THIRD-PARTY METHOD
		Cloud.SocialIntegrations.externalAccountLogin({
	    	type: 'facebook',
	    	token: Ti.Facebook.accessToken
		}, function (e) {
		    if (e.success) {
		   	//GETTING EMAIL ADDRESS
				Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
				    if (e.success) {
				    	var fbGraphObj = JSON.parse(e.result)
				        var email = fbGraphObj.email;
				        var username = fbGraphObj.username;
				        //UPDATING THE ACCOUNT WITH EMAIL PROVIDED BY FB GRAPH API
				        Cloud.Users.update({username: username,email: email} , function (e) {
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