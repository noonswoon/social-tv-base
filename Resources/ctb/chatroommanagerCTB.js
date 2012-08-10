exports.chatroomManagerCTB_getChatroomData = function(_serverUrl, _serverAccess, _chatroomId){
	var url = _serverUrl +'chatroom_managers/get_chatroom_number_users/'+_chatroomId+'.json';
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			var responseJSON = JSON.parse(this.responseText); 
			var chatroomNumberUsers = responseJSON['chatroom_number_users'];
			Ti.API.info('chatroomId: '+_chatroomId+' has active users: '+chatroomNumberUsers);
//			Ti.App.fireEvent('fetchedUserPNPermissions',{userPNPermissions:userPNPermissions});
		},
		onerror:function(e) {
			Ti.API.info('cannot get data from chatroomId: '+_chatroomId+', error: '+JSON.stringify(e));
		}
	}); 

	xhr.open('GET', url, true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.setRequestHeader('Authorization','Basic '  + Titanium.Utils.base64encode(_serverAccess));
	xhr.send();
};

exports.chatroomManagerCTB_updateNumberUsers = function(_serverUrl, _serverAccess, _chatroomId,_value) {
	var url = _serverUrl+'chatroom_managers/increment_number_users/'+_chatroomId+'.json';
	if(_value < 0)
		url = _serverUrl+'chatroom_managers/decrement_number_users/'+_chatroomId+'.json';

	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			Ti.API.info('increment userNumbers in '+_chatroomId);
		},
		onerror:function(e) {
			Ti.API.info('cannot update userNumbers in '+_chatroomId+', error: '+JSON.stringify(e));
		}
	}); 
	// Register device token with UA
	xhr.open('PUT', url, true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.setRequestHeader('Authorization','Basic '  + Titanium.Utils.base64encode(_serverAccess));	
	xhr.send();
};
