function DiscoveryMainWindow(){
	
	var TVProgram = require('model/tvprogram');
	var TVProgramACS = require('acs/tvprogramACS');
	var DiscoveryTableViewRow = require('ui/common/discoveryTableViewRow');
	var CheckinMainWindow = require('ui/common/checkinMainWindow');
	
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
		top: 50,
	});
	
	function tvprogramLoadedCompleteCallback(e) {
		//clear current data in the table
		programListTable.data = [];	
		var allPrograms = e.fetchedPrograms;

		//retrieve from db
		TVProgram.tvprogramsModel_insertAllPrograms(allPrograms);
	}
	
	
	Ti.App.addEventListener('tvprogramsLoaded',tvprogramLoadedCompleteCallback);
	
	Ti.App.addEventListener('tvprogramsDbUpdated', function (){
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
		var dataFromRow = new CheckinMainWindow(e.name);
		self.containingTab.open(dataFromRow);
	});

	self.add(programListTable);
	self.hideNavBar();
	
	TVProgramACS.tvprogramACS_fetchAllProgram();
	return self;
}
module.exports = DiscoveryMainWindow;
