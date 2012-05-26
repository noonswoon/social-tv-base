MessageboardHeader = function(_showName,_showSubName) {
	//UI stuff
	var header = Ti.UI.createView({
		top: 0,
		left:0,
		height: 120,
		backgroundColor: 'white'
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
	
	//ADDING UI COMPONENTS
	header.add(header.thumbnail);
	header.add(header.nameLabel);
	header.add(header.subNameLabel);
	header.add(header.peopleIcon);
	header.add(header.numCheckinsLabel);
	header.add(header.friendIcon);
	header.add(header.numFriendsLabel);
	return header;
}

module.exports = MessageboardHeader;
