function ProductMainWindow() {
	
	var ProductMainWindowTableViewRow = require('ui/common/Pd_ProductMainWindowTableViewRow');
	var ProductACS = require('acs/productACS');
	var Checkin = require('model/checkin');
	var ProductTabTableViewRow = require('ui/common/Pd_ProductTabTableViewRow');
	var TVProgram = require('model/tvprogram');
	
	var dataForTab = [];
	
	var self = Titanium.UI.createWindow({
		title: "Product",
		barImage: 'images/NavBG.png',
		backgroundImage: 'images/bg.png'
	});

	var productSelectProgramToolbar = Ti.UI.createView({
		top: 0,
		height: 44,
		backgroundImage: 'images/ToolbarBG.png'
	});
	self.add(productSelectProgramToolbar);
	
	var productSelectProgramButton = Ti.UI.createButton({
		width: 41,
		height: 34,
		right: 10,
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		image: 'images/toolbarbutton.png'
	});
	productSelectProgramToolbar.add(productSelectProgramButton);
	
	var watchLabel = Ti.UI.createLabel({
		color: '#8c8c8c',
		width: 70,
		height: 50,
		right: 55,
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
		var programCheckinId = myCurrentCheckinPrograms[i];
		var programCheckinName = TVProgram.TVProgramModel_getProgramNameWithProgramId(programCheckinId);
		var checkinProgramRow = new ProductTabTableViewRow(programCheckinId, programCheckinName);
		dataForTab.push(checkinProgramRow);
	}
	tableViewForTab.setData(dataForTab);

	var productTableView = Ti.UI.createTableView({
		top: 44,
		backgroundColor: 'transparent', 
		separatorColor: 'transparent'
	});
	self.add(productTableView);

	
	//EVENT LISTENERS
	//TODO: bad programming style here
	//need to change and close the popup window in this file
	//the current closing popup window logic are at ApplicationTabGroup files
	//somehow self's blur/close events aren't functional
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
		
	tableViewForTab.addEventListener('click',function(e){
		ProductACS.productACS_fetchedAllProducts(e.row.programId);	
		showPreloader(self,'Loading...');
	});
	
	
	Ti.App.addEventListener('fetchedAllProduct', function(e){
		var viewRowData = [];
		var totalProducts = e.fetchedAllProduct.length;
		var numRows = Math.ceil(totalProducts/2);
		
		for(var i=0;i<numRows;i++){
			var row = new ProductMainWindowTableViewRow();
			for(var j=0;j<=1;j++){
				var productIndex = i*2 + j;
				if(productIndex >= totalProducts)
					break;
				var curProduct = e.fetchedAllProduct[productIndex];
				if(j % 2==0) { //left column
					row._setProductOnLeftColumn(curProduct);
				} else { //right column
					row._setProductOnRightColumn(curProduct);
				}
			}
			viewRowData.push(row);
		}

		productTableView.setData(viewRowData);
		shopSelectorToggle = true;
		shopSelectorPopupWin.close();
		self.remove(triangleImage);	
		hidePreloader(self);
	});	

	return self;
}

module.exports = ProductMainWindow;