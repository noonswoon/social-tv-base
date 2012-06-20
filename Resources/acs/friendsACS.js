
//import friend list///////////////////////////////////////////////////////////////////////////////////////////
exports.searchFriend = function(_userID){
	var url = 	'https://api.cloud.appcelerator.com/v1/friends/search.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr' +
				'&user_id='+_userID;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	    	responseJSON = JSON.parse(this.responseText);
		    var friends = [];
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

			Ti.App.fireEvent("friendsLoaded",{fetchedFriends:friends});
		}, onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        alert('friendsACS->searchFriend: Error= '+e.error);
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
};
//return total friends ///////////////////////////////////////////////////////////////////////////////////////
//this function give only total results
exports.friendACS_fetchedUserTotalFriends = function(_id) {
	var url = 'https://api.cloud.appcelerator.com/v1/friends/search.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr' + '&user_id='+ _id;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
			responseJSON = JSON.parse(this.responseText);
	      	var total_results = Number(responseJSON.meta.total_results);
			Ti.App.fireEvent('UserTotalFriendsFromACS', {result: total_results});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        Ti.API.info('friendACS_fetchedUserTotalFriends error');
	    },
	    timeout:10000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();

};
//add friend /////////////////////////////////////////////////////////////////////////////////////////////////
exports.addFriend = function(_userID,_callbackFn){
	var url = 'https://api.cloud.appcelerator.com/v1/friends/add.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr';
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    	Ti.API.info("Your request has been sent.");
	    	var response = _callbackFn(this.responseText);
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        alert('An error occured: you might already request this person or there is some problem on internet connection.');
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("POST", url);
	var postParameters = {
		key: '8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr',
		user_ids: String(_userID),
	};
	xhr.send(postParameters);  // request is actually sent with this statement
};

//approve friend /////////////////////////////////////////////////////////////////////////////////////////////
exports.approveFriend = function(_userID,_callbackFn){
	var url = 'https://api.cloud.appcelerator.com/v1/friends/approve.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr';
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    	//responseJSON = JSON.parse(this.responseText);
	    	Ti.API.info('approved friend: '+_userID);
	    	var response = _callbackFn(this.responseText);
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	         alert('friendsACS->approveFriend: Error= '+e.error);
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("PUT", url);
	var putParameters = {
		key: '8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr',
		user_ids: _userID,
	};
	xhr.send(putParameters);  // request is actually sent with this statement
};
//show friend request ////////////////////////////////////////////////////////////////////////////////////////
exports.showFriendsRequest = function(){
	var requests = [];
	var url = 	'https://api.cloud.appcelerator.com/v1/friends/requests.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr';
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
			Ti.App.fireEvent("requestsLoaded",{fetchedRequests:requests});
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        alert('friendsACS->showFriendsRequest: Error= '+e.error);
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
};

// //remove friend ////////////////////////////////////////////
// exports.removedFriendFromACS = function(user_id){
	// var url = 'https://api.cloud.appcelerator.com/v1/friends/remove.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr';
	// var xhr = Ti.Network.createHTTPClient({
	    // onload: function(e) {
	    	// //responseJSON = JSON.parse(this.responseText);
	    	// var response = _callbackFn(this.responseText);
	    // },
	    // onerror: function(e) {
			// // this function is called when an error occurs, including a timeout
			 // alert('friendsACS->removedFriendFromACS: Error= '+e.error);
	    // },
	    // timeout:5000  /* in milliseconds */
	// });
	// xhr.open("DELETE", url);
	 // var parameters = {
	 	// //key: '8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr',
		// user_ids: user_id
	 // };
	// xhr.send(parameters);  // request is actually sent with this statement
// };

exports.friendsCheckins = function(_friendsList,_programsList){
	var programsCheckins = [];
	var friendsCheckins = [];
	var allFriendsCheckins = [];

	var allProgramsID = _programsList;
	var allProgramsIDStr = '';
	for(var i=0;i<allProgramsID.length;i++) {
		allProgramsIDStr += '"'+allProgramsID[i]+'",';
	}
	allProgramsIDStr = allProgramsIDStr.substr(0,allProgramsIDStr.length-1);
	
	var allFriendsID = _friendsList;
	var allFriendsIDStr = '';
		for(var i=0;i<allFriendsID.length;i++) {
		allFriendsIDStr += '"'+allFriendsID[i]+'",';
	}
	allFriendsIDStr = allFriendsIDStr.substr(0,allFriendsIDStr.length-1);
	
	var url = 'https://api.cloud.appcelerator.com/v1/checkins/query.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr&where={"event_id":{"$in":['+allProgramsIDStr+']},"user_id":{"$in":['+allFriendsIDStr+']}}';

	//Ti.API.info(url);
	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	    	responseJSON = JSON.parse(this.responseText);
	    	var totalFriendCheckins = responseJSON.meta.total_results;	
		    
		    for (var i=0;i<responseJSON.response.checkins.length;i++) {
	           	var checkins = responseJSON.response.checkins[i];  
		        var friendsCheckins ={
		           	program: checkins.event,
		           	friend: checkins.user,
		          }
		        allFriendsCheckins.push(friendsCheckins);
			}  	
			Ti.API.info('fireEvent: friendsCheckInLoaded');
			Ti.App.fireEvent("friendsCheckInLoaded",{fetchedAllFriendsCheckins:allFriendsCheckins, fetchedTotalFriendCheckins:totalFriendCheckins});
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
			alert('friendsACS->friendsCheckins: Error= '+e.error);
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
};
