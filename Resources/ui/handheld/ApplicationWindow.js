
function ApplicationWindow(_isCaptured) {
	var LoginWindow = require('ui/common/LoginWindow');	
	var loginwindow = new LoginWindow();
	return loginwindow
};

module.exports = ApplicationWindow;