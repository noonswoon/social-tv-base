
var setBadgeOfShowPermission = function(_permissions) {
	for(var i=0;i<_permissions.length;i++) {
		if(!Ti.App.Properties.hasProperty(_permissions[i].program_id+'allowance')) {
			Ti.App.Properties.setBool(_permissions[i].program_id+'allowance',_permissions[i].isAllowed);
		} else {
			var permission = Ti.App.Properties.getBool(_permissions[i].program_id+'allowance');
			if(permission!==_permissions[i].isAllowed) 
				Ti.App.Properties.setBool(_permissions[i].program_id+'allowance',_permissions[i].isAllowed);
		}
	}
	Ti.App.fireEvent('badgeShowPermissionLoaded');
}

exports.getBadgeOfShowPermission = function(_programId) {
	var permission = Ti.App.Properties.getBool(_programId+'allowance');
	if(permission) return true;
	else return false;
}

exports.badgeShowPermissionACS_fetchedPermission = function() {
	Cloud.Objects.query({
		classname: 'BadgeShowPermission',	
	    page: 1,
	    per_page: 100,
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
	        alert('badgeShowPermissionACS/fetchedPermission Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    	 }
		});
};
