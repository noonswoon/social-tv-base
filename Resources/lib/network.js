/**
 * @author Mickey Asavanant
 */
exports.getFugitives = function(_callbackFn) {
	var url = "http://bountyhunterapp.appspot.com/bounties";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
			// this function is called when data is returned from the server and available for use
	        // this.responseText holds the raw text return of the message (used for text/JSON)
	        // this.responseXML holds any returned XML (including SOAP)
	        // this.responseData holds any returned binary data
	        Ti.API.info(this.responseText);
	        var bountyList = JSON.parse(this.responseText);
	        _callbackFn(bountyList);
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('error');
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();  // request is actually sent with this statement
};

exports.bustFugitive = function(_macAddress,_callbackFn) {
	Ti.API.info('busting fugitive for '+_macAddress);
	var url = "http://bountyhunterapp.appspot.com/bounties";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	      	_callbackFn(this.responseText);
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("POST", url);
	xhr.send({udid:_macAddress});  // request is actually sent with this statement
};
