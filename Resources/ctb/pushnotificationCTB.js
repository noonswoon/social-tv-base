//create for user in the first time log in
exports.pushNotificationCTB_createUserInfo = function(_userid,_username,_pnDeviceToken) {
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			alert('responseText: '+this.responseText);
		},
		onerror:function(e) {
			alert('cannot register pn to ctb server: '+e);
		}
	}); 
	
	// Register device token with UA
	xhr.open('POST', 'http://localhost:3000/push_notification_details/create.json', true);
	xhr.setRequestHeader("Content-Type","application/json");
	
	var sendParameters = {
	    'userid': _userid,
	    'username': _username,
	    'pn_device_token': _pnDeviceToken
	};
	xhr.send(JSON.stringify(sendParameters));
};

exports.pushNotificationCTB_getPNPermissions = function(_userid){
	var url = 'http://localhost:3000/push_notification_details/get_pn_permissions/'+_userid+'.json';
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			var responseJSON = JSON.parse(this.responseText); 
			var userPNPermissions = responseJSON['user_pn_permissions'];
			Ti.App.fireEvent('fetchedUserPNPermissions',{userPNPermissions:userPNPermissions});
		},
		onerror:function(e) {
			alert('cannot get comment permission pn to ctb server: '+e);
		}
	}); 

	xhr.open('GET', url, true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.send();
};

exports.pushNotificationCTB_isAllowToSendWhenGetComment = function(_userid){
	var url = 'http://localhost:3000/push_notification_details/is_allow_to_send_when_get_comment/'+_userid+'.json';
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			alert('responseText: '+this.responseText);
		},
		onerror:function(e) {
			alert('cannot get comment permission pn to ctb server: '+e);
		}
	}); 

	xhr.open('GET', url, true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.send();
};

exports.pushNotificationCTB_isAllowToSendWhenGetComment = function(_userid){
	var url = 'http://localhost:3000/push_notification_details/is_allow_to_send_when_friend_checkin/'+_userid+'.json';
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			alert('responseText: '+this.responseText);
		},
		onerror:function(e) {
			alert('cannot get friendCheckin permission pn to ctb server: '+e);
		}
	}); 
	
	xhr.open('GET', url, true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.send();
};

exports.pushNotificationCTB_updatePNPermission = function(_userid,_permissionValue,_permissionType) {
	var url = 'http://localhost:3000/push_notification_details/update_notify_permission/'+_userid+'.json';
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			Ti.API.info('update pnPermission (type='+_permissionType+') success for '+_userid);
		},
		onerror:function(e) {
			Ti.API.info('cannot update pnPermission (type='+_permissionType+') to ctb server: '+JSON.stringify(e));
		}
	}); 
	// Register device token with UA
	xhr.open('PUT', url, true);
	xhr.setRequestHeader("Content-Type","application/json");
	
	var sendParameters = null; 
	if(_permissionType === 1) //getCommentPermission
		sendParameters = {'push_notification_detail': {'notify_when_comment':_permissionValue}};
	else if(_permissionType === 2) //friendCheckinPermission
		sendParameters = {'push_notification_detail': {'notify_when_friend_checkin':_permissionValue}};
	
	xhr.send(JSON.stringify(sendParameters));
};

exports.pushNotificationCTB_sendPN = function(_userid,_pnSendingType,_messageToSend) {
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			alert('responseText: '+this.responseText);
		},
		onerror:function(e) {
			alert('cannot send pn from ctb server: '+JSON.stringify(e));
		}
	}); 
	
	// Register device token with UA
	xhr.open('POST', 'http://localhost:3000/push_notification_details/send_notification.json', true);
	xhr.setRequestHeader("Content-Type","application/json");
	
	var sendParameters = {
	    'userid': _userid,
	    'pn_sending_type':_pnSendingType,
	    'message_to_send':_messageToSend
	};
	xhr.send(JSON.stringify(sendParameters));
};

