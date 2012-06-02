function ProductMainWindow() {
	
	var ProductMainWindow = require('ui/common/Pd_ProductMainWindowTableViewRow');
	
	var self = Titanium.UI.createWindow({
		title: "Product",
		backgroundImage: '/images/grain.png',
	});

	var productSelectProgramToolbar = Ti.UI.createView({
		top: 0,
		height: 40,
		backgroundGradient: {			
	        	type: 'linear',
	        	startPoint: { x: '0%', y: '0%' },
	        	endPoint: { x: '0%', y: '100%' },
	        	colors: [ { color: '#fff', offset: 0.0}, { color: '#d0d0d0', offset: 1.0 } ]}
	});
	self.add(productSelectProgramToolbar);
	
	var productSelectProgramButton = Ti.UI.createButton({
		width: 30,
		height: 30,
		right: 10,
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		color: 'green',
		image: 'images/icon/dropdownButton.png',
  		borderRadius: 10,
  		borderColor: '#a4a4a4',
  		borderWidth: 1
	});
	productSelectProgramToolbar.add(productSelectProgramButton);
	
	var watchLabel = Ti.UI.createLabel({
		color: '#8c8c8c',
		width: 70,
		height: 50,
		right: 45,
		textAlign: 'right',
		text: 'WATCH',
		font:{fontSize: 11}
	});
	productSelectProgramToolbar.add(watchLabel);	
	
	var productTableView = Ti.UI.createTableView();
	self.add(productTableView);
	
	var viewRowData = [];
	var row = new ProductMainWindow();
	viewRowData.push(row);
	
	productTableView.setData(viewRowData);
	
	return self;
}

module.exports = ProductMainWindow;