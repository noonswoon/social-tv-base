var BlankWindow = function() {
	
	//UI STUFF
	var win = Ti.UI.createWindow({
		backgroundColor:'transparent',
		//backgroundImage: '/images/admin/cb_back.png',
		//barColor: '#398bb0',
		layout: 'vertical',
		tabBarHidden: true,
		navBarHidden: false
	});
	win.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#d2d1d0', offset: 0.0}, { color: '#fffefd', offset: 1.0 }]
	};		
		
		
	return win;
};

module.exports = BlankWindow;

