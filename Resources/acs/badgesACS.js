//pull all badges description and img url
allBadges = []

exports.BadgesACS_fetchedBadges = function() {
	Ti.API.info('call BadgesACS_fetchedBadges');
	Cloud.Objects.query({
	classname: 'Badges',	
    page: 1,
    per_page: 20
	}, 
	function (e) {
    if (e.success) {
    	 Ti.API.info('CALL ALL BADGES SUCCESS');
        for (var i = 0; i < e.Badges.length; i++) {
        	 var curBadge = e.Badges[i];
              allBadges.push(curBadge);
         }
         Ti.API.info('fire event BadgesLoaded');
		Ti.App.fireEvent('BadgesLoaded',{fetchedMyBadges:allBadges});
    } 
    else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};