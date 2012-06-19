function ProductMainWindow(_programId) {
	
	var ProductMainWindowTableViewRow = require('ui/common/Pd_ProductMainWindowTableViewRow');
	var ProductACS = require('acs/productACS');
	var Checkin = require('model/checkin');
	var ProductTabTableViewRow = require('ui/common/Pd_ProductTabTableViewRow');
	var TVProgram = require('model/tvprogram');
	
	var dataForTab = [];
	var hasLoadedPicker = false;
	
	var infoForName = TVProgram.TVProgramModel_fetchProgramsWithProgramId(_programId);
	
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
	
	var callPicker = Ti.UI.createButton({
		width: 41,
		height: 34,
		right: 10,
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		image: 'images/toolbarbutton.png'
	});
	productSelectProgramToolbar.add(callPicker);
	
	var selectProgramLabel = Ti.UI.createLabel({
		text: 'Cool stuff',//infoForName[0].name,
		left: 10,
		width: 'auto',
		font: { fontSize: 18, fontFamily: 'Helvetica Neue', fontWeight: 'bold' }
	});	
	productSelectProgramToolbar.add(selectProgramLabel);

	var productTableView = Ti.UI.createTableView({
		top: 44,
		backgroundColor: 'transparent', 
		separatorColor: 'transparent'
	});
	self.add(productTableView);
	
	//Opacity window when picker is shown
	var opacityView = Ti.UI.createView({
		opacity : 0.6,
		top : 0,
		height : 120,
		zIndex : 7777,
		backgroundColor: '#000'
	});

	//Picker
	var picker_view = Titanium.UI.createView({
		height:251,
		bottom:-251,
		zIndex: 2
	});

	var cancel =  Titanium.UI.createButton({
		title:'Cancel',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});

	var done =  Titanium.UI.createButton({
		title:'Done',
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
	});

	var spacer =  Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var toolbar =  Ti.UI.iOS.createToolbar({
		top:0,
		zIndex: 3,
		items:[cancel,spacer,done]
	});

	var picker = Titanium.UI.createPicker({
		top:43
	});
		
	picker.selectionIndicator=true;	
	picker_view.add(toolbar);

	var slide_in =  Titanium.UI.createAnimation({bottom:0});
	var slide_out =  Titanium.UI.createAnimation({bottom:-251});

	callPicker.addEventListener('click',function() {
		if(!hasLoadedPicker) {
			for(var i=0;i<myCurrentCheckinPrograms.length;i++){
				var programCheckinId = myCurrentCheckinPrograms[i];
				var programCheckinInfo = TVProgram.TVProgramModel_fetchProgramsWithProgramId(programCheckinId);
				Ti.API.info('programCheckinId: '+programCheckinId+', programCheckinInfo: '+JSON.stringify(programCheckinInfo));
				var programName = programCheckinInfo[0].name;
				var program_id = programCheckinInfo[0].program_id;
				dataForPicker = [{title: programName, progId:program_id}];
				picker.add(dataForPicker);
			}
			picker_view.add(picker);
			hasLoadedPicker = true;
		}
		picker_view.animate(slide_in);
		self.add(opacityView);
	});

	cancel.addEventListener('click',function() {
		picker_view.animate(slide_out);
		self.remove(opacityView);
	});

	done.addEventListener('click',function() {
		picker_view.animate(slide_out);
		self.remove(opacityView);
		
		selectProgramLabel.text = picker.getSelectedRow(0).title;
		var idOfProgram = picker.getSelectedRow(0).progId;
		ProductACS.productACS_fetchedAllProducts(idOfProgram);
	});

	self.add(picker_view);
///////////////////////////////////////////////////////////////

	var unavailable = Ti.UI.createLabel({
		text: 'Sorry, product is not available',
		color: 'white',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: 'bold' }
	});

	ProductACS.productACS_fetchedAllProducts(_programId);

	Ti.App.addEventListener('fetchedAllProduct', function(e){
		
		self.remove(unavailable);
		
		var viewRowData = [];
		var totalProducts = e.fetchedAllProduct.length;
		var numRows = Math.ceil(totalProducts/2);
		
		if(totalProducts == 0){
			self.add(unavailable);
		}
		else{
			for(var i=0;i<numRows;i++){
				var row = new ProductMainWindowTableViewRow(self);
			
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
		}
			productTableView.setData(viewRowData);	
		
	});	

	return self;
}

module.exports = ProductMainWindow;