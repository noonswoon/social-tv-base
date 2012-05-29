var badges = []

function badgeSort(a,b) {
	return a.custom_fields.badgeID - b.custom_fields.badgeID;
}

exports.fetchedBadges = function() {
	Cloud.Photos.query({
	    page: 1,
	    per_page: 20,
	    where: {tag: "badge"}
	}, function (e) {
	    if (e.success) {
	    	var badgesCollection = e.photos; 
    		badgesCollection.sort(badgeSort);
			for (var i = 0; i < e.photos.length; i++) {
				var photo = e.photos[i];    
	            badges.push(photo);
			}
			Ti.App.fireEvent('badgeLoaded',{fetchedBadges:badges});
	    }
	    else {
	        alert('Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};
