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
	xhr.open('POST', 'http://localhost:3000/push_notification_details/create', true);
	xhr.setRequestHeader("Content-Type","application/json");
	
	var sendParameters = {
	    'userid': _userid,
	    'username': _username,
	    'pn_device_token': _pnDeviceToken
	};
	xhr.send(JSON.stringify(sendParameters));
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
	// Register device token with UA
	xhr.open('GET', url, true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.send();
};

exports.notificationTrackACS_updateCommentAllowance = function(_id,_value) {
	Cloud.Objects.update({
	    classname: 'NotificationTracking',
	    id: _id,
	    fields: {
	        comment: _value,
	    }
	}, function (e) {
	    if (e.success) {
	    	Ti.API.info('comment value has been changed: '+e.NotificationTracking[0].comment);
	    } else {
	        alert('notificationTrackACS_updateCommentAllowance Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};

exports.notificationTrackACS_updateFriendCheckinAllowance = function(_id,_value) {
	Cloud.Objects.update({
	    classname: 'NotificationTracking',
	    id: _id,
	    fields: {
	        friendCheckin: _value,
	    }
	}, function (e) {
	    if (e.success) {
	    	Ti.API.info('friendCheckin value has been changed: '+e.NotificationTracking[0].friendCheckin);
	    } else {
	        alert('notificationTrackACS_updateFriendCheckinAllowance Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};
