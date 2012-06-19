FriendsWindowTableViewRow = function(tabledata,_totalFriendCheckins){	
 
	var friendData = [];
	for(var i=0;i<tabledata.friends.length;i++){
		friendData.push(tabledata.friends[i].username);
	}	

	var row = Ti.UI.createTableViewRow({
		height: 150,
	});
	row.backgroundGradient = {	type: 'linear',startPoint: { x: '0%', y: '0%' },endPoint: { x: '0%', y: '100%' },
								colors: [ { color: '#fff', offset: 0.0}, { color: '#D0D0D0', offset: 1.0 }]};
    	

//Program
	var programLabelName = Ti.UI.createLabel({
		text: tabledata.programName,
		textAlign: 'left',
		color: '#333',
		left: 155,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 7
	});
	row.add(programLabelName);
	

	var programImage = Ti.UI.createImageView({
		image: tabledata.programImage,
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

	var checkinView = Ti.UI.createView({
		width: 52,
		bottom:5,
		left: 150,
		height: 47
	});
	var programNumCheckinImage = Ti.UI.createImageView({
		image: 'images/icon/watch.png',
		opacity: 0.5,
		top: 0
	});
	var programNumCheckin = Ti.UI.createLabel({
		text: '10',
		textAlign: 'left',
		color: '#898687',
		font: {fontSize: 14},
		bottom: 0
	});
	checkinView.add(programNumCheckin);
	checkinView.add(programNumCheckinImage);	
	row.add(checkinView);
	
	var programFriendCheckinView = Ti.UI.createView({
		width: 52,
		bottom:5,
		left: 202,
		height: 47
	});
	var programFriendCheckinImage = Ti.UI.createImageView({
		image: 'images/icon/friends.png',
		opacity: 0.5,
		top: 0
	});
	var programFriendTotalCheckin = Ti.UI.createLabel({
		text: _totalFriendCheckins,
		textAlign: 'left',
		color: '#898687',
		bottom: 0,
		font: {fontSize: 14},
	});
	programFriendCheckinView.add(programFriendTotalCheckin);
	programFriendCheckinView.add(programFriendCheckinImage);	
	row.add(programFriendCheckinView);

	var channelView = Ti.UI.createView({
		width: 52,
		bottom:5,
		right: 13,
		height: 47,
	});
	var ChannelImage = Ti.UI.createImageView({
		image: 'images/icon/tvchannel.png',
		opacity: 0.5,
		top: 3
	});
	var Channel = Ti.UI.createLabel({
		text: tabledata.programChannel,
		textAlign: 'left',
		color: '#898687',
		height: 20,
		font: {fontSize: 14},
		bottom: 0
	});
	channelView.add(Channel);
	channelView.add(ChannelImage);	
	row.add(channelView);
	
//Friend
	var dummyFriendsStr = "";
	for(var i=0;i<friendData.length;i++) {
		dummyFriendsStr += friendData[i]+',';
	}
	
	var friendsScrollView = Ti.UI.createScrollView({
		contentWidth:400,
		contentHeight:20,
		bottom:0,
		height:30,
		width:320,
	});
	row.add(friendsScrollView);
	
	// var friendsLabel = Ti.UI.createLabel({
		// text: dummyFriendsStr,
		// textAlign: 'left',
		// color: '#333',
		// font:{fontWeight:'bold',fontSize:17},
		// top: 5
	// });
	// friendsScrollView.add(friendsLabel);
	
	var friendsProfileImage = Ti.UI.createImageView({
		image: 'http://www.freestockimages.net/images/author-avatar.jpg',
		width: 25,
		height: 25,
		left: 10
	});
	friendsScrollView.add(friendsProfileImage);

	return row;
}
module.exports = FriendsWindowTableViewRow;
