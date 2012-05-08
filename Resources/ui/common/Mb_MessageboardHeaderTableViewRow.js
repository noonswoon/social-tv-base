MessageboardHeaderTableViewRow = function(_showName,_showSubName) {
	//UI stuff
	var header = Ti.UI.createTableViewRow({
		height: 140,
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	header.thumbnail = Ti.UI.createImageView({
		image: '/images/whitecollar.jpg',
		top: 5,
		left: 5,
		width: 120,
		height: 90,
		backgroundColor: '#CCC'
	});

	header.nameLabel = Ti.UI.createLabel({
		text: _showName,
		top: 5,
		left: 135,
		width: 'auto',
		height: 20
	});
	
	header.subNameLabel = Ti.UI.createLabel({
		text: _showSubName,
		top: 20,
		left: 135,
		width: 'auto',
		height: 20
	});
		
	header.peopleIcon = Ti.UI.createImageView({
		top: 70,
		left: 135,
		width: 20,
		height: 20,
		backgroundColor: '#CCC'
	});
	
	header.numCheckinsLabel = Ti.UI.createLabel({
		text: '13122',
		top: 70,
		left: 160,
		width: 60,
		height: 14
	}); 
	
	header.friendIcon = Ti.UI.createImageView({
		top: 70,
		left: 210,
		width: 20,
		height: 20,
		backgroundColor: '#CCC'
	});
	
	header.numFriendsLabel = Ti.UI.createLabel({
		text: '5',
		top: 70,
		left: 235,
		width: 40,
		height: 14
	});
	
	header.searchTextField = Ti.UI.createTextField({
		left: 10,
		top: 100,
		width: 200,
		height: 30,
		hintText: "Search here...",
		borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});
	
	header.addButton = Ti.UI.createButton({
		right: 10,
		top: 100,
		width: 30,
		height: 30,
		title: '+'
	});

	//ADDING UI COMPONENTS
	header.add(header.thumbnail);
	header.add(header.nameLabel);
	header.add(header.subNameLabel);
	header.add(header.peopleIcon);
	header.add(header.numCheckinsLabel);
	header.add(header.friendIcon);
	header.add(header.numFriendsLabel);
	header.add(header.searchTextField);
	header.add(header.addButton);
	
	return header;
}

module.exports = MessageboardHeaderTableViewRow;
