var BlankWindow = function() {
	
	//UI STUFF
	var win = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		barColor: '#6d0a0c',
		layout: 'vertical'
	});
		
	return win;
};

module.exports = BlankWindow;

