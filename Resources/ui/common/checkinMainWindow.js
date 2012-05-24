Checkin = function (_datafromrow){
	
	var CheckinACS = require('acs/checkinACS');
	var CheckinModel = require('model/checkin');
	var PointACS = require('acs/pointACS');
	var PointModel = require('model/point');
	var BadgeCondition = require('helpers/badgeCondition');
	var TVProgram = require('model/tvprogram');
	var checkinPoint = 10;
	
	var userID = '4fa17dd70020440df700950c';

	var self = Ti.UI.createWindow({
		title: 'Selected Program',
		backgroundColor: 'orange'
	});
	
	var headerView = Ti.UI.createView({
		top: 0,
		height: 110,
		backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]
    	} 
	});
	self.add(headerView);

////////////////////////////////Header detail
	var programTitle = Ti.UI.createLabel({
		text: _datafromrow.programTitle,
		textAlign: 'left',
		color: '#333',
		left: 145,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 10
	});
	headerView.add(programTitle);
	
	var programSubname = Ti.UI.createLabel({
		text: _datafromrow.programSubname,
		color: '#333',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 33,
		left:145
	});
	headerView.add(programSubname);
	
	var programImage = Ti.UI.createImageView({
		image: _datafromrow.programImage,
		width:125,
		height:90
	});
		var programImageView = Ti.UI.createView({
		width: 131,
		height: 96,
		borderColor: '#D1CBCD',
		borderWidth: 1,
		backgroundColor: '#fff',
		top: 10,
		left:5,
		bottom:10
	});
	programImageView.add(programImage);
	headerView.add(programImageView);
	
	
	var channelView = Ti.UI.createView({
		width: 52,
		bottom:5,
		right: 10,
		height: 47,
	});
	var programChannelImage = Ti.UI.createImageView({
		image: 'images/icon/tvchannel.png',
		opacity: 0.5,
		top: 3
	});
	var programChannel = Ti.UI.createLabel({
		text: _datafromrow.programChannel,
		textAlign: 'left',
		color: '#898687',
		height: 20,
		font: {fontSize: 14},
		bottom: 0
	});
	channelView.add(programChannel);
	channelView.add(programChannelImage);	
	headerView.add(channelView);
	
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
		text: _datafromrow.programNumCheckin,
		textAlign: 'left',
		color: '#898687',
		font: {fontSize: 14},
		bottom: 0
	});
	checkinView.add(programNumCheckin);
	checkinView.add(programNumCheckinImage);	
	headerView.add(checkinView);
	
	var friendView = Ti.UI.createView({
		width: 52,
		bottom:5,
		left: 202,
		height: 47
	});
	var programNumFriendImage = Ti.UI.createImageView({
		image: 'images/icon/friends.png',
		opacity: 0.5,
		top: 0
	});
	var programNumFriend = Ti.UI.createLabel({
		text: _datafromrow.programNumCheckin,
		textAlign: 'left',
		color: '#898687',
		bottom: 0,
		font: {fontSize: 14},
	});
	friendView.add(programNumFriend);
	friendView.add(programNumFriendImage);	
	headerView.add(friendView);		
	
///////////////////////////////////////////////////Checkin Section

	var checkinView = Ti.UI.createView({
		backgroundImage: 'images/bgcheckin.png',
		top: 110
	});
	self.add(checkinView);
	
	var checkinButton = Ti.UI.createButton({
		title: 'Check-in',
		width: 180,
		height: 40,
		top: 110
	});
	self.add(checkinButton);
	
	checkinButton.addEventListener('click',function(){
		CheckinACS.checkinACS_createCheckin(_datafromrow.programId);
	});
	
	function oneCheckinUpdatedCallback(_checkinID) {
		PointACS.pointACS_createPoint(userID,checkinPoint,'checkin',_checkinID.id);
		// checkinCount.text = CheckinModel.checkins_count(userID);
		BadgeCondition.badgeCondition_check();
		
		var num = TVProgram.TVProgramModel_countCheckins(_datafromrow.programId);
		programNumCheckin.text = programNumCheckin.text + 1;
		Ti.App.fireEvent('updateNumCheckinAtDiscovery'+_datafromrow.programId,{numCheckin:num});
		Ti.App.fireEvent('updateHeaderCheckin');
	}
	
	Ti.App.addEventListener('oneCheckinUpdated',oneCheckinUpdatedCallback);

	
	self.addEventListener("close", function(e) {
		Ti.App.removeEventListener('oneCheckinUpdated',oneCheckinUpdatedCallback);
	});

	self.showNavBar();

	return self;
	
}
module.exports = Checkin;
