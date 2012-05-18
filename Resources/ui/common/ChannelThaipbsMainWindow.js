ChThaipbsWindow = function (){
	
	var TVProgram = require('model/tvprogram');
	var ChannelTableViewRow = require('ui/common/ChannelTableViewRow');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
		
	var chThaipbsTableView = Ti.UI.createTableView({
	});

	var allprograms = TVProgram.TVProgramModel_fetchPrograms(); 
	var chThaipbs = [];
	for(var i=0;i<allprograms.length;i++){
		
		var program = allprograms[i];
		if(program.channel_id === 'Thaipbs'){
			var channelThaipbsRow = new ChannelTableViewRow(program);
			chThaipbs.push(channelThaipbsRow);
		}
	}
	chThaipbsTableView.setData(chThaipbs);
	self.add(chThaipbsTableView);
	
	return self;	
}
module.exports = ChThaipbsWindow;