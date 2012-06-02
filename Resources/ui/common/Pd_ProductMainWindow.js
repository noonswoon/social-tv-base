function ProductMainWindow() {
	
	var ProductMainWindowTableViewRow = require('ui/common/Pd_ProductMainWindowTableViewRow');
	var ProductACS = require('acs/productACS');
	var Checkin = require('model/checkin');
	var ProductTabTableViewRow = require('ui/common/Pd_ProductTabTableViewRow');
	
	var dataForTab = [];
	
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

	//Popup
	var shopSelectorPopupWin = Ti.UI.createWindow({
	backgroundColor: 'black',
	left: 10, 
	top: 90, 
	width: 300,
	height: 300,
	borderWidth: 5,
	borderColor: 'black',
	borderRadius: 15,
	zIndex: 3
	});

	var triangleImage = Ti.UI.createImageView({
	image: 'images/triangle.png',
	height: 20,
	top: 30,
	left: 260
	});

	//Tab's table
	var tableViewForTab	= Ti.UI.createTableView({backgroundColor:'white' });
	
	//Add UI
	shopSelectorPopupWin.add(tableViewForTab);

	for(var i=0;i<myCurrentCheckinPrograms.length;i++){
			var ProgramIdOfCheckin = myCurrentCheckinPrograms[i];
			var programOfCheckin = new ProductTabTableViewRow(ProgramIdOfCheckin[i]);
			dataForTab.push(programOfCheckin);
		}
	tableViewForTab.setData(dataForTab);

	var productTableView = Ti.UI.createTableView({
		top: 40
	});
	self.add(productTableView);
	
	var viewRowData = [];
	ProductACS.productACS_fetchedAllProducts();
	Ti.App.addEventListener('fetchedAllProduct', function(e){
		for(var i=0;i<e.fetchedAllProduct.length;i++){
			var productOfProgram = e.fetchedAllProduct[i];
			var row = new ProductMainWindowTableViewRow(productOfProgram);
			viewRowData.push(row);
		}
	productTableView.setData(viewRowData);
	});

	//EVENT LISTENERS
	var shopSelectorToggle = true; //true means it closes
	productSelectProgramButton.addEventListener('click',function(e){
		if(shopSelectorToggle) {
			shopSelectorToggle = false;
			shopSelectorPopupWin.open();
			self.add(triangleImage);
		} else {
			shopSelectorToggle = true;
			shopSelectorPopupWin.close();
			self.remove(triangleImage);
		}
	});
	
	
	//add event listener for each tableviewrow
	for(var i=0;i<dataForTab.length;i++) {
		var curChannel = dataForTab[i];
		curChannel.addEventListener('click', function(e) {
			var index = e.index;
			if(index === 0){
				var ch3 = new ChannelInGuideWindow(index);
				self.add(ch3);				
				selectChannelLabel.text = 'CH3';
			}
			else if(index === 1){
				var ch5 = new ChannelInGuideWindow(index);
				self.add(ch5);
				selectChannelLabel.text = 'CH5';	
			}
			else if(index === 2){
				var ch7 = new ChannelInGuideWindow(index);
				self.add(ch7);
				selectChannelLabel.text = 'CH7';	
			}
			else if(index === 3){
				var ch9 = new ChannelInGuideWindow(index);
				self.add(ch9);	
				selectChannelLabel.text = 'CH9';
			}
			else if(index === 4){
				var ch11 = new ChannelInGuideWindow(index);
				self.add(ch11);	
				selectChannelLabel.text = 'CH11';
			}
			else if(index === 5){
				var thaiPBS = new ChannelInGuideWindow(index);
				self.add(thaiPBS);
				selectChannelLabel.text = 'ThaiPBS';
			}
			channelSelectorToggle = true;
			channelSelectorPopupWin.close();
			self.remove(triangleImage);
		});
	}

	
	return self;
}

module.exports = ProductMainWindow;