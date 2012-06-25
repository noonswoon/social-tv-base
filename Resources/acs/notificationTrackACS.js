//create for user in the first time log in
exports.notificationTrackACS_createUserInfo = function(_id) {
	Cloud.Objects.create({
	    classname: 'NotificationTracking',
		fields: {
        	user: _id,
        	comment: 1,
        	friendCheckin: 1
    	}
	}, function (e) {
	    if (e.success) {
	        var track = e.NotificationTracking[0];
	       Ti.API.info('Success:\\n' +
	            'id: ' + track.user.id + '\\n' +
	            'comment: ' + track.comment + '\\n' +
	            'friendCheckin: ' + track.friendCheckin);
	            Ti.API.info("create user notification: "+track.user.username);
	    } else {
	        alert('notificationTrackACS_createUserInfo Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};

exports.notificationTrackACS_fetchedAllowance = function(_id){
	Cloud.Objects.query({
		classname: 'NotificationTracking',	
	    page: 1,
	    per_page: 1,
	    where: {"user_id": _id}
	}, function (e) {
	    if (e.success) {
	    	Ti.API.info('success: '+e.NotificationTracking[0].id+'\\n'
	    	+'comment: '+e.NotificationTracking[0].comment+'\\n'
	    	+'friendCheckin: '+e.NotificationTracking[0].friendCheckin);
			Ti.App.fireEvent('fetchedAllowance',{fetchedNotification:e.NotificationTracking[0]});
	    } else {
			alert('notificationTrackACS_fetchedAllowance Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    	 }
	});
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
