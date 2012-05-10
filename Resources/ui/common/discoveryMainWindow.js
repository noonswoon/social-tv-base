function DiscoveryMainWindow(){
	
	var TVProgram = require('model/tvprogram');
	var TVProgramACS = require('acs/tvprogramACS');
	var DiscoveryTableViewRow = require('ui/common/discoveryTableViewRow');
	
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
	
	programListTable.addEventListener('click',function(e){
		
		var CheckinWindow = require('ui/common/checkinMainWindow');
		self.containingTab.open(new CheckinWindow({
			programTitle:'Hawaii Five-O',
			programImage:"http://www.weloveshopping.com/shop/mildmovies/o-207.jpg",
			programDescription:"Season1",
			programChannel:"http://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/200px-HBO_logo.svg.png"
			}));
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
			// var rowWithAllProgram = Ti.UI.createTableViewRow({
				// id: curTVProgram.id,
				// title: curTVProgram.name
			// });
			
			var row = Ti.UI.createTableViewRow({
			height: 100,
			backgroundGradient: {
        		type: 'linear',
        		startPoint: { x: '0%', y: '0%' },
        		endPoint: { x: '0%', y: '100%' },
        		colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]
    		} 
		});
		
		var programLabelName = Ti.UI.createLabel({
			text: curTVProgram.name,
			textAlign: 'right',
			right: 50,
			font:{fontWeight:'bold',fontSize:18},
			top: 10
		});
		row.add(programLabelName);
		
		var programLabelSubname = Ti.UI.createLabel({
			text: '=',
			color: '#420404',
			textAlign:'right',
			font:{fontWeight:'bold',fontSize:13},
			top: 30,
			right:115
		});
		row.add(programLabelSubname);
		
		var programImage = Ti.UI.createImageView({
			image: curTVProgram.photo,
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});
		row.add(programImage);
		
		var programChannel = Ti.UI.createImageView({
			image: "http://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/200px-HBO_logo.svg.png",
			bottom: 5,
			left: 270,
			width: 35,
			height: 15
		});
		row.add(programChannel);	
			
			
			viewRowsData.push(row);
		}
		programListTable.setData(viewRowsData);
	});

	self.add(programListTable);
	self.hideNavBar();
	
	TVProgramACS.tvprogramACS_fetchAllProgram();
	return self;
}
module.exports = DiscoveryMainWindow;
