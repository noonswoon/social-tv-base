function ProductMainWindow(_programId) {
	
	var ProductMainWindowTableViewRow = require('ui/common/Pd_ProductMainWindowTableViewRow');
	var ProductACS = require('acs/productACS');
	var Checkin = require('model/checkin');
	var ProductTabTableViewRow = require('ui/common/Pd_ProductTabTableViewRow');
	var TVProgram = require('model/tvprogram');
	
	//Google Analytics
	Titanium.App.Analytics.trackPageview('/Product');
	
	var currentProgramId = _programId;
	var dataForTab = [];
	var hasLoadedPicker = false;
	var pickerSelectedIndex = 0;
	
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
		image: 'images/toolbar_button.png'
	});
	productSelectProgramToolbar.add(callPicker);
	
	var selectProgramLabel = Ti.UI.createLabel({
		text: 'Chatterbox Souvenirs',//infoForName[0].name,
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
			var dataForPicker = [];
			var preSelectedRow = 0;
			for(var i=0;i<myCurrentCheckinPrograms.length;i++){
				var programId = myCurrentCheckinPrograms[i];
				if(myCurrentSelectedProgram === programId) 
					preSelectedRow = i;
					
				if(programId === 'CTB_PUBLIC') {
					dataForPicker.push({title:'Chatterbox Souvenirs', progId:'CTB_PUBLIC'});
				} else {
					var programInfo = TVProgram.TVProgramModel_fetchProgramsWithProgramId(programId);
					Ti.API.info('programId: '+programId+', programInfo: '+JSON.stringify(programInfo));
					var programName = programInfo[0].name;
					var program_id = programInfo[0].program_id;
					dataForPicker.push({title:programName, progId:program_id});
				}
			}
			picker.setSelectedRow(0,preSelectedRow,false);
			picker.add(dataForPicker);
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

	done.addEventListener('click',function() {
		picker_view.animate(slide_out);
		self.remove(opacityView);
		if(pickerSelectedIndex === 0) {
			currentProgramId = 'CTB_PUBLIC';
			selectProgramLabel.text = 'Chatterbox Souvenirs';
			//messageboardHeader._setHeader('General Board','Chatterbox General Board','http://a0.twimg.com/profile_images/2208934390/Screen_Shot_2012-05-11_at_3.43.35_PM.png',452,'CTB');
			//ProductACS.productACS_fetchedAllProducts(currentProgramId);
		} else {
			currentProgramId = picker.getSelectedRow(0).progId;
			var selectedProgram = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
			//messageboardHeader._setHeader(selectedProgram[0].name,selectedProgram[0].subname,selectedProgram[0].photo,selectedProgram[0].number_checkins,selectedProgram[0].channel_id);	
			//ProductACS.productACS_fetchedAllProducts(currentProgramId);
		}
	});

	picker.addEventListener('change',function(e) {
		pickerSelectedIndex = e.rowIndex;
	});

	self.add(picker_view);
///////////////////////////////////////////////////////////////

	var unavailable = Ti.UI.createLabel({
		text: 'Products will be available soon!',
		color: 'white',
		font: { fontSize: 16, fontFamily: 'Helvetica Neue', fontWeight: 'bold' }
	});

	ProductACS.productACS_fetchedAllProducts(_programId);

	Ti.App.addEventListener('fetchedAllProduct', function(e){
		
		self.remove(unavailable);
		
		var viewRowData = [];
		var totalProducts = e.fetchedAllProduct.length;
		var numRows = Math.ceil(totalProducts/2);
		
		if(totalProducts == 0){
			self.add(unavailable);
		} else {
			for(var i=0;i<numRows;i++){
				var row = new ProductMainWindowTableViewRow(self);
			
				for(var j=0;j<=1;j++){
					var productIndex = i*2 + j;
					if(productIndex >= totalProducts)
						break;
					var curProduct = e.fetchedAllProduct[productIndex];
					if(j % 2 === 0) { //left column
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