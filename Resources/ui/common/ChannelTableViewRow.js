ChannelTableViewRow = function(_program){
	
	var row = Ti.UI.createTableViewRow({
		backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]
    	} 
	});
	
	var timeStartFormat = moment(_program.start_time, "YYYY-MM-DDTHH:mm:ss z");
	var timeEndFormat = moment(_program.recurring_until, "YYYY-MM-DDTHH:mm:ss z");
	
	var timeStart = timeStartFormat.format('HH:mm');
	var timeEnd = timeEndFormat.format('HH:mm');
	
		
	var detailButton = Ti.UI.createButton({
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		top: 5,
		right: 5,
		height: 30,
		width: 30,
		borderRadius:15,
		image:'images/icon/detailButton.png'
	});
	row.add(detailButton);
	
	var programName = Ti.UI.createLabel({
		text: _program.name,
		textAlign: 'left',
		left: 145,
		font:{fontWeight:'bold',fontSize:17},
		height: 30,
		width: 142,
		top: 5
	});
	row.add(programName);
	
	var programTime = Ti.UI.createLabel({
		text: timeStart+' - '+timeEnd,
		color: '#284c7e',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 33,
		left:145
	});
	row.add(programTime);
	
	var programImage = Ti.UI.createImageView({
		image: _program.photo,
		width:125,
		height:90
	});
	var programImageView = Ti.UI.createView({
		width: 131,
		height: 96,
		borderColor: '#D1CBCD',
		borderWidth: 1,
		backgroundColor: '#fff',
		top: 5,
		left:5,
		bottom:5
	});
	programImageView.add(programImage);
	row.add(programImageView);

	return row;	
}
module.exports = ChannelTableViewRow;
