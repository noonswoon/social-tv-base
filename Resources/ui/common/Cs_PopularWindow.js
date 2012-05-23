function PopularWindow(_parent) {
	
	var TVProgram = require('model/tvprogram');
	var TVProgramACS = require('acs/tvprogramACS');
	var PopularWindowTableViewRow = require('ui/common/Cs_PopularWindowTableViewRow');
	var CheckinACS = require('acs/checkinACS');
	var CacheHelper = require('helpers/cacheHelper');

	var areAllProgramsTitlesLoaded = false; 
	var numProgramsToLoadCheckins = 0;
	
	function isEverythingReady() {
		if(areAllProgramsTitlesLoaded && (numProgramsToLoadCheckins === 0)) {
			Ti.App.fireEvent("showDiscoveryPage");
		}
	}
	Ti.App.addEventListener('tvprogramsTitlesLoaded',function() {
		areAllProgramsTitlesLoaded = true;
		isEverythingReady();
	});
	
	var self = Ti.UI.createWindow({
		title: 'Discovery',
		backgroundColor: 'black'
	});
		
	var programListTable = Ti.UI.createTableView();

	Ti.App.addEventListener('doneGettingNumCheckinsOfProgramId', function(e) {
		var targetedProgramId = e.targetedProgramId; 
		var numCheckins = e.numCheckins; 
		TVProgram.TVProgramModel_updateCheckins(targetedProgramId, numCheckins);
		numProgramsToLoadCheckins--;
		isEverythingReady();
	});
	
	function fetchProgramsAllCheckins() {
		//select all programs in local db
		var currentTVPrograms = TVProgram.TVProgramModel_fetchPrograms(); 
		//for each program, call ACS to get how many checkins in the Cloud
		numProgramsToLoadCheckins = currentTVPrograms.length;
		for(var i=0;i<currentTVPrograms.length;i++){
			var curTVProgramId = currentTVPrograms[i].id; 
			CheckinACS.checkinACS_fetchedCheckInOfProgram(curTVProgramId);
		}
	};
	
	Ti.App.addEventListener('tvprogramsTitlesLoaded', function() {
		fetchProgramsAllCheckins();
	});
	
	Ti.App.addEventListener('tvprogramsLoaded',tvprogramLoadedCompleteCallback);
	
	function tvprogramLoadedCompleteCallback(e) {
		programListTable.data = [];	
		var allPrograms = e.fetchedPrograms;
		TVProgram.tvprogramsModel_insertAllPrograms(allPrograms);
		fetchProgramsAllCheckins(); 
	}
	
	Ti.App.addEventListener('showDiscoveryPage', function(){
		var currentTVPrograms = TVProgram.TVProgramModel_fetchPrograms(); 
		var viewRowsData = [];
		for (var i=0;i<currentTVPrograms.length;i++) {
			 var curTVProgram = currentTVPrograms[i];
				var row = new PopularWindowTableViewRow(curTVProgram);
				viewRowsData.push(row);
		}
		programListTable.setData(viewRowsData);
		
	});

	programListTable.addEventListener('click',function(e){
		var CheckinMainWindow = require('ui/common/checkinMainWindow');	
		checkinmainwin = new CheckinMainWindow({
			programId: e.row.tvprogram.id,
			programTitle: e.row.tvprogram.name,
			programSubname: 'subname',
			programImage: e.row.tvprogram.photo,
			programChannel: "http://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/200px-HBO_logo.svg.png",
			programStarttime: e.row.tvprogram.start_time,
			programEndtime: e.row.tvprogram.recurring_until,
			programNumCheckin: e.row.tvprogram.number_checkins
		});
		_parent.containingTab.open(checkinmainwin);
	});
	
	self.add(programListTable);
	self.hideNavBar();
	
	TVProgramACS.tvprogramACS_fetchAllProgramShowingNow();

	return self;
}

module.exports = PopularWindow;