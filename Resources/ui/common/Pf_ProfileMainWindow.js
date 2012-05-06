function ProfileMainWindow() {
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Profile",
		barColor: '#6d0a0c'
	});
	
	return self;
}

module.exports = ProfileMainWindow;