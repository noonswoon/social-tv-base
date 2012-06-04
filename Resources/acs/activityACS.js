exports.activityACS_fetchedMyActivity = function(_id) {
	Cloud.Objects.query({
	classname: 'Activity',	
    page: 1,
    per_page: 20,
    order: '-created_at',
    where: {user_id: _id},
}, function (e) {
    if (e.success) {
		recentActivity = [];
		for(var i=0; i<e.Activity.length || i< 20; i++){
			var curActivity = e.Activity[i];
			recentActivity.push(curActivity);
		}
//		Ti.App.fireEvent('myBadgesLoaded',{fetchedMyUnlockBadges:myBadges});
    } 
    else {
        Ti.API.info('activityACS_fetchedMyActivity Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
		
};
