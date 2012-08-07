
exports.myBadgeACS_fetchedBadge = function(_id) {
	Cloud.Objects.query({
	classname: 'BadgeUnlock',	
    page: 1,
    per_page: 20,
    order: 'badge_id',
    where: {user_id: _id},
    response_json_depth: 1
	}, function (e) {
	    if (e.success) {
	    	myBadges = [];
	        for (var i = 0; i < e.BadgeUnlock.length; i++) {
	        	 var curBadge = e.BadgeUnlock[i];
	              myBadges.push(curBadge);
	        }
			Ti.App.fireEvent('myBadgesLoaded'+_id,{fetchedMyUnlockBadges:myBadges});
	    } 
	    else {
	        Debug.debug_print('myBadgeACS-> fetchedBadge Error: ' + JSON.stringify(e));
	       	//ErrorHandling.showNetworkError();
	    }
	});
		
};

exports.myBadgeACS_createNewBadge = function(_userID,_badgeID){
	Ti.API.info('myBadgeACS_createNewBadge');
	Cloud.Objects.create({
    classname: 'BadgeUnlock',
    fields: {
        user: _userID,
        badge_id: _badgeID
	    }
	}, function (e) {
	    if (e.success) {
	        var badgeUnlock = e.BadgeUnlock[0];
			Ti.App.fireEvent('newBadgeUnlock'+_userID, {badgeID: badgeUnlock.badge_id});   
	    } else {
	        Debug.debug_print('myBadgeACS->createNewBadge: Error: ' + JSON.stringify(e));
	        ErrorHandling.showNetworkError();
	    }
	});
};
