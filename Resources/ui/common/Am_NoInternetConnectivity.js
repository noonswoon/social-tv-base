var NoInternetConnect = function() {
		
	//UI STUFF
	var self = Ti.UI.createWindow({
		backgroundColor:'#000',
		backgroundImage:'images/admin/no_internet.png',
		opacity: 1.0,
		title: "No Internet Connection",
		layout: 'vertical',
		tabBarHidden: true,
		navBarHidden: true
	});

	return self;
};

module.exports = NoInternetConnect;

