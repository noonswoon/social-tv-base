GuideTabTableViewRow = function(_channelId){
	
	var row = Ti.UI.createTableViewRow({
		height: 50
	});
	
	row.programName = Ti.UI.createLabel({
		text: 'Channel '+_channelId,
		textAlign: 'left',
		left: 120,
		font:{fontWeight:'bold',fontSize:18},
		top: 10
	});
	row.add(row.programName);

	row.programImage = Ti.UI.createImageView({
		image: 'dummy.png',
		top: 5,
		left: 10,
		bottom: 5,
		width:125,
		height:40
	});
	row.add(row.programImage);
	
	return row;
	
}
module.exports = GuideTabTableViewRow;
