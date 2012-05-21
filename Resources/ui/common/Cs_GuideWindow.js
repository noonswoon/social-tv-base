function GuideWindow(_parent) {
	var ChannelMainWindow = require('ui/common/ChannelMainWindow');
	
	var channel = [];
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'black'
	});
	
	var selectChannelToolbar = Ti.UI.iOS.createToolbar({
		top: 0,
		height: 50
	});
	
	var selectChannelButton = Ti.UI.createButton({
		width: 50,
		height: 20,
		right: 20
	});
	selectChannelToolbar.add(selectChannelButton);
	
	var picker = Ti.UI.createPicker({
		top: 100
	});
 
	var data = [];
	data[0]=Ti.UI.createPickerRow({title:'Bananas'});
	data[1]=Ti.UI.createPickerRow({title:'Strawberries'});
	data[2]=Ti.UI.createPickerRow({title:'Mangos'});
	data[3]=Ti.UI.createPickerRow({title:'Grapes'});
 
	picker.add(data);
	picker.selectionIndicator = true;
// 	
	// selectChannelToolbar.add(picker);
// 	

	self.add(picker);
	
	var channel3Label = Ti.UI.createLabel({
		text: 'Channel 3',
		color: '#420404',
		shadowColor:'#FFFFE6',
		shadowOffset:{x:0,y:1},
		textAlign:'left',
		top:20,
		left:150,
		width: 'auto',
		height:'auto',
		font:{fontWeight:'bold',fontSize:18}
	});
	
	var channel3Logo = Ti.UI.createImageView({
		image: 'images/channel/ch3.jpg',
		top: 5,
		left: 10,
		bottom: 5,
		width:125,
		height:89
	});
	var ch3Row = Ti.UI.createTableViewRow({
			height: 100,
		});
	ch3Row.add(channel3Logo);
	ch3Row.add(channel3Label);
	channel.push(ch3Row);
		
		//TODO: fix the alignment
		var channel5Label = Ti.UI.createLabel({
			text: 'Channel 5',
			color: '#420404',
			shadowColor:'#FFFFE6',
			shadowOffset:{x:0,y:1},
			textAlign:'left',
			top:20,
			left:150,
			width: 'auto',
			height:'auto',
			font:{fontWeight:'bold',fontSize:18}
		});
		var channel5Logo = Ti.UI.createImageView({
			image: 'images/channel/ch5.jpg',
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});
	var ch5Row = Ti.UI.createTableViewRow({
			height: 100,
		});
	ch5Row.add(channel5Logo);
	ch5Row.add(channel5Label);
	channel.push(ch5Row);
	
		var channel7Label = Ti.UI.createLabel({
			text: 'Channel 7',
			color: '#420404',
			shadowColor:'#FFFFE6',
			shadowOffset:{x:0,y:1},
			textAlign:'left',
			top:20,
			left:150,
			width: 'auto',
			height:'auto',
			font:{fontWeight:'bold',fontSize:18}
		});
		var channel7Logo = Ti.UI.createImageView({
			image: 'images/channel/ch7.jpg',
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});
	var ch7Row = Ti.UI.createTableViewRow({
			height: 100,
		});
	ch7Row.add(channel7Logo);
	ch7Row.add(channel7Label);
	channel.push(ch7Row);
			
		var channel9Label = Ti.UI.createLabel({
			text: 'Channel 9',
			color: '#420404',
			shadowColor:'#FFFFE6',
			shadowOffset:{x:0,y:1},
			textAlign:'left',
			top:20,
			left:150,
			width: 'auto',
			height:'auto',
			font:{fontWeight:'bold',fontSize:18}
		});
		var channel9Logo = Ti.UI.createImageView({
			image: 'images/channel/ch9.jpg',
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});
			var ch9Row = Ti.UI.createTableViewRow({
			height: 100,
		});
	ch9Row.add(channel9Logo);
	ch9Row.add(channel9Label);
	channel.push(ch9Row);
	
		var channel11Label = Ti.UI.createLabel({
			text: 'Channel 11',
			color: '#420404',
			shadowColor:'#FFFFE6',
			shadowOffset:{x:0,y:1},
			textAlign:'left',
			top:20,
			left:150,
			width: 'auto',
			height:'auto',
			font:{fontWeight:'bold',fontSize:18}
		});
		var channel11Logo = Ti.UI.createImageView({
			image: 'images/channel/ch11.jpg',
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});
			var ch11Row = Ti.UI.createTableViewRow({
			height: 100,
		});
	ch11Row.add(channel11Logo);
	ch11Row.add(channel11Label);
	channel.push(ch11Row);
	
		var channelThaiPBSLabel = Ti.UI.createLabel({
			text: 'ThaiPBS',
			color: '#420404',
			shadowColor:'#FFFFE6',
			shadowOffset:{x:0,y:1},
			textAlign:'left',
			top:20,
			left:150,
			width: 'auto',
			height:'auto',
			font:{fontWeight:'bold',fontSize:18}
		});
		var channelThaiPBSLogo = Ti.UI.createImageView({
			image: 'images/channel/thaipbs.jpg',
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});	
			var chThaiPBSRow = Ti.UI.createTableViewRow({
			height: 100,
		});
	chThaiPBSRow.add(channelThaiPBSLogo);
	chThaiPBSRow.add(channelThaiPBSLabel);
	channel.push(chThaiPBSRow);
	
	var channelTableView = Ti.UI.createTableView({
		top: 50
	});
	channelTableView.setData(channel);
	
	channelTableView.addEventListener('click',function(e){
		var index = e.index;
		if(index === 0){
			var ch3 = new ChannelMainWindow(index);
			self.add(ch3);
		}
		else if(index === 1){
			var ch5 = new ChannelMainWindow(index);
			self.add(ch5);
		}
		else if(index === 2){
			var ch7 = new ChannelMainWindow(index);
			self.add(ch7);
		}
		else if(index === 3){
			var ch9 = new ChannelMainWindow(index);
			self.add(ch9);
		}
		else if(index === 4){
			var ch11 = new ChannelMainWindow(index);
			self.add(ch11);
		}
		else if(index === 5){
			var chThaipbs = new ChannelMainWindow(index);
			self.add(chThaipbs);
		}		
	});
	
	self.add(channelTableView);
	self.add(selectChannelToolbar);
	return self;
}

module.exports = GuideWindow;