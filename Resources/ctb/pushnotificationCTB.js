//create for user in the first time log in
var chatterboxPNBackendAccess = 'chatterbox:d1srupt'
var pnServer = 'http://morning-cloud-6017.herokuapp.com/';

exports.pushNotificationCTB_createUserInfo = function(_userid,_username,_pnDeviceToken) {
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			Ti.API.info(this.responseText);
		},
		onerror:function(e) {
			Ti.API.info('cannot register pn to ctb server: '+JSON.stringify(e));
		}
	}); 
	
	// Register device token with UA
	xhr.open('POST', pnServer+'push_notification_details/create.json', true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.setRequestHeader('Authorization','Basic '  + Titanium.Utils.base64encode(chatterboxPNBackendAccess));
	
	var sendParameters = {
	    'userid': _userid,
	    'username': _username,
	    'pn_device_token': _pnDeviceToken
	};
	xhr.send(JSON.stringify(sendParameters));
};

exports.pushNotificationCTB_getPNPermissions = function(_userid){
	var url = pnServer+'push_notification_details/get_pn_permissions/'+_userid+'.json';
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			var responseJSON = JSON.parse(this.responseText); 
			var userPNPermissions = responseJSON['user_pn_permissions'];
			Ti.API.info(this.responseText);
			Ti.App.fireEvent('fetchedUserPNPermissions',{userPNPermissions:userPNPermissions});
		},
		onerror:function(e) {
			Ti.API.info('cannot get comment permission pn to ctb server: '+JSON.stringify(e));
		}
	}); 

	xhr.open('GET', url, true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.setRequestHeader('Authorization','Basic '  + Titanium.Utils.base64encode(chatterboxPNBackendAccess));
	xhr.send();
};

exports.pushNotificationCTB_updatePNPermission = function(_userid,_permissionValue,_permissionType) {
	var url = pnServer+'push_notification_details/update_notify_permission/'+_userid+'.json';
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
	xhr.setRequestHeader('Authorization','Basic '  + Titanium.Utils.base64encode(chatterboxPNBackendAccess));
	
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
			Ti.API.info('send pn to userId: '+_userid+' successfully. ResponseText: '+this.responseText);
		},
		onerror:function(e) {
			Ti.API.info('cannot send userId: '+_userid+' a pn from ctb server: '+JSON.stringify(e));
		}
	}); 
	
	// Register device token with UA
	xhr.open('POST', pnServer+'push_notification_details/send_notification.json', true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.setRequestHeader('Authorization','Basic '  + Titanium.Utils.base64encode(chatterboxPNBackendAccess));
	
	var sendParameters = {
	    'userid': _userid,
	    'pn_sending_type':_pnSendingType,
	    'message_to_send':_messageToSend
	};
	xhr.send(JSON.stringify(sendParameters));
};

