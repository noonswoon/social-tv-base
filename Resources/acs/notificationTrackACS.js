exports.notificationTrackACS_fetchedAllowance = function(_id){
	Cloud.Objects.query({
		classname: 'NotificationTracking',	
	    page: 1,
	    per_page: 1,
	    where: {"user_id": _id}
	}, function (e) {
	    if (e.success) {
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
