function ProductMainWindow() {
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Product",
		barColor: '#6d0a0c'
	});
	
	return self;
}

module.exports = ProductMainWindow;