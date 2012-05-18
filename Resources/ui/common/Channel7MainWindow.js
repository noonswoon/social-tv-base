Ch7Window = function (){
	
	var TVProgram = require('model/tvprogram');
	var ChannelTableViewRow = require('ui/common/ChannelTableViewRow');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
		
	var ch7TableView = Ti.UI.createTableView({
	});

	var allprograms = TVProgram.TVProgramModel_fetchPrograms(); 
	var ch7 = [];
	for(var i=0;i<allprograms.length;i++){
		
		var program = allprograms[i];
		if(program.channel_id === '7'){
			var channel7Row = new ChannelTableViewRow(program);
			ch7.push(channel7Row);
		}
	}
	ch7TableView.setData(ch7);
	self.add(ch7TableView);
	
	return self;	
}
module.exports = Ch7Window;