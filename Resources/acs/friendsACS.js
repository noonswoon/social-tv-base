exports.friendsACS_searchFriend = function(_userId){
	Cloud.Friends.search({
        user_id: _userId
        //experiment with response_json_depth:2, per_page: xxx
    }, function (e) {
        if (e.success) {
            var friends = [];
            for (var i = 0; i < e.users.length; i++) {
                var friend = e.users[i];
                    
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
					my_id: _userId,
					friend_id: friend.id,
					fb_id: fbId,
					username: friend.username,
					first_name: friend.first_name,
					last_name: friend.last_name,
					email: friend.email
				};
				friends.push(curFriend);     
            }
           	Ti.App.fireEvent("friendsLoaded",{fetchedFriends:friends});
        } else {
	        Ti.App.fireEvent("friendsLoaded",{fetchedFriends:[]});
        }
    });
};

exports.friendACS_fetchedUserTotalFriends = function(_userId) {
	Cloud.Friends.search({
        user_id: _userId,
        per_page: 1
    }, function (e) {
        if (e.success) {
	      	var totalFriends = e.meta.total_results;
	      	Ti.App.fireEvent('UserTotalFriendsFromACS', {result: totalFriends});
        } else {
	        Debug.debug_print('friendACS_fetchedUserTotalFriends error: '+JSON.stringify(e));
        }
    });
};

exports.friendsACS_addFriend = function(_userId){
	Cloud.Friends.add({
        user_ids: _userId
    }, function (e) {
        if (e.success) {
            var successAlertDialog = Ti.UI.createAlertDialog({
	        	title: 'Chatterbox',
	        	message: L('Your request has been sent.')
	        });
	        successAlertDialog.show();
	        Ti.API.info('addFriend success: '+JSON.stringify(e));
        } else {
        	Debug.debug_print('AddFriend error: '+JSON.stringify(e));
        }
    });
};

exports.friendsACS_approveFriend = function(_userID,_callbackFn){
	var url = 'https://api.cloud.appcelerator.com/v1/friends/approve.json?key='+ACS_API_KEY;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    	//responseJSON = JSON.parse(this.responseText);
	    	Ti.API.info('approved friend: '+_userID);
	    	var response = _callbackFn(this.responseText);
	    },
	    onerror: function(e) {
			Debug.debug_print('friendsACS->approveFriend: Error= '+ JSON.stringify(e));
	    },
	    timeout:50000  /* in milliseconds */
	});
	xhr.open("PUT", url);
	var putParameters = {
		key: ACS_API_KEY,
		user_ids: _userID,
	};
	xhr.send(putParameters);  // request is actually sent with this statement
};
    
exports.friendsACS_showFriendsRequest = function(){
	var requests = [];
	Cloud.Friends.requests(function (e) {
        if (e.success) {
            for (var i = 0; i < e.friend_requests.length; i++) {
                var request = e.friend_requests[i];
                
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
            Ti.API.info('SUCCESSFUL friendsACS showFriendsRequest');
        } else {
            Debug.debug_print('friendsACS->showFriendsRequest: Error= '+ JSON.stringify(e));
			Ti.App.fireEvent("friendRequestsLoaded",{fetchedRequests:[]});
        }
    });
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
			Debug.debug_print('friendsACS->friendsCheckins: Error= '+ JSON.stringify(e));
			Ti.App.fireEvent("friendsCheckInLoaded",{fetchedAllFriendsCheckins:allFriendsCheckins, fetchedTotalFriendCheckins:totalFriendCheckins});
	    },
	    timeout:50000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
};
