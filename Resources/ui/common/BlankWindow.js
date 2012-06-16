var BlankWindow = function() {
	
	//UI STUFF
	var win = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/admin/cb_back.png',
		barColor: '#398bb0',
		layout: 'vertical',
		tabBarHidden: true,
		navBarHidden: false
	});
		
	return win;
};

module.exports = BlankWindow;

