function DiscoveryMainWindow(){
	
	var TVProgram = require('model/tvprogram');
	var TVProgramACS = require('acs/tvprogramACS');
	var DiscoveryTableViewRow = require('ui/common/discoveryTableViewRow');
	var CheckinACS = require('acs/checkinACS');
	
	var areAllProgramsTitlesLoaded = false; 
	var numProgramsToLoadCheckins = 0;
	
	function isEverythingReady() {
		Ti.API.info("numProgramsToLoadCheckins value: "+numProgramsToLoadCheckins);
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
	

	var tabbar = Ti.UI.createTabbedBar({
		labels: ['Popular','Guide','Friends'],
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height:35,
		width:200,
	});
	self.add(tabbar);
	
	var tabHeader = Ti.UI.createView({
		top: 0,
		height: 50,
		backgroundImage: '/images/bgheader.png'
	});
	tabHeader.add(tabbar);
	self.add(tabHeader);
	
	var programListTable = Ti.UI.createTableView({
		top: 50
	});
	
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
	
	function tvprogramLoadedCompleteCallback(e) {
		//clear current data in the table
		programListTable.data = [];	
		var allPrograms = e.fetchedPrograms;
		TVProgram.tvprogramsModel_insertAllPrograms(allPrograms);
		fetchProgramsAllCheckins(); 
	}
	
	Ti.App.addEventListener('tvprogramsLoaded',tvprogramLoadedCompleteCallback);
	
	Ti.App.addEventListener('showDiscoveryPage', function (){
		var currentTVPrograms = TVProgram.TVProgramModel_fetchPrograms(); 
		var viewRowsData = [];
		for (var i=0;i<currentTVPrograms.length;i++) {
			 var curTVProgram = currentTVPrograms[i];
				var row = new DiscoveryTableViewRow(curTVProgram);
				viewRowsData.push(row);
		}
		programListTable.setData(viewRowsData);
	});
	
	programListTable.addEventListener('click',function(e){

		Ti.API.info(e.index+',name: '+e.row.tvprogram.name);

		//var dataFromRow = new CheckinMainWindow()
		var CheckinMainWindow = require('ui/common/checkinMainWindow');;	
		self.containingTab.open(new CheckinMainWindow({
			programId: e.row.tvprogram.id,
			programTitle: e.row.tvprogram.name,
			programSubname: 'subname',
			programImage: e.row.tvprogram.photo,
			programChannel: "http://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/200px-HBO_logo.svg.png",
			programStarttime: e.row.tvprogram.start_time,
			programEndtime: e.row.tvprogram.recurring_until
		}));
	});

	self.add(programListTable);
	self.hideNavBar();
	
	TVProgramACS.tvprogramACS_fetchAllProgram();
	
	return self;
}
module.exports = DiscoveryMainWindow;
