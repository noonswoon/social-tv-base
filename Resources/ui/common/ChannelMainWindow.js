ChannelMainWindow = function (_index){
	
	var TVProgram = require('model/tvprogram');
	var TVProgramACS = require('acs/tvprogramACS');
	var ChannelTableViewRow = require('ui/common/ChannelTableViewRow');
		
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange',
		top: 40
	});
	
	var programsInChannelTableView = Ti.UI.createTableView();
	
	function tvprogramLoadedAllTimeCompleteCallback(e) {
		var allPrograms = e.fetchedPrograms;
		TVProgram.tvprogramsModel_insertAllPrograms(allPrograms);
	}
	
	function tvprogramsTitlesLoadedCallback(e) {
		var programsInChannel = [];		
		var allprograms = TVProgram.TVProgramModel_fetchPrograms(); 

		for(var i=0;i<allprograms.length;i++){
			
			var program = allprograms[i];
			if(_index === 0 && program.channel_id === 'ch3'){
				var channel3 = new ChannelTableViewRow(program);
				programsInChannel.push(channel3);
			}
			else if(_index === 1 && program.channel_id === 'ch5'){
				var channel5 = new ChannelTableViewRow(program);
				programsInChannel.push(channel5);
			}
			else if(_index === 2 && program.channel_id === 'ch7'){
				var channel7 = new ChannelTableViewRow(program);
				programsInChannel.push(channel7);
			}
			else if(_index === 3 && program.channel_id === 'ch9'){
				var channel9 = new ChannelTableViewRow(program);
				programsInChannel.push(channel9);
			}
			else if(_index === 4 && program.channel_id === 'ch11'){
				var channel11 = new ChannelTableViewRow(program);
				programsInChannel.push(channel11);
			}
			else if(_index === 5 && program.channel_id === 'chThaipbs'){
				var channelThaipbs = new ChannelTableViewRow(program);
				programsInChannel.push(channelThaipbs);
			}
		}
		programsInChannelTableView.data = [];
		programsInChannelTableView.setData(programsInChannel);	
	}
	
	Ti.App.addEventListener('tvprogramsLoadedAllTime',tvprogramLoadedAllTimeCompleteCallback);
	Ti.App.addEventListener('tvprogramsTitlesLoaded', tvprogramsTitlesLoadedCallback);
	
	Ti.App.addEventListener('close', function() {
		Ti.App.removeEventListener('tvprogramsLoadedAllTime',tvprogramLoadedAllTimeCompleteCallback);
		Ti.App.removeEventListener('tvprogramsTitlesLoaded', tvprogramsTitlesLoadedCallback);
	});
	
	self.add(programsInChannelTableView);
	TVProgramACS.tvprogramACS_fetchAllProgram();
	return self;
}
module.exports = ChannelMainWindow;
