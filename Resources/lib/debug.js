var DO_ALERT_DIALOG = false;
exports.debug_print = function(printStr) {
	if(DO_ALERT_DIALOG) alert(printStr);
	else Ti.API.info(printStr);
};


