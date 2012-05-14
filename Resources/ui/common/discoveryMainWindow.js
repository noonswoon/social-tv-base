function DiscoveryMainWindow(){
	
	var TVProgram = require('model/tvprogram');
	var TVProgramACS = require('acs/tvprogramACS');
	var DiscoveryTableViewRow = require('ui/common/discoveryTableViewRow');
	var TVProgramCheckinACS = require('acs/checkinACS');
	
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
	
	function tvprogramTotalCheckin(e){
		
		var eventCheckedin = e.fetchedEventCheckin;
		
		Ti.API.info('total checkin is '+eventCheckedin);
	}
	
	Ti.App.addEventListener('CheckInOfProgram',tvprogramTotalCheckin);
	
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

		Ti.API.info(e.index+',name: '+e.row.tvprogram.name);

		//var dataFromRow = new CheckinMainWindow()
		var CheckinMainWindow = require('ui/common/checkinMainWindow');;	
		self.containingTab.open(new CheckinMainWindow({
			programTitle: e.row.tvprogram.name,
			programSubname: 'subname',
			programImage: e.row.tvprogram.photo,
			programChannel: "http://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/200px-HBO_logo.svg.png",
			programStarttime: e.row.tvprogram.start_time,
			programEndtime: e.row.tvprogram.recurring_until,
			programCheckin: e.row.tvprogram.checkin
		}));
	});

	self.add(programListTable);
	self.hideNavBar();
	
	TVProgramCheckinACS.checkinACS_fetchedCheckInOfProgram("4fa8dbe60020442a2b0099f8");
	TVProgramACS.tvprogramACS_fetchAllProgram();
	return self;
}
module.exports = DiscoveryMainWindow;
