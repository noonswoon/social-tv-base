var getLatestCheckinTime = function() {
	if(Ti.App.Properties.hasProperty('latestCheckinTime'))
		return Ti.App.Properties.getString('latestCheckinTime');
	else {
		var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss");
		Ti.App.Properties.setString('latestCheckinTime',nowStr);
		return nowStr;
	}
}
exports.getLatestCheckinTime = getLatestCheckinTime;

var setLatestCheckinTime = function() {
	var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss");
	Ti.App.Properties.setString('latestCheckinTime',nowStr);
};
exports.setLatestCheckinTime = setLatestCheckinTime;

exports.getCurrentSelectedProgram = function() {
	var startOfToday = moment().sod().format("YYYY-MM-DDTHH:mm:ss");
	var lastCheckinTime = getLatestCheckinTime();
	if(lastCheckinTime <= startOfToday) { //checkin already expired
		Ti.App.Properties.setString('currentSelectedProgram','');
		Ti.API.info('run getCurrentSelectedProgram, expire program, return empty str');
		return '';
	} else {
		if(Ti.App.Properties.hasProperty('currentSelectedProgram')) {
			Ti.API.info('run getCurrentSelectedProgram: valid time: '+Ti.App.Properties.getString('currentSelectedProgram'));
			return Ti.App.Properties.getString('currentSelectedProgram');
		}
		else {
			Ti.API.info('run getCurrentSelectedProgram: valid time, no property');
			Ti.App.Properties.setString('currentSelectedProgram','');
			return '';
		}
	}
};

exports.setCurrentSelectedProgram = function(newSelectedProgram) {
	Ti.API.info('run setCurrentSelectedProgram: '+newSelectedProgram);
	Ti.App.Properties.setString('currentSelectedProgram',newSelectedProgram);
	setLatestCheckinTime();
};

exports.getCurrentCheckinPrograms = function() {
	var startOfToday = moment().sod().format("YYYY-MM-DDTHH:mm:ss");
	var lastCheckinTime = getLatestCheckinTime();
	if(lastCheckinTime <= startOfToday) { //checkin already expired
		Ti.App.Properties.setList('currentCheckinPrograms',[]);
		Ti.API.info('run getCurrentCheckinPrograms, expire programData, return []');
		return [];
	} else {
		if(Ti.App.Properties.hasProperty('currentCheckinPrograms')) {
			Ti.API.info('run getCurrentCheckinPrograms: valid time: '+JSON.stringify(Ti.App.Properties.getList('currentCheckinPrograms')));
			return Ti.App.Properties.getList('currentCheckinPrograms');
		}
		else {
			Ti.API.info('run getCurrentCheckinPrograms: valid time, no property');
			Ti.App.Properties.setList('currentCheckinPrograms',[]);
			return [];
		}
	}
};

exports.setCurrentCheckinPrograms = function(checkinPrograms) {
	Ti.App.Properties.setList('currentCheckinPrograms',checkinPrograms);
	setLatestCheckinTime();
};
