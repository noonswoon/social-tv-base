/*
	Library to wrap app-specific functionality around the ACS APIs
*/
// a couple local variables to save state
var currentUser = null;
var loggedIn = false;

var Cloud = require('ti.cloud');
// make sure you added your ACS keys to the tiapp.xml file!
Cloud.apiKey = 'CHATTERBOX_APIKEY';
Cloud.consumerKey = 'CHATTEBOX_KEY';
Cloud.consumerSecret = 'CHATTERBOX_SECRET';


exports.isLoggedIn = function() {
	return loggedIn;
};

exports.login = function(username, password, callback) {
/*
 * Write a function that will use the ACS Users API to log in a user.
 *   - upon successful login, set currentUser equal to the user object returned by ACS
 *   - and set loggedIn=true. Then, call the callback function, passing the loggedIn variable
 *   - if login fails, write the error message to the console, set loggedIn=false and currentUser=null
 *   - then call the callback function passing the loggedIn variable
 */
	Cloud.Users.login({
		login:username,
		password:password
	},function(e) {
		if(e.success) {
			currentUser = e.users[0];
			loggedIn = true;
			Ti.API.info('user = '+JSON.stringify(e));
			
			callback(loggedIn);
		} else {
			Ti.API.info('Error:\\n' + ((e.error &&e.message) || JSON.stringify(e)));
			loggedIn = false;
			currentUser = null;
			callback(loggedIn);
		}
	});
};

exports.logout = function() {
/*
 * Write a function that will use the ACS Users API to log out the current user
 *   - on success, set currentUser=null and loggedIn=false
 */
	Cloud.Users.logout(function(e) {
		if(e.success) {
			currentUser = null;
			loggedIn  = false;
		}
	});
};

exports.createUser = function(username, password, callback) {
/*
 * Write a function that will use the ACS Users API to create a user with the given name & password
 *   - on success, set currentUser equal to the user object returned by ACS and set
 *   - loggedIn=true, then call the callback function passing the current user.
 *   - on failure, log a message to the console, set loggedIn to false, current user to null
 *   - and call the callback function, passing false
 */
	Cloud.Users.create({
		username:username,
		password: password,
		password_confirmation:password
	}, function(e) {
		if(e.success) {
			Ti.API.info('user = '+JSON.stringify(e.users[0]));
			currentUser = e.users[0];
			loggedIn = true;
			callback(currentUser);
		} else {
			Ti.API.info('Error'+JSON.stringify(e));
			loggedIn = false;
			currentUser = null;
			callback(false);
		}
	});
};

exports.brag = function(message, photo, callback) {
/*
 * Write a function that will use the ACS Statuses API to post a message for the logged in user
 *   - pass a message and a photo, no other params are needed
 *   - on success, call the callback function passing true
 *   - on failure, log the error to the console, call callback() passing false
*/
	if(loggedIn) {
		Cloud.Statuses.create({
			message:message,
			photo:photo
		}, function(e) {
			if(e.success) {
				callback(true);
			} else {
				Ti.API.info('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
		        callback(false);
		    }
		});
	} else {
		return false;
	}
};

exports.getBragList = function(callback) {
/*
 * Write a function that will use the ACS Statuses API to retrieve a list of messages for the logged in user
 *   - on success, call the callback function, passing the array of status messages returned by ACS
 *   - on failure, log the error and call callback() passing false
*/
	if(loggedIn) {
		Cloud.Statuses.search({
			user_id:currentUser.id
		}, function(e) {
			if (e.success) {
		    	Ti.API.info('statuses = ' + JSON.stringify(e.statuses))
		    	callback(e.statuses);
		    } else {
		        Ti.API.info('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
		        callback(false);
		    }
		});
	}
};