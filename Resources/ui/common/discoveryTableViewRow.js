DiscoveryTableViewRow = function(_curTVProgram){
	
		var TVProgramCheckinACS = require('acs/checkinACS');
	
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
			text: _curTVProgram.name,
			textAlign: 'right',
			right: 50,
			font:{fontWeight:'bold',fontSize:18},
			top: 10
		});
		row.add(programLabelName);
		
		var programLabelSubname = Ti.UI.createLabel({
			text: 'subname',
			color: '#420404',
			textAlign:'left',
			font:{fontWeight:'bold',fontSize:13},
			top: 30,
			left:140
		});
		row.add(programLabelSubname);
		
		var programImage = Ti.UI.createImageView({
			image: _curTVProgram.photo,
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
		
		var programCheckin = Ti.UI.createLabel({
			text: _curTVProgram.checkin,
			textAlign: 'right',
			right: 100
		});
		row.add(programCheckin);
	
		row.tvprogram = _curTVProgram;
		
	function tvprogramTotalCheckin(e){
		
		var eventCheckedin = e.fetchedEventCheckin;
		
		Ti.API.info('total checkin is '+eventCheckedin);
	}
	
	Ti.App.addEventListener('CheckInOfProgram',tvprogramTotalCheckin);
		
		TVProgramCheckinACS.checkinACS_fetchedCheckInOfProgram(_curTVProgram.id);
		return row;
}
module.exports = DiscoveryTableViewRow;
