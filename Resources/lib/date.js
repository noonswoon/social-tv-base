
function since(dateMomentObj) {

	var pluralize = function (base, number) {
		if (number == 1) return base;
		else return base + L("s");
	}
	
	var blocks = [
		{ divisor: 1, max: 60, name: L('sec') },
		{ divisor: 60, max: 60, name: L('min') },
		{ divisor: 60, max: 24, name: L('hr') },
		{ divisor: 24, max: 30, name: L('day') },
		{ divisor: 30, max: 12, name: L('mon') },
		{ divisor: 12, max: 100, name: L('year') }
	];

	var unit = moment().diff(dateMomentObj,'seconds');
	for (var i=0;i<blocks.length;i++) {
		unit = parseInt(unit / blocks[i].divisor);
		if (unit < blocks[i].max) {
			if(unit <= 0) return L('just now');
			else return unit + ' ' + pluralize(blocks[i].name,unit) +" "+L('ago');
		}
	}
};

function convertACSTimeToLocalTime(_datetimeStr) {
	var curCountryCode = Ti.Locale.getCurrentCountry(); 
	var result = _datetimeStr; 
	//if(curCountryCode === "TH" || curCountryCode === "US") {
	var dm = moment(_datetimeStr, "YYYY-MM-DDTHH:mm:ss");
	dm.add('hours',7);
	result = dm.format("YYYY-MM-DDTHH:mm:ss");
	/*} else {
		var unsupportDialog = Titanium.UI.createAlertDialog({
			title:'Unsupported Region',
			message:'Chatterbox has not reached your country yet. But very soon!'
		});
		unsupportDialog.show();
		Debug.debug_print('have not implementd the country: '+curCountryCode);
	}*/
	return result
};

function convertLocalTimeToACSTime(_datetimeStr) {
	var curCountryCode = Ti.Locale.getCurrentCountry(); 
	var result = _datetimeStr; 
	//if(curCountryCode === "TH" || curCountryCode === "US") {
	var dm = moment(_datetimeStr, "YYYY-MM-DDTHH:mm:ss");
	dm.subtract('hours',7);
	result = dm.format("YYYY-MM-DDTHH:mm:ss");
	return result
};
