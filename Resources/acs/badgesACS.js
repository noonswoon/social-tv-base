function badgeSort(a,b) {
	return a.custom_fields.badgeID - b.custom_fields.badgeID;
}

exports.fetchedBadges = function() {
	Cloud.Photos.query({
	    page: 1,
	    per_page: 100,
	    where: {tag: "badge"}
	}, function (e) {
	    if (e.success) {
	    	var badges = [];
	    	var badgesCollection = e.photos; 
    		badgesCollection.sort(badgeSort);
			for (var i = 0; i < e.photos.length; i++) {
				var photo = e.photos[i];    
	            badges.push(photo);
			}
			Ti.App.fireEvent('badgeLoaded',{fetchedBadges:badges});
	    }
	    else {
	        Ti.API.info('badgesACS fetchedBadges Error: ' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};
