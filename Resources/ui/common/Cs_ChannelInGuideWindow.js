ChannelInGuideWindow = function (_channelId,_channelSelectionWin){
	
	var TVProgram = require('model/tvprogram');
	var ChannelInGuideTableViewRow = require('ui/common/Cs_ChannelInGuideTableViewRow');
	var CheckinMainWindow = require('ui/common/Cs_CheckinMainWindow');
		
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange',
		top: 42
	});
	
	var programsOfChannelTableView = Ti.UI.createTableView({
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
		backgroundColor: 'transparent',
	});
	
	programsOfChannelTableView.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#d2d1d0', offset: 0.0}, { color: '#fffefd', offset: 1.0 }]
	};	

	var programsOfChannelData = [];		
	var programsOfChannel = TVProgram.TVProgramModel_fetchGuideProgramsOfChannel(_channelId); 
	for(var i=0;i<programsOfChannel.length;i++){
		var program = programsOfChannel[i];
		var selectedChannel = new ChannelInGuideTableViewRow(program);
		programsOfChannelData.push(selectedChannel);
	}
	
	programsOfChannelTableView.data = [];
	programsOfChannelTableView.setData(programsOfChannelData);	
		
	programsOfChannelTableView.addEventListener('click',function(e){
 		checkinmainwin = new CheckinMainWindow({
			eventId: e.row.tvprogram.id,
			programId: e.row.tvprogram.program_id,
			programTitle: e.row.tvprogram.name,
			programSubname: e.row.tvprogram.subname,
			programImage: e.row.tvprogram.photo,
			programChannel: e.row.tvprogram.channel_id,
			programType: e.row.tvprogram.program_type,
			programStarttime: e.row.tvprogram.start_time,
			programEndtime: e.row.tvprogram.recurring_until,
			programNumCheckin: e.row.tvprogram.number_checkins
		}, _channelSelectionWin.containingTab);	
		_channelSelectionWin.containingTab.open(checkinmainwin);
	});

	self.add(programsOfChannelTableView);
	return self;
}
module.exports = ChannelInGuideWindow;
