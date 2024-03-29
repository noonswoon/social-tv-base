exports.activityACS_fetchedMyActivity = function(_id) {
	var targetUser = [];
	targetUser.push(_id);
	Cloud.Objects.query({
		classname: 'Activity',	
	    page: 1,
	    per_page: 10,
	    order: '-created_at',
	    where: {"targetedUserID": {"$in": targetUser}},
	    response_json_depth: 2
	}, function (e) {
	    if (e.success) {
			recentActivity = [];
			for(var i=0; i<e.Activity.length && i< 10; i++) {
				var curActivity = e.Activity[i];
				curActivity.updated_at = convertACSTimeToLocalTime(curActivity.updated_at);
				recentActivity.push(curActivity);
			}
			Ti.App.fireEvent('activityLoaded'+_id,{fetchedActivity:recentActivity});
	    } else {
	        Debug.debug_print('activityACS_fetchMyActivity Error:  ' + JSON.stringify(e));
	    	ErrorHandling.showNetworkError();
	   	}
	});	
};

exports.activityACS_createMyActivity  = function(_activity,local_id) {
	Cloud.Objects.create({
	    classname: 'Activity',
		fields: {
        	user: _activity.user_id,
			targetedUserID: _activity.targetedUserID,
			category: _activity.category,
			targetedObjectID:_activity.targetedObjectID,
			additionalData: _activity.additionalData,
			custom_fields: {local_id: local_id},
   		}
	}, function (e) {
	    if (e.success) {
	        var activity = e.Activity[0];
	        Ti.App.fireEvent('updateAnActivity'+e.Activity[0].user.id,{fetchedAnActivity:activity}); //fetched back with local id:)

	    } else {
	        Debug.debug_print('activityACS_createActivity - Error: ' + JSON.stringify(e));
	        ErrorHandling.showNetworkError();
	    }
	});
};
