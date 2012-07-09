MessageboardHeader = function(_showName,_showSubName) {
	//UI stuff
	var header = Ti.UI.createView({
		top: 0,
		height: 121
	});
	header.backgroundGradient = {
       		type: 'linear',
       		startPoint: { x: '0%', y: '0%' },
       		endPoint: { x: '0%', y: '100%' },
       		colors: [ { color: '#fff', offset: 0.0}, { color: '#D0D0D0', offset: 1.0 } ]
    };

	header.programImage = Ti.UI.createImageView({
		image: '_curTVProgram.photo',
		width:120,
		height:90
	});
	header.programImageView = Ti.UI.createView({
		width: 133,
		height: 104,
		backgroundImage: 'images/ProgramImageBorder.png',
		top: 10,
		left:10,
		bottom:10
	});

	header.programTitle = Ti.UI.createLabel({
		text: _showName,
		textAlign: 'left',
		color: '#333',
		left: 155,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 7
	});
	
	header.subNameTitle = Ti.UI.createLabel({
		text: _showSubName,
		color: '#333',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 35,
		left:155
	});
	
	header.checkinView = Ti.UI.createView({
		width: 52,
		bottom:5,
		left: 150,
		height: 47
	});
	header.programNumCheckinImage = Ti.UI.createImageView({
		image: 'images/icon/cs_watch.png',
		top: 0
	});
	header.programNumCheckin = Ti.UI.createLabel({
		text: '50',
		textAlign: 'left',
		color: '#898687',
		font: {fontSize: 14},
		bottom: 0
	});

	header.friendView = Ti.UI.createView({
		width: 52,
		bottom:5,
		left: 202,
		height: 47
	});
	header.programNumFriendImage = Ti.UI.createImageView({
		image: 'images/icon/cs_friends.png',
		width:30,height:30,
		top: 0
	});
	header.programNumFriend = Ti.UI.createLabel({
		text: '2',
		textAlign: 'left',
		color: '#898687',
		bottom: 0,
		font: {fontSize: 14},
	});

	header.channelView = Ti.UI.createView({
		width: 52,
		bottom:5,
		right: 13,
		height: 47,
	});
	header.programChannelImage = Ti.UI.createImageView({
		image: 'images/icon/cs_tvchannel.png',
		top: 3
	});
	header.programChannel = Ti.UI.createLabel({
		text: 'ch3',
		textAlign: 'left',
		color: '#898687',
		height: 20,
		font: {fontSize: 14},
		bottom: 0
	});


	header._setHeader = function(_headerTitle, _headerSubTitle, _headerPhoto, _headerNumCheckins, _headerChannel) {
		header.programTitle.text = _headerTitle;
		header.subNameTitle.text = _headerSubTitle;
		header.programImage.image = _headerPhoto;
		header.programNumCheckin.text = _headerNumCheckins;
		header.programChannel.text = _headerChannel;
	};

	
	//ADDING UI COMPONENTS
	header.add(header.programTitle);
	header.add(header.subNameTitle);
	header.programImageView.add(header.programImage);
	header.add(header.programImageView);
	header.checkinView.add(header.programNumCheckin);
	header.checkinView.add(header.programNumCheckinImage);	
	header.add(header.checkinView);
	header.channelView.add(header.programChannel);
	header.channelView.add(header.programChannelImage);	
	header.add(header.channelView);
	header.friendView.add(header.programNumFriend);
	header.friendView.add(header.programNumFriendImage);	
	header.add(header.friendView);
	
	return header;
}

module.exports = MessageboardHeader;
