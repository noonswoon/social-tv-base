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
        if (e.success) { /* do nothing */ } 
        else Debug.debug_print('AddFriend error: '+JSON.stringify(e));
    });
};

exports.friendsACS_approveFriend = function(_userId,_callbackFn){
	Cloud.Friends.approve({
        user_ids: _userId,
    }, function (e) {
        if (e.success) {
        	Ti.API.info('approved friend: '+_userId);
        	_callbackFn(JSON.stringify(e));
        } else {
        	Debug.debug_print('friendsACS->approveFriend: Error= '+ JSON.stringify(e));
        }
    });
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
        } else {
            Debug.debug_print('friendsACS->showFriendsRequest: Error= '+ JSON.stringify(e));
			Ti.App.fireEvent("friendRequestsLoaded",{fetchedRequests:[]});
        }
    });
};
