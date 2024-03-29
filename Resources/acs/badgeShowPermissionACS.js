
var setBadgeOfShowPermission = function(_permissions) {
	for(var i=0;i<_permissions.length;i++) {
		Ti.App.Properties.setBool(_permissions[i].program_id+'allowance',_permissions[i].isAllowed);
	}
	Ti.App.fireEvent('badgeShowPermissionLoaded');
}

exports.getBadgeOfShowPermission = function(_programId) {
	var permission = Ti.App.Properties.getBool(_programId+'allowance');
	return permission;
}

exports.badgeShowPermissionACS_fetchedPermission = function() {
	Cloud.Objects.query({
		classname: 'BadgeShowPermission',	
	    page: 1,
	    per_page: 100,
	    response_json_depth: 1
	}, function (e) {
	    if (e.success) {
	    	var permission =[];
	        for (var i = 0; i < e.BadgeShowPermission.length; i++) {
	        	 var curAllowed = e.BadgeShowPermission[i];
	        	 permission.push(curAllowed);
	         }
	         setBadgeOfShowPermission(permission);
	    } 
	    else {
	        Debug.debug_print('badgeShowPermissionACS/fetchedPermission Error: ' + JSON.stringify(e));
	        ErrorHandling.showNetworkError();
	    }
	});
};
