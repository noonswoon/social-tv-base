FriendsWindowTableViewRow = function(tabledata,_checkins){

	var BadgeCondition = require('helpers/badgeCondition');	
	var friendData = [];	
	var friendCheckIns = tabledata.friends.length;
	for(var i=0;i<friendCheckIns;i++){
		friendData.push(tabledata.friends[i].username);
	}	

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
		text: tabledata.programName,
		textAlign: 'left',
		color: '#333',
		left: 145,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 7
	});
	row.add(programLabelName);

//TODO:no program subname
	 var programLabelSubname = Ti.UI.createLabel({
		 text: 'tabledata.programSubName',//tabledata.programSubName,
		 color: '#333',
		 textAlign:'left',
		 font:{fontWeight:'bold',fontSize:13},
		 top: 35,
		 left:140
	 });
	Ti.API.info(tabledata);
	 row.add(programLabelSubname);
	
	var programImage = Ti.UI.createImageView({
		image: tabledata.programImage,
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
		left: 125,
		height: 47
	});
	var programNumCheckinImage = Ti.UI.createImageView({
		image: 'images/icon/cs_watch.png',
		top: 0
	});
	var programNumCheckin = Ti.UI.createLabel({
		text: _checkins,
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
		left: 177,
		height: 47
	});
	
	var programFriendCheckinImage = Ti.UI.createImageView({
		image: 'images/icon/cs_friends.png',
		top: 0
	});
	var programFriendTotalCheckin = Ti.UI.createLabel({
		text: friendCheckIns,
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
		right: 38,
		height: 47,
	});
	var ChannelImage = Ti.UI.createImageView({
		image: 'images/icon/cs_tvchannel.png',
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
		contentHeight:45,
		bottom:3,
		height:45,
		width:320,
	});

	for(var i=0;i<friendCheckIns;i++) {
		var friends = tabledata.friends;
		var fbId = 0;
		var numExternalAccounts = friends[i].external_accounts;
	 					
		for(var j=0;j < numExternalAccounts.length; j++) {
			 var curExternalAccount = friends[i].external_accounts[j];
			 if(curExternalAccount.external_type === "facebook") {
				 fbId = curExternalAccount.external_id;
				 break;
			}
		 }	
		var friendsProfileImage = Ti.UI.createImageView({
			image: 'images/kuma100x100.png',
			width: 40,
			height: 40,
			borderWidth: 2,
			borderColor: 'white',
			left: (i*45)+10,
		});
		
		if(fbId!==0) friendsProfileImage.image = acs.getUserImageNormalOfFbId(fbId);
		
		friendsScrollView.add(friendsProfileImage);
	}

/////////////////////////////////////////////////////////////////////////////
//badge condition check!
	Ti.API.info('friendCheckIn = '+friendCheckIns);
	if(friendCheckIns > 0) BadgeCondition.checkFriendCondition(friendCheckIns);
//////////////////////////////////////////////////////////////////////////////
	
	row.add(friendsScrollView);
	row.tvprogram = tabledata;
	row.checkin = _checkins;
	row.frdCheckin = friendCheckIns;
	return row;
}
module.exports = FriendsWindowTableViewRow;