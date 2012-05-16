Ch11Window = function (){
	
	var TVProgram = require('model/tvprogram');
	var ChannelTableViewRow = require('ui/common/ChannelTableViewRow');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
		
	var ch11TableView = Ti.UI.createTableView({
	});

	var allprograms = TVProgram.TVProgramModel_fetchPrograms(); 
	var ch11 = [];
	for(var i=0;i<allprograms.length;i++){
		
		var program = allprograms[i];
		if(program.channel_id === '11'){
			var channel11Row = new ChannelTableViewRow(program);
			ch11.push(channel11Row);
		}
	}
	ch11TableView.setData(ch11);
	self.add(ch11TableView);
	
	return self;	
}
module.exports = Ch11Window;