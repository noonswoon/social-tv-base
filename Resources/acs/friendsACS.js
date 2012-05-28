//import friend list///////////////////////////////////////////////////////////////////////////////////////////

exports.searchFriend = function(_userID){
	var friends = [];
	//alert('search friend');
	var url = 	'https://api.cloud.appcelerator.com/v1/friends/search.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr' +
				'&user_id='+_userID;
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	    	responseJSON = JSON.parse(this.responseText);
	    	Ti.API.info("friends: "+responseJSON.response.users.length);
		      	for (var i = 0; i < responseJSON.response.users.length; i++) {
	            var friend = responseJSON.response.users[i];  
	           // alert('friend ID :' + friend.id + 'Name: ' + friend.first_name +' ' + friend.last_name+
	           // 'username: ' + friend.username);
				var curFriend = {
					my_id: _userID,
					friend_id: friend.id,
					username: friend.username,
					first_name: friend.first_name,
					last_name: friend.last_name,
					email: friend.email
				};
				friends.push(curFriend);
			}  	
	        Ti.App.fireEvent("friendsLoaded",{fetchedFriends:friends});
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('error');
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
};

//add friend /////////////////////////////////////////////////////////////////////////////////////////////////
exports.addFriend = function(_userID,_callbackFn){
	alert('user to be friended with: '+_userID);
	var url = 'https://api.cloud.appcelerator.com/v1/friends/add.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr';
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    	alert("success friend added");
	    	var response = _callbackFn(this.responseText);
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('error');
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
	alert('approving friend: '+_userID);
	var url = 'https://api.cloud.appcelerator.com/v1/friends/approve.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr';
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    	alert("approved");
	    	//responseJSON = JSON.parse(this.responseText);
	    	var response = _callbackFn(this.responseText);
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('error');
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
	    	//alert("success loading friend request");
	    	responseJSON = JSON.parse(this.responseText);
	    	//alert("friends request: "+responseJSON.response.friend_requests.length);
		      	for (var i = 0; i < responseJSON.response.friend_requests.length; i++) {
	            var request = responseJSON.response.friend_requests[i];  
	         //   alert('REQUEST//friend ID :' + request.id + 'Name: ' + request.user.first_name +' ' + request.user.last_name+
	        //    'username: ' + request.user.username);
				var curRequest = {
					req_id: request.id,
					friend_id: request.user.id,
					username: request.user.username,
					first_name: request.user.first_name,
					last_name: request.user.last_name,
					email: request.user.email
				};
				requests.push(curRequest);
			}  	
			Ti.App.fireEvent("requestsLoaded",{fetchedRequests:requests});
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('error');
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
};


//remove friend ////////////////////////////////////////////
exports.removedFriendFromACS = function(user_id){
	var url = 'https://api.cloud.appcelerator.com/v1/friends/remove.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr';
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    	//responseJSON = JSON.parse(this.responseText);
	    	var response = _callbackFn(this.responseText);
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('error');
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("DELETE", url);
	 var parameters = {
	 	//key: '8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr',
		user_ids: user_id
	 };
	xhr.send(parameters);  // request is actually sent with this statement
};

