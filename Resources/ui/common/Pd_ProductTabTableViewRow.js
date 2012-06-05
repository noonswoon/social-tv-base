ProductTabTableViewRow = function(_programId, _programName){

	var row = Ti.UI.createTableViewRow({
		height: 50,
		programId: _programId,
		programName: _programName
	});
	
	var programName = Ti.UI.createLabel({
		text: _programName,
		textAlign: 'left',
		left: 120,
		font:{fontWeight:'bold',fontSize:18},
		top: 10
	});
	row.add(programName);

	var programImage = Ti.UI.createImageView({
		image: 'dummy.png',
		top: 5,
		left: 10,
		bottom: 5,
		width:125,
		height:40
	});
	row.add(programImage);
	
	return row;
	
}
module.exports = ProductTabTableViewRow;