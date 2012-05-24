function GuideWindow(_parent) {
	
	var ChannelMainWindow = require('ui/common/ChannelMainWindow');
	
	var channelTable = [];
	
	var self = Ti.UI.createWindow({
		//backgroundColor: 'black'
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
	
	//Default Channel(Ch3)
	var defaultChannel = new ChannelMainWindow(0);
 	self.add(defaultChannel);	
	
	selectChannelButton.addEventListener('click',function(){
		var selectChannelPicker = Ti.UI.createPicker({
			bottom: 0
		});

	var channel = [];
	channel[0]=Ti.UI.createPickerRow({title:'Channel3'});
	channel[1]=Ti.UI.createPickerRow({title:'Channel5'});
	channel[2]=Ti.UI.createPickerRow({title:'Channel7'});
	channel[3]=Ti.UI.createPickerRow({title:'Channel9'});
	channel[4]=Ti.UI.createPickerRow({title:'Channel11'});
	channel[5]=Ti.UI.createPickerRow({title:'ThaiPBS'});
		
	selectChannelPicker.selectionIndicator = true;
	selectChannelPicker.add(channel);
	self.add(selectChannelPicker);

	selectChannelPicker.addEventListener('change',function(e){
		var index = e.rowIndex;
		if(index === 0){
			var ch3 = new ChannelMainWindow(index);
			self.add(ch3);				
			selectChannelLabel.text = 'CH3';
		}
		else if(index === 1){
			var ch5 = new ChannelMainWindow(index);
			self.add(ch5);
			selectChannelLabel.text = 'CH5';	
		}
		else if(index === 2){
			var ch7 = new ChannelMainWindow(index);
			self.add(ch7);
			selectChannelLabel.text = 'CH7';	
		}
		else if(index === 3){
			var ch9 = new ChannelMainWindow(index);
			self.add(ch9);	
			selectChannelLabel.text = 'CH9';
		}
		else if(index === 4){
			var ch11 = new ChannelMainWindow(index);
			self.add(ch11);	
			selectChannelLabel.text = 'CH11';
		}
		else if(index === 5){
			var thaiPBS = new ChannelMainWindow(index);
			self.add(thaiPBS);
			selectChannelLabel.text = 'ThaiPBS';
		}
		selectChannelPicker.hide();
	});
});
	return self;
}
module.exports = GuideWindow;