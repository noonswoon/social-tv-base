
var setAppProperties_permission = function(_permissions) {
	Ti.API.info('_permissions.length = '+_permissions.length);
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

exports.getAppProperties_permission = function(_program_id) {
	var permission = Ti.App.Properties.getBool(_program_id+'allowance');
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
	        	 Ti.API.info('Show allowed to get badge #'+i+': '+curAllowed.program_id);
	               permission.push(curAllowed);
	         }
	         setAppProperties_permission(permission);
	    } 
	    else {
	        alert('badgeShowPermissionACS/fetchedPermission Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    	 }
		});
};
