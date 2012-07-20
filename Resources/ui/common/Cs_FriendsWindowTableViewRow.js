FriendsWindowTableViewRow = function(_checkinProgram){
	var UserModel = require('model/user')
	
	var BadgeCondition = require('helpers/badgeCondition');	
	var numFriendsCheckin = _checkinProgram.friends.length;

	var row = Ti.UI.createTableViewRow({
		height: 150,
	});
	row.backgroundGradient = { 
		type: 'linear',
		startPoint: {x: '0%', y: '0%'},
		endPoint: {x: '0%', y: '100%'},
		colors: [{color: '#fff', offset: 0.0}, {color: '#D0D0D0', offset: 1.0}]};
    	
	//Program
	var programLabelName = Ti.UI.createLabel({
		text: _checkinProgram.programName,
		textAlign: 'left',
		color: '#333',
		left: 145,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 7
	});
	row.add(programLabelName);

	 var programLabelSubname = Ti.UI.createLabel({
		 text: _checkinProgram.programSubName,
		 color: '#333',
		 textAlign:'left',
		 font:{fontWeight:'bold',fontSize:13},
		 top: 35,
		 left:145
	 });
	 row.add(programLabelSubname);
	
	var programImage = Ti.UI.createImageView({
		image: _checkinProgram.programImage,
		width:110,
		height:80
	});
	
	var programImageView = Ti.UI.createView({
		width: 123,
		height: 94,
		backgroundImage: 'images/ProgramImageBorder.png',
		top: 5,
		left: 5,
		bottom:10
	});
	programImageView.add(programImage);
	row.add(programImageView);

	var checkinView = Ti.UI.createView({
		width: 52,
		top:55,
		left: 135,
		height: 47
	});
	
	var programNumCheckinImage = Ti.UI.createImageView({
		image: 'images/icon/cs_watch.png',
		top: 0
	});	
	
	var programNumCheckin = Ti.UI.createLabel({
		text: _checkinProgram.numberCheckins,
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
		top:55,
		left: 187,
		height: 47
	});
	
	var programFriendCheckinImage = Ti.UI.createImageView({
		image: 'images/icon/cs_friends.png',
		top: 0
	});
	var programFriendTotalCheckin = Ti.UI.createLabel({
		text: numFriendsCheckin,
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
		top:55,
		right: 28,
		height: 47,
	});
	
	var ChannelImage = Ti.UI.createImageView({
		image: 'images/icon/cs_tvchannel.png',
		top: 3
	});
	
	var Channel = Ti.UI.createLabel({
		text: _checkinProgram.programChannelId,
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
	var friendsScrollView = Ti.UI.createScrollView({
		contentWidth:400,
		contentHeight:45,
		bottom:3,
		height:45,
		width:320,
	});

	for(var i = 0; i < numFriendsCheckin; i++) {
		var friendUserObj = UserModel.userModel_fetchUserProfile(_checkinProgram.friends[i]);
		var fbId = friendUserObj.fb_id;
		var friendsProfileImage = Ti.UI.createImageView({
			image: 'images/kuma100x100.png',
			width: 40,
			height: 40,
			borderWidth: 2,
			borderColor: 'white',
			left: (i*45)+10,
		});
		
		if(fbId !== 0 || fbId !== "0")
			friendsProfileImage.image = acs.getUserImageSquareOfFbId(fbId);
		
		friendsScrollView.add(friendsProfileImage);
	}
	
	row.add(friendsScrollView);
	row.tvprogram = _checkinProgram;
	
	Ti.App.addEventListener('updateNumCheckinAtDiscovery'+_checkinProgram.eventId,function(e){
		_checkinProgram.numberCheckins = _checkinProgram.numberCheckins + e.numCheckin;
		row.tvprogram = _checkinProgram;  //need to reset to make it update the row.tvprogram
		programNumCheckin.text = _checkinProgram.numberCheckins;
	});	
	
	return row;
}
module.exports = FriendsWindowTableViewRow;