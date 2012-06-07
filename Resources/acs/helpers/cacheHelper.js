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

