DiscoveryTableViewRow = function(_curTVProgram){
	
	var TVProgram = require('model/tvprogram');
	
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
			textAlign: 'left',
			left: 140,
			font:{fontWeight:'bold',fontSize:18},
			top: 10
		});
		row.add(programLabelName);
		
		var programLabelSubname = Ti.UI.createLabel({
			text: _curTVProgram.channel_id,
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
			bottom: 7,
			left: 270,
			width: 35,
			height: 15
		});
		row.add(programChannel);
		
		var programNumCheckin = Ti.UI.createLabel({
			text: _curTVProgram.number_checkins,
			textAlign: 'left',
			left: 140,
			bottom: 5
		});
		row.add(programNumCheckin);

		row.tvprogram = _curTVProgram;
			
		Ti.App.addEventListener('updateNumCheckinAtDiscovery'+_curTVProgram.id,function(e){
			_curTVProgram.number_checkins = _curTVProgram.number_checkins + e.numCheckin;
			row.tvprogram = _curTVProgram;  //need to reset to make it update the row.tvprogram
			programNumCheckin.text = _curTVProgram.number_checkins;
		});	

		
		return row;
}
module.exports = DiscoveryTableViewRow;
