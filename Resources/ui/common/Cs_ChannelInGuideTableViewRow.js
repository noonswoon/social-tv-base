ChannelInGuideTableViewRow = function(_program){
	
	var row = Ti.UI.createTableViewRow({
		height: 121,
	});
	row.backgroundGradient = { type: 'linear',
       		startPoint: { x: '0%', y: '0%' },
       		endPoint: { x: '0%', y: '100%' },
       		colors: [ { color: '#fff', offset: 0.0}, { color: '#D0D0D0', offset: 1.0 } ] }; 
	
	var timeStartFormat = moment(_program.start_time, "YYYY-MM-DDTHH:mm:ss z");
	var timeEndFormat = moment(_program.recurring_until, "YYYY-MM-DDTHH:mm:ss z");
	
	var timeStart = timeStartFormat.format('HH:mm');
	var timeEnd = timeEndFormat.format('HH:mm');
	
	var programName = Ti.UI.createLabel({
		text: _program.name,
		textAlign: 'left',
		left: 155,
		font:{fontWeight:'bold',fontSize:17},
		height: 30,
		width: 142,
		top: 7
	});
	row.add(programName);
	
	var programTime = Ti.UI.createLabel({
		text: timeStart+' - '+timeEnd,
		color: '#333',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 35,
		left:155
	});
	row.add(programTime);
	
	var programImage = Ti.UI.createImageView({
		image: _program.photo,
		width:120,
		height:90
	});
	var programImageView = Ti.UI.createView({
		width: 133,
		height: 104,
		backgroundImage: 'images/ProgramImageBorder.png',
		top: 10,
		left:10,
		bottom:10
	});
	programImageView.add(programImage);
	row.add(programImageView);
	row.tvprogram = _program;
	return row;	
}
module.exports = ChannelInGuideTableViewRow;
