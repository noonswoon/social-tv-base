/*
	Library to wrap app-specific functionality around the ACS APIs
*/
// a couple local variables to save state
var currentUser = null;
var loggedIn = false;

exports.isLoggedIn = function() {
	return loggedIn;
};

exports.getUserLoggedIn = function() {
	return currentUser;
};

// exports.getUserName = function() {
// //	var name = currentUser.first_name + ' ' + currentUser.last_name;
	// return currentUser;
// };

exports.setUserLoggedIn = function(user) {
	currentUser = user;
	//Ti.API.info("currentLoggedInUser: "+JSON.stringify(currentUser));
};

exports.getUserId = function() {
	return currentUser.id;
};

function getUserFbId() {
	if(currentUser.external_accounts === undefined) return -1;
	
	var fbId = "0";
	var numExternalAccounts = currentUser.external_accounts.length;
	
	for(var i=0;i < numExternalAccounts; i++) {
		var curExternalAccount = currentUser.external_accounts[i];
		if(curExternalAccount.external_type === "facebook") {
			fbId = curExternalAccount.external_id;
			break;
		}
	}
	return fbId;
};

exports.getUserFbId = getUserFbId; 

exports.getUserFbToken = function() {
	if(currentUser.external_accounts === undefined) return "";
	
	var fbToken = "";
	var numExternalAccounts = currentUser.external_accounts.length;
	
	for(var i=0;i < numExternalAccounts; i++) {
		var curExternalAccount = currentUser.external_accounts[i];
		if(curExternalAccount.external_type === "facebook") {
			fbToken = curExternalAccount.token;
			break;
		}
	}
	return fbToken;
};

exports.getUserImage = function() {
	var fbId = getUserFbId(); 
	if(fbId === -1 || fbId === 0 || fbId === "0") return "";
	else return "https://graph.facebook.com/"+fbId+"/picture"
}

exports.getUserImageNormal = function() {
	var fbId = getUserFbId(); 
	if(fbId === -1 || fbId === 0 || fbId === "0") return "";
	else return "https://graph.facebook.com/"+fbId+"/picture?type=normal"
//	else return "https://graph.facebook.com/"+fbId+"/picture?type=square"
}

exports.getUserImageSquareOfFbId = function(fbId) {
	if(fbId === -1 || fbId === 0 || fbId === "0") return "";
	else return "https://graph.facebook.com/"+fbId+"/picture?type=square"
}

exports.getUserImageNormalOfFbId = function(fbId) {
	if(fbId === -1 || fbId === 0 || fbId === "0") return "";
	else return "https://graph.facebook.com/"+fbId+"/picture?type=normal"
}

exports.getUserImageLarge = function() {
	var fbId = getUserFbId(); 
	if(fbId === -1 || fbId === 0 || fbId === "0") return "";
	else return "https://graph.facebook.com/"+fbId+"/picture?type=large"
}

exports.setLoggedInStatus = function(isLoggedIn) {
	loggedIn = isLoggedIn;
};

exports.login = function(usernameOrEmail, password, callback) {
/*
 * Write a function that will use the ACS Users API to log in a user.
 *   - upon successful login, set currentUser equal to the user object returned by ACS
 *   - and set loggedIn=true. Then, call the callback function, passing the loggedIn variable
 *   - if login fails, write the error message to the console, set loggedIn=false and currentUser=null
 *   - then call the callback function passing the loggedIn variable
 */

	//later, need to write the function to check whether the user is banned or not
	Cloud.Users.login({
		login:usernameOrEmail,
		password:password
	},function(e) {
		if(e.success) {
			currentUser = e.users[0];
			loggedIn = true;
			Ti.API.info('user = '+JSON.stringify(e));
			callback(loggedIn);
		} else {
			Ti.API.info('acs-> Cloud.Users.login Error:\\n' + ((e.error &&e.message) || JSON.stringify(e)));
			loggedIn = false;
			currentUser = null;
			callback(loggedIn);
		}
	});
};

exports.logout = function(callback) {
/*
 * Write a function that will use the ACS Users API to log out the current user
 *   - on success, set currentUser=null and loggedIn=false
 */
	Cloud.Users.logout(function(e) {
		if(e.success) {
			currentUser = null;
			loggedIn  = false;
			callback(e)
		}
	});
};

exports.createUser = function(email,username, password,macAddress, callback) {
/*
 * Write a function that will use the ACS Users API to create a user with the given name & password
 *   - on success, set currentUser equal to the user object returned by ACS and set
 *   - loggedIn=true, then call the callback function passing the current user.
 *   - on failure, log a message to the console, set loggedIn to false, current user to null
 *   - and call the callback function, passing false
 */
	Cloud.Objects.query({
	    classname: 'BannedDevices',
	    page: 1,
	    per_page: 10,
	    where: {
	        mac_address: macAddress
	    }
	}, function (e) {
	    if (e.success) {
	    	Ti.API.info('user = '+JSON.stringify(e));
	        if(e.BannedDevices.length > 0) {
	        	var deviceBannedDialog = Titanium.UI.createAlertDialog({
						title:L('Your device is banned'),
						message:L('Please contact admin@chatterbox.mobi for more information.')
					});
				deviceBannedDialog.show();
	        } else {
	        	Ti.API.info('pass banning device screnn test');
	    		Cloud.Users.create({
					email:email,
					username:username,
					password: password,
					password_confirmation:password,
					custom_fields: {
							        "mac_address": macAddress,
							        "banned": false
									}
				}, function(e) {
						if(e.success) {
							Ti.API.info('user = '+JSON.stringify(e.users[0]));
							currentUser = e.users[0];
							loggedIn = true;
							callback(currentUser);
						} else {
							Ti.API.info('Error'+JSON.stringify(e));
							Debug.debug_print(e.message);
							loggedIn = false;
							currentUser = null;
							callback(false);
						}
					}
				);
			}    	
	    } else {
	        Debug.debug_print('acs -> createUser Error: ' + ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};
