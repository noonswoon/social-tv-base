var NoInternetConnect = function() {
		
	//UI STUFF
	var self = Ti.UI.createWindow({
		backgroundColor:'transparent',
		opacity: 1.0,
		title: "No Internet Connection",
		layout: 'vertical',
		tabBarHidden: true,
		navBarHidden: true
	});
	self.backgroundGradient = {
      	type: 'linear',
       	startPoint: { x: '0%', y: '100%' },
       	endPoint: { x: '0%', y: '0%' },
       	colors: [ { color: '#ffffff', offset: 0.0}, { color: '#d1d1d1', offset: 1.0 } ]
 	};
	var noInternetImage = Ti.UI.createImageView({
		image:'images/admin/no_internet.png',
		top: 100,
	});
	
	//ADDING UI COMPONENTS TO WINDOW
	self.add(noInternetImage);
	return self;
};

module.exports = NoInternetConnect;

