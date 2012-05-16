Ch9Window = function (){
	
	var TVProgram = require('model/tvprogram');
	var ChannelTableViewRow = require('ui/common/ChannelTableViewRow');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
		
	var ch9TableView = Ti.UI.createTableView({
	});

	var allprograms = TVProgram.TVProgramModel_fetchPrograms(); 
	var ch9 = [];
	for(var i=0;i<allprograms.length;i++){
		
		var program = allprograms[i];
		if(program.channel_id === '9'){
			var channel9Row = new ChannelTableViewRow(program);
			ch9.push(channel9Row);
		}
	}
	ch9TableView.setData(ch9);
	self.add(ch9TableView);
	
	return self;	
}
module.exports = Ch9Window;