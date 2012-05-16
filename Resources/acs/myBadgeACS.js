myBadges = [];

exports.myBadgeACS_fetchedBadge = function(_id) {
	Ti.API.info('call myBadgeACS_fetchedBadge');
	Cloud.Objects.query({
	classname: 'BadgeUnlock',	
    page: 1,
    per_page: 20,
    order: 'badge_id',
    //call only my badge
    where: {user_id: _id},
}, function (e) {
    if (e.success) {
        for (var i = 0; i < e.BadgeUnlock.length; i++) {
        	 var curBadge = e.BadgeUnlock[i];
            Ti.API.info('Success:\\' +
            	curBadge.user.username +' got #' + curBadge.badge_id);
              myBadges.push(curBadge);
         }
		Ti.App.fireEvent('myBadgesLoaded',{fetchedMyUnlockBadges:myBadges});
    } 
    else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
		
};

exports.myBadgeACS_createNewBadge = function(_userID,_badgeID){
	Cloud.Objects.create({
    classname: 'BadgeUnlock',
    fields: {
        user: _userID,
        badge_id: _badgeID
	    }
	}, function (e) {
	    if (e.success) {
	        var badgeUnlock = e.BadgeUnlock[0];
	       Ti.API.info('Success:\\n' +
	            'id: ' + badgeUnlock .id + '\\n' +
	            'user: ' + badgeUnlock.user.id + '\\n' +
	            'badgeID: ' + badgeUnlock.badge_id);
			Ti.App.fireEvent('updatedMyBadge',{
			badgeID: badgeUnlock.badge_id
			});	        
	    } else {
	        alert('Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};
