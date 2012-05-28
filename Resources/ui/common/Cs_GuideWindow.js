function GuideWindow(_parent) {
	
	var ChannelInGuideWindow = require('ui/common/Cs_ChannelInGuideWindow');
	var GuideTabTableViewRow = require('ui/common/Cs_GuideTabTableViewRow');

	var channelsList = ['3','5','7','9','11','ThaiPBS'];
	var dataForTab = []; 
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'pink'
	});

	var selectChannelToolbar = Ti.UI.createView({
		top: 0,
		height: 40,
		//barColor: '#e0e0e0'
		backgroundGradient: {			
	        	type: 'linear',
	        	startPoint: { x: '0%', y: '0%' },
	        	endPoint: { x: '0%', y: '100%' },
	        	colors: [ { color: '#fff', offset: 0.0}, { color: '#d0d0d0', offset: 1.0 } ]}
	});
	self.add(selectChannelToolbar);
	
	var selectChannelButton = Ti.UI.createButton({
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
	selectChannelToolbar.add(selectChannelButton);
	
	var pickChannelLabel = Ti.UI.createLabel({
		color: '#8c8c8c',
		width: 70,
		height: 50,
		right: 45,
		textAlign: 'right',
		text: 'PICK A CHANNEL',
		font:{fontSize: 11}
	});
	selectChannelToolbar.add(pickChannelLabel);
	
	var selectChannelLabel = Ti.UI.createLabel({
		text: 'CH3',
		left: 20,
		font: {fontSize: 18, fontWeight: 'bold'},
		color: '#333'
	});
	selectChannelToolbar.add(selectChannelLabel);
	
	//Popup
	var channelSelectorPopupWin = Ti.UI.createWindow({
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
	channelSelectorPopupWin.add(tableViewForTab);
	
	//LOGIC STUFF
	for(var i=0;i<channelsList.length;i++) {
		var curChannel = new GuideTabTableViewRow(channelsList[i]);
		dataForTab.push(curChannel);
	}
	tableViewForTab.setData(dataForTab);
	
	//EVENT LISTENERS
	var channelSelectorToggle = true; //true means it closes
	selectChannelButton.addEventListener('click',function(e){
		if(channelSelectorToggle) {
			channelSelectorToggle = false;
			channelSelectorPopupWin.open();
			self.add(triangleImage);
		} else {
			channelSelectorToggle = true;
			channelSelectorPopupWin.close();
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
	
	// Default Channel(Ch3)
	var defaultChannel = new ChannelInGuideWindow(0);
 	self.add(defaultChannel);	

	self._closePopupWindow = function() {
		if(!channelSelectorToggle) { //only close if it is still open
			channelSelectorToggle = true;
			channelSelectorPopupWin.close();
			self.remove(triangleImage);
		}
	};
	
	return self;
}
module.exports = GuideWindow;