function PopularWindow(_parent) {
	var TVProgramACS = require('acs/tvprogramACS');
	var CheckinACS = require('acs/checkinACS');
	var BadgeShowPermissionACS = require('acs/badgeShowPermissionACS');
	var CheckinModel = require('model/checkin');
	var TVProgram = require('model/tvprogram');
	var CacheHelper = require('helpers/cacheHelper');
	var PopularWindowTableViewRow = require('ui/common/Cs_PopularWindowTableViewRow');
	
	var areAllProgramsTitlesLoaded = false;
	var areBadgeShowPermissionReady = false;
	var numProgramsToLoadCheckins = 0;
	var usingPull2Refresh = false;
	
	//Google Analytics
	Titanium.App.Analytics.trackPageview('/Popular');
	
	function isEverythingReady() {
		if(areAllProgramsTitlesLoaded && areBadgeShowPermissionReady && (numProgramsToLoadCheckins === 0)) {
			Ti.App.fireEvent("showDiscoveryPage");
			hidePreloader(self);
		}
	}
	
	Ti.App.addEventListener('tvprogramsTitlesLoaded',function() {
		areAllProgramsTitlesLoaded = true;
		isEverythingReady();
	});
	
	Ti.App.addEventListener('badgeShowPermissionLoaded',function() {
		areBadgeShowPermissionReady = true;
		isEverythingReady();
	});
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
	
	var TimeSelection = require('ui/common/Cs_PopularWindowScrollviewTimeSelection');	
	var timeSelection = new TimeSelection();
	var timeSelectionView = Ti.UI.createView({
		height: 43,
		top:0,
		backgroundColor: 'transparent'
	});	
	timeSelectionView.add(timeSelection);
	
	var programListTable = Ti.UI.createTableView({
		top: 42,
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
		backgroundColor: 'transparent',
	});
	
	programListTable.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#d2d1d0', offset: 0.0}, { color: '#fffefd', offset: 1.0 }]
	};	
	
	function tvprogramLoadedCompleteCallback(e) {
		programListTable.data = [];	
		var allPrograms = e.fetchedPrograms;
		TVProgram.tvprogramsModel_insertAllPrograms(allPrograms);
		Ti.App.fireEvent("tvprogramsTitlesLoaded");
		// fetchProgramsAllCheckins(); 
	}
	Ti.App.addEventListener('tvprogramsLoaded',tvprogramLoadedCompleteCallback);
	
	function fetchProgramsAllCheckins() {
		var currentTVPrograms = TVProgram.TVProgramModel_fetchPrograms(); 
		numProgramsToLoadCheckins = currentTVPrograms.length;
		for(var i=0;i<currentTVPrograms.length;i++){
			var curTVProgramId = currentTVPrograms[i].id;
			//CheckinACS.checkinACS_fetchedCheckInOfProgram(curTVProgramId);
			CheckinACS.checkinACS_getTotalNumCheckinOfProgram(curTVProgramId);
		}
	};
	
	Ti.App.addEventListener('tvprogramsTitlesLoaded', function() {
		fetchProgramsAllCheckins();
	});
	
	Ti.App.addEventListener('doneGettingNumCheckinsOfProgramId', function(e) {
		var targetedProgramId = e.targetedProgramId; 
		var numCheckins = e.numCheckins; 
		TVProgram.TVProgramModel_updateCheckins(targetedProgramId, numCheckins);
		numProgramsToLoadCheckins--;
		isEverythingReady();
	});
	
	Ti.App.addEventListener('updatePopularProgramAtTime', function(e){
		var timeIndex = e.timeIndex;
		var selectedShowtime = TVProgram.TVProgramModel_fetchShowtimeSelection(timeIndex); 
		var viewRowsData = [];
		for (var i=0;i<selectedShowtime.length;i++) {
			var curTVProgram = selectedShowtime[i];
			var row = new PopularWindowTableViewRow(curTVProgram);
			viewRowsData.push(row);
		}
		programListTable.setData(viewRowsData);		
	});
	
	Ti.App.addEventListener('showDiscoveryPage', function(){
		var currentTVPrograms = TVProgram.TVProgramModel_fetchPopularPrograms(); 
		var viewRowsData = [];
		for (var i=0;i<currentTVPrograms.length;i++) {
			 var curTVProgram = currentTVPrograms[i];
				var row = new PopularWindowTableViewRow(curTVProgram);
				viewRowsData.push(row);
		}
		programListTable.setData(viewRowsData);
		
		//signify pull2refresh to be done [if it comes from Pull2Refresh] 
		if(usingPull2Refresh) {
			Ti.API.info('using pull to refresh..finish up');
			programListTable.refreshFinished();
			usingPull2Refresh = false;
			//CacheHelper.resetCacheTime('cachesomething here'+_programId);
		}
	});

	programListTable.addEventListener('click',function(e){
		var CheckinMainWindow = require('ui/common/Cs_CheckinMainWindow');
		Ti.API.info('program_type = '+e.row.tvprogram.program_type);
		checkinmainwin = new CheckinMainWindow({
			eventId: e.row.tvprogram.id, //id of the particular show (one-time)
			programId: e.row.tvprogram.program_id, //overall id of program id
			programTitle: e.row.tvprogram.name,
			programSubname: '',
			programImage: e.row.tvprogram.photo,
			programChannel: e.row.tvprogram.channel_id,
			programType: e.row.tvprogram.program_type,
			programStarttime: e.row.tvprogram.start_time,
			programEndtime: e.row.tvprogram.recurring_until,
			programNumCheckin: e.row.tvprogram.number_checkins
		}, _parent.containingTab);
		_parent.containingTab.open(checkinmainwin);
	});
	
	self.add(timeSelectionView);
	self.add(programListTable);
	self.hideNavBar();
	
	showPreloader(self,'Loading...');
	
	PullToRefresh.addASyncPullRefreshToTableView(programListTable, function() {
		usingPull2Refresh = true;
		TVProgramACS.tvprogramACS_fetchAllProgramShowingNow();
	}, {
		backgroundColor: '#959595', 
		statusLabel: {
			color: 'white'
		},
		updateLabel: {
			color: 'white'
		}
	});	
	
	TVProgramACS.tvprogramACS_fetchAllProgramShowingNow();
	BadgeShowPermissionACS.badgeShowPermissionACS_fetchedPermission();
	
	return self;
}

module.exports = PopularWindow;