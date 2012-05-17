//pull all badges description and img url
allBadges = []

function badgeSort(a,b) {
	return a.badge_id - b.badge_id;
}
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
    	 var badgesCollection = e.Badges; 
    	badgesCollection.sort(badgeSort);
       for (var i = 0; i < badgesCollection.length; i++) {
        	 var curBadge = badgesCollection[i];
              allBadges.push(curBadge);
         }
		Ti.App.fireEvent('BadgesLoaded',{fetchedMyBadges:allBadges});
    } 
    else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};