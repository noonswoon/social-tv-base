function badgeSort(a,b) {
	return a.custom_fields.badgeID - b.custom_fields.badgeID;
}

exports.fetchedBadges = function(_paramsArray  /*unused*/) {
	Cloud.Photos.query({
	    page: 1,
	    per_page: 100,
	    where: {tag: "badge"},
	    response_json_depth: 1
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
	        Debug.debug_print('badgesACS fetchedBadges Error: ' +
	            ((e.error && e.message) || JSON.stringify(e)));
	        alert('ERROR: '+'badgesACS_fetchedBadges');
	        ErrorHandling.showNetworkError();
	    }
	});
};
