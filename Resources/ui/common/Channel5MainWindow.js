Ch5Window = function (){
	
	var TVProgram = require('model/tvprogram');
	var ChannelTableViewRow = require('ui/common/ChannelTableViewRow');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
		
	var ch5TableView = Ti.UI.createTableView({
	});

	var allprograms = TVProgram.TVProgramModel_fetchPrograms(); 
	var ch5 = [];
	for(var i=0;i<allprograms.length;i++){
		
		var program = allprograms[i];
		if(program.channel_id === '5'){
			var channel5Row = new ChannelTableViewRow(program);
			ch5.push(channel5Row);
		}
	}
	ch5TableView.setData(ch5);
	self.add(ch5TableView);
	
	return self;	
}
module.exports = Ch5Window;