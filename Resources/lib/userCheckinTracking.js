exports.getCurrentSelectedProgram = function() {
	if(Ti.App.Properties.hasProperty('currentSelectedProgram'))
		return Ti.App.Properties.getString('currentSelectedProgram');
	else {
		Ti.App.Properties.setString('currentSelectedProgram','');
		return '';
	}
}

exports.setCurrentSelectedProgram = function(newSelectedProgram) {
	Ti.App.Properties.setString('currentSelectedProgram',newSelectedProgram);
}

exports.getCurrentCheckinPrograms = function() {
	if(Ti.App.Properties.hasProperty('currentCheckinPrograms'))
		return Ti.App.Properties.getList('currentCheckinPrograms');
	else {
		Ti.App.Properties.setList('currentCheckinPrograms',[]);
		return [];
	}
}

exports.setCurrentCheckinPrograms = function(checkinPrograms) {
	Ti.App.Properties.setList('currentCheckinPrograms',checkinPrograms);
}

exports.getLatestCheckinTime = function() {
	if(Ti.App.Properties.hasProperty('latestCheckinTime'))
		return Ti.App.Properties.getString('latestCheckinTime');
	else {
		var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss");
		Ti.App.Properties.setString('latestCheckinTime',nowStr);
		return nowStr;
	}
}

var setLatestCheckinTime = function() {
	var nowStr = moment().format("YYYY-MM-DDTHH:mm:ss");
	Ti.App.Properties.setString('latestCheckinTime',nowStr);
};
exports.setLatestCheckinTime = setLatestCheckinTime;


