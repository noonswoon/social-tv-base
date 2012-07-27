
//import friend list///////////////////////////////////////////////////////////////////////////////////////////
exports.friendsACS_searchFriend = function(_userID){
	var url = 	'https://api.cloud.appcelerator.com/v1/friends/search.json?key=' + ACS_API_KEY +
				'&user_id='+_userID;	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	    	responseJSON = JSON.parse(this.responseText);
		    var friends = [];
		    if(responseJSON.response.users.length){
			    for (var i = 0; i < responseJSON.response.users.length; i++) {
					var friend = responseJSON.response.users[i];     
			        var fbId = 0;
					var numExternalAccounts = friend.external_accounts.length;
						
					for(var j=0;j < numExternalAccounts; j++) {
						var curExternalAccount = friend.external_accounts[j];
						if(curExternalAccount.external_type === "facebook") {
							fbId = curExternalAccount.external_id;
							break;
						}
					}
					
					var curFriend = {
						my_id: _userID,
						friend_id: friend.id,
						fb_id: fbId,
						username: friend.username,
						first_name: friend.first_name,
						last_name: friend.last_name,
						email: friend.email
					};
					friends.push(curFriend);
				}
			}
			Ti.App.fireEvent("friendsLoaded",{fetchedFriends:friends});
		}, onerror: function(e) {
	        Debug.debug_print('friendsACS->searchFriend: Error= '+e.error);
	        //ErrorHandling.showNetworkError();
	        Ti.App.fireEvent("friendsLoaded",{fetchedFriends:[]});
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
};
//return total friends ///////////////////////////////////////////////////////////////////////////////////////
//this function give only total results
exports.friendACS_fetchedUserTotalFriends = function(_id) {
	var url = 'https://api.cloud.appcelerator.com/v1/friends/search.json?key=' + ACS_API_KEY +'&user_id='+ _id;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
			responseJSON = JSON.parse(this.responseText);
	      	var total_results = Number(responseJSON.meta.total_results);
			Ti.App.fireEvent('UserTotalFriendsFromACS', {result: total_results});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        //Ti.API.debug(e.error);
	        Debug.debug_print('friendACS_fetchedUserTotalFriends error');
	        //ErrorHandling.showNetworkError();
	    },
	    timeout:10000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();

};
//add friend /////////////////////////////////////////////////////////////////////////////////////////////////
exports.friendsACS_addFriend = function(_userID,_callbackFn){
	var url = 'https://api.cloud.appcelerator.com/v1/friends/add.json?key='+ACS_API_KEY;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    	var successAlertDialog = Ti.UI.createAlertDialog({
	        	title: 'Chatterbox',
	        	message: L('Your request has been sent.')
	        });
	        successAlertDialog.show();
	    	
	    	var response = _callbackFn(this.responseText);
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        //ErrorHandling.showNetworkError();
	    	Debug.debug_print('An error occured: you might already request this person or there is some problem on internet connection.');
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("POST", url);
	var postParameters = {
		key: ACS_API_KEY,
		user_ids: String(_userID),
	};
	xhr.send(postParameters);  // request is actually sent with this statement
};
// one direction add friends
/* unused for now..will be using for celebrity
exports.addFriendwithNoApprove = function(_userID,_callbackFn){
	var url = 'https://api.cloud.appcelerator.com/v1/friends/add.json?key='+ACS_API_KEY;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    	var response = _callbackFn(this.responseText);
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	    	ErrorHandling.showNetworkError();
	        Debug.debug_print('An error occured: you might already request this person or there is some problem on internet connection.');
	    },
	    timeout:5000 
	});
	xhr.open("POST", url);
	var postParameters = {
		key: ACS_API_KEY,
		user_ids: String(_userID),
		approval_required: false
	};
	xhr.send(postParameters);  // request is actually sent with this statement
};
*/


//approve friend /////////////////////////////////////////////////////////////////////////////////////////////
exports.friendsACS_approveFriend = function(_userID,_callbackFn){
	var url = 'https://api.cloud.appcelerator.com/v1/friends/approve.json?key='+ACS_API_KEY;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    	//responseJSON = JSON.parse(this.responseText);
	    	Ti.API.info('approved friend: '+_userID);
	    	var response = _callbackFn(this.responseText);
	    },
	    onerror: function(e) {
			//ErrorHandling.showNetworkError();
			Debug.debug_print('friendsACS->approveFriend: Error= '+e.error);
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("PUT", url);
	var putParameters = {
		key: ACS_API_KEY,
		user_ids: _userID,
	};
	xhr.send(putParameters);  // request is actually sent with this statement
};
//show friend request ////////////////////////////////////////////////////////////////////////////////////////
exports.friendsACS_showFriendsRequest = function(){
	var requests = [];
	var url = 	'https://api.cloud.appcelerator.com/v1/friends/requests.json?key='+ACS_API_KEY;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {	
	    	responseJSON = JSON.parse(this.responseText);
		      	for (var i = 0; i < responseJSON.response.friend_requests.length; i++) {
	            var request = responseJSON.response.friend_requests[i]; 
	            
	            var fbId = 0;
				var numExternalAccounts = request.user.external_accounts.length; //friend.external_accounts.length;
					
				for(var j=0;j < numExternalAccounts; j++) {
					var curExternalAccount = request.user.external_accounts[j];
					if(curExternalAccount.external_type === "facebook") {
						fbId = curExternalAccount.external_id;
						break;
					}
				}
				var curRequest = {
					req_id: request.id,
					friend_id: request.user.id,
					username: request.user.username,
					first_name: request.user.first_name,
					last_name: request.user.last_name,
					email: request.user.email,
					fb_id: fbId
				};
				requests.push(curRequest);
			} 
			Ti.App.fireEvent("friendRequestsLoaded",{fetchedRequests:requests});
	    },
	    onerror: function(e) {
			Debug.debug_print('friendsACS->showFriendsRequest: Error= '+e.error);
			Ti.App.fireEvent("friendRequestsLoaded",{fetchedRequests:[]});
			//ErrorHandling.showNetworkError();
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
};

exports.friendsACS_friendsCheckins = function(_paramsArray){
	
	friendsList = _paramsArray[0];
	programsList = _paramsArray[1];
	
	var programsCheckins = [];
	var friendsCheckins = [];
	var allFriendsCheckins = [];

	var allProgramsId = programsList;
	var allProgramsIdStr = '';
	for(var i=0; i<allProgramsId.length; i++) {
		allProgramsIdStr += '"'+allProgramsId[i]+'",';
	}
	allProgramsIdStr = allProgramsIdStr.substr(0,allProgramsIdStr.length-1);
	
	var allFriendsId = friendsList;
	var allFriendsIdStr = '';
	for(var i=0; i<allFriendsId.length; i++) {
		allFriendsIdStr += '"'+allFriendsId[i]+'",';
	}
	allFriendsIdStr = allFriendsIdStr.substr(0,allFriendsIdStr.length-1);
	
	var url = 'https://api.cloud.appcelerator.com/v1/checkins/query.json?key='+ACS_API_KEY+'&response_json_depth=2&where={"event_id":{"$in":['+allProgramsIdStr+']},"user_id":{"$in":['+allFriendsIdStr+']}}';
 	var totalFriendCheckins = 0;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	    	responseJSON = JSON.parse(this.responseText);
	    	totalFriendCheckins = responseJSON.meta.total_results;	
		    
		    for (var i=0;i<responseJSON.response.checkins.length;i++) {
	           	var checkins = responseJSON.response.checkins[i];  
		        var friendsCheckins = {
		           	program: checkins.event,
		           	friend: checkins.user,
		        };
		        allFriendsCheckins.push(friendsCheckins);
			}  	
			Ti.App.fireEvent("friendsCheckInLoaded",{fetchedAllFriendsCheckins:allFriendsCheckins, fetchedTotalFriendCheckins:totalFriendCheckins});
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
			//ErrorHandling.showNetworkError();
			Debug.debug_print('friendsACS->friendsCheckins: Error= '+e.error);
			Ti.App.fireEvent("friendsCheckInLoaded",{fetchedAllFriendsCheckins:allFriendsCheckins, fetchedTotalFriendCheckins:totalFriendCheckins});
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
};
