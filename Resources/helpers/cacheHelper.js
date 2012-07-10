exports.fetchACSDataOrCache = function(key, acsCallback, acsParam, eventToFire) {
	if(!Ti.App.Properties.hasProperty(key)) { //do some caching
		acsCallback(acsParam); //never fetch before
		var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss"); 
		Ti.App.Properties.setString(key,nowStr);
	} else {
		var cacheDateStr = Ti.App.Properties.getString(key);
		var cacheDate = moment(cacheDateStr,"YYYY-MM-DDTHH:mm:ss");		
		var elapsedTime = moment().diff(cacheDate,'minutes');
		if (elapsedTime < CACHE_TIMEOUT_IN_MINUTES) { //if still in cache, just fire event
			Ti.App.fireEvent(eventToFire);
		}
		else { //cache is out-of-date, fetching new data from server
			acsCallback(acsParam);
			//pull data and reset cache
			var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss"); 
			Ti.App.Properties.setString(key,nowStr);
		}
	}	
}

exports.resetCacheTime = function(key) {
	if(Ti.App.Properties.hasProperty(key)) {
		var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss"); 
		Ti.App.Properties.setString(key,nowStr);
	}
}

exports.getCacheTime = function(key) {
	if(Ti.App.Properties.hasProperty(key)) { //do some caching
		var cacheDateStr = Ti.App.Properties.getString(key);
		var cacheDate = moment(cacheDateStr,"YYYY-MM-DDTHH:mm:ss");
		return cacheDate;
	}
}


exports.levelUpCache = function(_user,_title) {
	Ti.API.info('levelUpCache');
	if(!Ti.App.Properties.hasProperty(_user)) {
		Ti.App.Properties.setString(_user,_title);
		Ti.API.info('first time setting //level: '+_title);
	} else {
		var levelTitle = Ti.App.Properties.getString(_user);
		if(levelTitle !== _title) {
			Ti.App.Properties.setString(_user,_title);
			var FacebookSharing = require('helpers/facebookSharing');
			FacebookSharing.levelUpPopUpOnFacebook(_title);
		}
		else Ti.API.info(_user+' level: '+_title+' .....not yet LV up');
	}
}