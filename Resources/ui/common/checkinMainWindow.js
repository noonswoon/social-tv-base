function Checkin(_program, containingTab){
	
	var self = Ti.UI.createWindow({
		title: 'Check in',
		backgroundColor: 'orange'
	});
	
	self.showNavBar();
	return self;
	
}
module.exports = Checkin;
