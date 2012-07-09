ChannelInGuideWindow = function (_index,_parent){
	
	var TVProgram = require('model/tvprogram');
	var ChannelInGuideTableViewRow = require('ui/common/Cs_ChannelInGuideTableViewRow');
		
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange',
		top: 42
	});
	
	var programsInChannelTableView = Ti.UI.createTableView();

	var programsInChannel = [];		
	var allprograms = TVProgram.TVProgramModel_fetchPrograms(); 

		for(var i=0;i<allprograms.length;i++){
			
			var program = allprograms[i];
			if(_index === 0 && program.channel_id === 'ch3'){
				var channel3 = new ChannelInGuideTableViewRow(program);
				programsInChannel.push(channel3);
			}
			else if(_index === 1 && program.channel_id === 'ch5'){
				var channel5 = new ChannelInGuideTableViewRow(program);
				programsInChannel.push(channel5);
			}
			else if(_index === 2 && program.channel_id === 'ch7'){
				var channel7 = new ChannelInGuideTableViewRow(program);
				programsInChannel.push(channel7);
			}
			else if(_index === 3 && program.channel_id === 'ch9'){
				var channel9 = new ChannelInGuideTableViewRow(program);
				programsInChannel.push(channel9);
			}
			else if(_index === 4 && program.channel_id === 'ch11'){
				var channel11 = new ChannelInGuideTableViewRow(program);
				programsInChannel.push(channel11);
			}
			else if(_index === 5 && program.channel_id === 'chThaipbs'){
				var channelThaipbs = new ChannelInGuideTableViewRow(program);
				programsInChannel.push(channelThaipbs);
			}
		}
		programsInChannelTableView.data = [];
		programsInChannelTableView.setData(programsInChannel);	
		
		programsInChannelTableView.addEventListener('click',function(e){
			var CheckinMainWindow = require('ui/common/Cs_CheckinMainWindow');
			checkinmainwin = new CheckinMainWindow({
				eventId: '2',
				programTitle: 'test',
				programSubname: '',
				programImage: 'test',
				programChannel: 'test',
				programType: 'test',
				programStarttime: 'test',
				programEndtime: 'test',
				programNumCheckin: 'test'
			}, _parent.containingTab);
			_parent.containingTab.open(checkinmainwin);
		});

	self.add(programsInChannelTableView);
	return self;
}
module.exports = ChannelInGuideWindow;
