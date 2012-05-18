ChannelMainWindow = function (_index){
	
	var TVProgram = require('model/tvprogram');
	var ChannelTableViewRow = require('ui/common/ChannelTableViewRow');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
	
		
	var channaleTableView = Ti.UI.createTableView({
	});
	
	var channel = [];		
	
	//call from db
	var allprograms = TVProgram.TVProgramModel_fetchPrograms(); 
	
	//loop all programs
	for(var i=0;i<allprograms.length;i++){
		var program = allprograms[i];
		
		if(_index === 0 && program.channel_id === '3'){
			var channel3 = new ChannelTableViewRow(program);
			channel.push(channel3);
		}
		else if(_index === 1 && program.channel_id === '5'){
			var channel5 = new ChannelTableViewRow(program);
			channel.push(channel5);
		}
		else if(_index === 2 && program.channel_id === '7'){
			var channel7 = new ChannelTableViewRow(program);
			channel.push(channel7);
		}
		else if(_index === 3 && program.channel_id === '9'){
			var channel9 = new ChannelTableViewRow(program);
			channel.push(channel9);
		}
		else if(_index === 4 && program.channel_id === '11'){
			var channel11 = new ChannelTableViewRow(program);
			channel.push(channel11);
		}
		else if(_index === 5 && program.channel_id === 'Thaipbs'){
			var channelThaipbs = new ChannelTableViewRow(program);
			channel.push(channelThaipbs);
		}
	}
	channaleTableView.setData(channel);
	self.add(channaleTableView);

	return self;
}
module.exports = ChannelMainWindow;
