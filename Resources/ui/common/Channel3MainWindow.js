Ch3Window = function (){
	
	var TVProgram = require('model/tvprogram');
	var ChannelTableViewRow = require('ui/common/ChannelTableViewRow');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
	
		
	var ch3TableView = Ti.UI.createTableView({
	});
	
		//pull event from local db
		// for loop all program
		// condition channel_id === 3
		// sort by time
		// push to row
				
	var allprograms = TVProgram.TVProgramModel_fetchPrograms(); 
	var ch3 = [];
	for(var i=0;i<allprograms.length;i++){
		
		var program = allprograms[i];
		if(program.channel_id === '3'){
			var channel3Row = new ChannelTableViewRow(program);
			ch3.push(channel3Row);
		}
	}
	ch3TableView.setData(ch3);
	self.add(ch3TableView);
	
	return self;
}
module.exports = Ch3Window;
