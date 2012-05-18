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
		user_ids: _userID,
		//approval_required: true
	};
	xhr.send(postParameters);  // request is actually sent with this statement
	
};