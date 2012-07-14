function ProductMainWindow(_programId) {
	
	var ProductMainWindowTableViewRow = require('ui/common/Pd_ProductMainWindowTableViewRow');
	var ProductACS = require('acs/productACS');
	var Checkin = require('model/checkin');
	var ProductTabTableViewRow = require('ui/common/Pd_ProductTabTableViewRow');
	var TVProgram = require('model/tvprogram');
	var CheckinGuidelineWindow = require('ui/common/Am_CheckinGuideline');
	var checkinguidelinewin = null;
	//Google Analytics
	Titanium.App.Analytics.trackPageview('/Product');
	
	var currentProgramId = _programId;
	
	//Check whether user has checkin to any program
	var self = Titanium.UI.createWindow({
		backgroundImage: 'images/messageboard/appBG.png',
		barImage: 'images/nav_bg_w_pattern.png',
		title: "Product"
	});
	
	var programName = "Something";
	if(currentProgramId === '') { //have not checkedin to any program yet
		checkinguidelinewin = new CheckinGuidelineWindow('product');
		self.add(checkinguidelinewin);
		currentProgramId = 'CTB_PUBLIC';
	} else {
		var programData = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
		programName = programData[0].name;
	}
	
	var dataForTab = [];
	var pickerSelectedIndex = 0;

	var callPicker = Ti.UI.createButton({
		width: 39,
		height: 32,
		backgroundImage: 'images/messageboard/option_button.png'
	});
	
	self.rightNavButton = callPicker;
	
	var productSelectProgramToolbar = Ti.UI.createView({
		top: 0,
		height: 44,
		backgroundImage: 'images/ToolbarBG.png'
	});
	self.add(productSelectProgramToolbar);
	
	var selectProgramLabel = Ti.UI.createLabel({
		text: programName,
		left: 10,
		width: 'auto',
		font: { fontSize: 18, fontFamily: 'Helvetica Neue', fontWeight: 'bold' }
	});	
	productSelectProgramToolbar.add(selectProgramLabel);

	var productTableView = Ti.UI.createTableView({
		top: 42,
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
	var pickerView = Titanium.UI.createView({
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
	pickerView.add(toolbar);

	var slide_in =  Titanium.UI.createAnimation({bottom:0});
	var slide_out =  Titanium.UI.createAnimation({bottom:-251});
	
	self._getNumRowsInPicker = function() {
		if(picker.columns === null) return 0;
		else if(picker.columns.length > 0) return picker.columns[0].rowCount;
		else return 0;
	};

	self._initializePicker = function() {
		var dataForPicker = [];
		var selectedProgramId = "";
		var selectedProgramName = "";
		var currentCheckinPrograms = UserCheckinTracking.getCurrentCheckinPrograms();
		for(var i = 0; i < currentCheckinPrograms.length; i++){
			var programId = currentCheckinPrograms[i];
			var programInfo = TVProgram.TVProgramModel_fetchProgramsWithProgramId(programId);
			if(programInfo === undefined || programInfo[0] === undefined)
				Ti.API.info('bad time...cannot find info for programId: '+programId);
			else programName = programInfo[0].name;
			
			if(UserCheckinTracking.getCurrentSelectedProgram() === programId) {
				//skip, not adding to array, will add it to the top of array at the end
				selectedProgramId = programId;	
				selectedProgramName = programName;
			} else {
				dataForPicker.push({title:programName, programId:programId});				
			}
		}
		//for some reason, the fn picker.setSelectedRow doesn't work here (it keeps setting to picker index 0), 
		//need ad-hoc fix by setting the current selected program to be at the top of the picker
		dataForPicker.unshift({title:selectedProgramName, programId:selectedProgramId})
		picker.add(dataForPicker);
		pickerView.add(picker);
	};
	if(self._getNumRowsInPicker() === 0 && currentProgramId !== 'CTB_PUBLIC') {
		self._initializePicker();
	}
	
	self._addNewPickerData = function(checkinProgramId, checkinProgramName) {
		var newPickerRow = Ti.UI.createPickerRow({title:checkinProgramName, programId: checkinProgramId});
		picker.add(newPickerRow);
		setTimeout(function(e) {
			var latestRow = picker.columns[0].rowCount - 1; 
			picker.setSelectedRow(0,latestRow,false);
		}, 500); //wait half-a-sec
	};
	
	self._updateSelectedPicker = function(newSelectedProgram) {
		var numRows = picker.columns[0].rowCount; 
		var selectedRow = 0;
		for(var i = 0; i < numRows; i++){
			var curProgramId = picker.columns[0].rows[i].programId; 
			if(curProgramId === newSelectedProgram) {
				selectedRow = i;
				break;
			}		
		}
		picker.setSelectedRow(0,selectedRow,false);
	};
	
	self._removeAllPickerData = function() {
		var pickerColumn = picker.columns[0];
    	var numRows = pickerColumn.rowCount;
    	for(var i = numRows-1; i >= 0; i-- ){
        	var curRow = pickerColumn.rows[i]
        	pickerColumn.removeRow(curRow);
    	}
    	picker.reloadColumn(pickerColumn);
	};
	
	self._updatePageContent = function(_newProgramId) {
		currentProgramId = _newProgramId;
		var programData = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
		if(programData === undefined || programData[0] === undefined) 
			Ti.API.info('bad time man..productwin cannot find data for '+currentProgramId);
		else programName = programData[0].name;
		selectProgramLabel.text = programName;
		
		ProductACS.productACS_fetchedAllProducts(currentProgramId);	
	};

	self._addGuidelineWindow = function() {
		if(checkinguidelinewin === null)
			checkinguidelinewin = new CheckinGuidelineWindow('product');
		self.add(checkinguidelinewin);
	};
		
	self._removeGuidelineWindow = function() {
		self.remove(checkinguidelinewin);
	};
	
	callPicker.addEventListener('click',function() {
		pickerView.animate(slide_in);
		self.add(opacityView);
	});

	cancel.addEventListener('click',function() {
		pickerView.animate(slide_out);
		self.remove(opacityView);
	});

	done.addEventListener('click',function() {
		pickerView.animate(slide_out);
		self.remove(opacityView);
		
		if(currentProgramId !== picker.getSelectedRow(0).programId) {
			selectProgramLabel.text = picker.getSelectedRow(0).title;
			currentProgramId = picker.getSelectedRow(0).programId;
			ProductACS.productACS_fetchedAllProducts(currentProgramId);
			Ti.App.fireEvent('changingCurrentSelectedProgram',{newSelectedProgram:currentProgramId});
		}
	});

	picker.addEventListener('change',function(e) {
		pickerSelectedIndex = e.rowIndex;
	});

	self.add(pickerView);
///////////////////////////////////////////////////////////////

	var unavailable = Ti.UI.createLabel({
		text: 'Products will be available soon!',
		color: 'white',
		font: { fontSize: 16, fontFamily: 'Helvetica Neue', fontWeight: 'bold' }
	});

	ProductACS.productACS_fetchedAllProducts(currentProgramId);

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