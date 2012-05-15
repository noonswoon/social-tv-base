GuideMainWindow = function (){
	
	var GuideChannelWindow = require('ui/common/guideChannelWindow');
	
	var channel = [];
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'black',
		top: 50
	});
	
	for(var c=0;c<6;c++){
		
		var row = Ti.UI.createTableViewRow({
			height: 100,
		});
		
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
		
		var channelThaipbsLabel = Ti.UI.createLabel({
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
		
//////////// Image View

		var channel3Logo = Ti.UI.createImageView({
			image: 'images/channel/ch3.jpg',
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});

		var channel5Logo = Ti.UI.createImageView({
			image: 'images/channel/ch5.jpg',
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});

		var channel7Logo = Ti.UI.createImageView({
			image: 'images/channel/ch7.jpg',
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});

		var channel9Logo = Ti.UI.createImageView({
			image: 'images/channel/ch9.jpg',
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});

		var channel11Logo = Ti.UI.createImageView({
			image: 'images/channel/ch11.jpg',
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});

		var channelThaipbsLogo = Ti.UI.createImageView({
			image: 'images/channel/thaipbs.jpg',
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});					
		
		if(c===0){
			row.add(channel3Logo);
			row.add(channel3Label);
		}
		else if(c===1){
			row.add(channel5Logo);
			row.add(channel5Label);
		}
		else if(c===2){
			row.add(channel7Logo);
			row.add(channel7Label);
		}
		else if(c===3){
			row.add(channel9Logo);
			row.add(channel9Label);
		}
		else if(c===4){
			row.add(channel11Logo);
			row.add(channel11Label);
		}
		else if(c===5){
			row.add(channelThaipbsLogo);
			row.add(channelThaipbsLabel);
		}
				
		channel[c]=row;
	}
		
	var channelTableView = Ti.UI.createTableView({
		data: channel
	});
	
	channelTableView.addEventListener('click',function(){


	});
	
	self.add(channelTableView);
	
	return self;
}
module.exports = GuideMainWindow;
