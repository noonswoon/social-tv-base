exports.fetchACSDataOrCache = function(key, acsCallback, acsParam, eventToFire, cacheTimeout) {
	if(!Ti.App.Properties.hasProperty(key)) { //do some caching
		//Ti.API.info('never cache, do acs call '+key);
		acsCallback(acsParam); //never fetch before
		var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss"); 
		Ti.App.Properties.setString(key,nowStr);
	} else {
		var cacheDateStr = Ti.App.Properties.getString(key);
		var cacheDate = moment(cacheDateStr,"YYYY-MM-DDTHH:mm:ss");		
		var elapsedTime = moment().diff(cacheDate,'minutes');
		if (elapsedTime < cacheTimeout) { //if still in cache, just fire event
			//Ti.API.info('cache and able to bypass: '+key);
			Ti.App.fireEvent(eventToFire); //fire event that signifies that db already loaded
		}
		else { //cache is out-of-date, fetching new data from server
			//Ti.API.info('cache stale..need to do acs call: '+key);
			acsCallback(acsParam);
			//pull data and reset cache
			var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss"); 
			Ti.App.Properties.setString(key,nowStr);
		}
	}	
};

exports.getTimeLastFetchedTVProgramACS = function() {
	if(Ti.App.Properties.hasProperty('timeLastFetchedTVProgramACS')) {
		return Ti.App.Properties.getString('timeLastFetchedTVProgramACS');
	} else {
		var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss"); 
		Ti.App.Properties.setString('timeLastFetchedTVProgramACS',nowStr);
		return nowStr;
	}
};

exports.setTimeLastFetchedTVProgramACS = function() {
	var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss"); 
	Ti.App.Properties.setString('timeLastFetchedTVProgramACS',nowStr);
};

exports.resetCacheTime = function(key) {
	if(Ti.App.Properties.hasProperty(key)) {
		var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss"); 
		Ti.App.Properties.setString(key,nowStr);
	}
};

exports.getCacheTime = function(key) {
	if(Ti.App.Properties.hasProperty(key)) { //do some caching
		var cacheDateStr = Ti.App.Properties.getString(key);
		var cacheDate = moment(cacheDateStr,"YYYY-MM-DDTHH:mm:ss");
		return cacheDate;
	}
};


exports.levelUpCache = function(_user,_title) {
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
	}
};