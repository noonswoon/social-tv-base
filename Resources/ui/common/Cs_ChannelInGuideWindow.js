ChannelInGuideWindow = function (_channelId,_channelSelectionWin){
	var TVProgramACS = require('acs/tvprogramACS');
	var TVProgramModel = require('model/tvprogram');
	var ChannelInGuideTableViewRow = require('ui/common/Cs_ChannelInGuideTableViewRow');
	var CheckinMainWindow = require('ui/common/Cs_CheckinMainWindow');
		
	var currentChannelId = _channelId;
	var canOpenWindow = true;
	
	var self = Ti.UI.createWindow({
		top: 42
	});
	
	var channelProgramsTableView = Ti.UI.createTableView({
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
		backgroundColor: 'transparent',
	});
	
	channelProgramsTableView.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#d2d1d0', offset: 0.0}, { color: '#fffefd', offset: 1.0 }]
	};	

	self._enableOpenCheckinWindow = function() {
		canOpenWindow = true;	
		//Ti.API.info('enable to open checkin window again - guide');
	};
	
	channelProgramsTableView.addEventListener('click',function(e){
 		if(canOpenWindow) {
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
			canOpenWindow = false;
			//Ti.API.info('canOpenCheckin Window set to false - guide');
		}
	});
	
	self._updateProgramContents = function(_selectedChannelId) {
		showPreloader(self,'Loading...');
		currentChannelId = _selectedChannelId;
		TVProgramACS.tvprogramACS_fetchProgramsFromChannel(currentChannelId);
		setTimeout(function() {
			Ti.API.info('force close loading screen');
			hidePreloader(self);
		}, 10000);
	};
	
	Ti.App.addEventListener('tvprogramsOfChannelLoaded', function(e) {
		var channelPrograms = e.fetchedPrograms;
		
		//insert to db
		TVProgramModel.TVProgramModel_insertPrograms(channelPrograms);
		
		var channelProgramData = [];		
		//pull from db
		channelPrograms = TVProgramModel.TVProgramModel_fetchGuideProgramsOfChannel(currentChannelId); 
		for(var i=0; i < channelPrograms.length; i++){
			var program = channelPrograms[i];
			var rowData = new ChannelInGuideTableViewRow(program);
			channelProgramData.push(rowData);
		}
		channelProgramsTableView.data = [];
		channelProgramsTableView.setData(channelProgramData);
		hidePreloader(self);
	});

	//acs data call
	showPreloader(self,'Loading...');
	TVProgramACS.tvprogramACS_fetchProgramsFromChannel(currentChannelId);
	setTimeout(function() {
		Ti.API.info('force close loading screen');
		hidePreloader(self);
	}, 10000);
	
	self.add(channelProgramsTableView);
	return self;
}
module.exports = ChannelInGuideWindow;
