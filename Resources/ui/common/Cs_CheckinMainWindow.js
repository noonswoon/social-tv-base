CheckinMainWindow = function (_tvprogramData, _containingTab){
		
	var CheckinACS = require('acs/checkinACS');
	var PointACS = require('acs/pointACS');
	var LeaderBoardACS = require('acs/leaderBoardACS');
	var ActivityACS = require('acs/activityACS');
	var BadgeCondition = require('helpers/badgeCondition');
	var updateActivity = require('helpers/updateActivity');

	var CheckinModel = require('model/checkin');		
	var TVProgram = require('model/tvprogram');
	var myUserId = acs.getUserId();
	
	Ti.include('./pubnub-chat.js');
	
//	Ti.API.info('tvprogramData: '+JSON.stringify(_tvprogramData));
	var numFriendsCheckin = CheckinModel.checkin_fetchNumFriendsCheckinsOfProgram(_tvprogramData.eventId,myUserId);
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/back_button.png',
        width:57,height:34
	});
	
	var self = Ti.UI.createWindow({
		title: L('Selected Program'),
		barImage: 'images/nav_bg_w_pattern.png',
	 	leftNavButton:backButton
	});
	
	backButton.addEventListener('click', function(){
   		self.close();
	});
	
	var curTabGroup = _containingTab.tabGroup;
	
	var headerView = Ti.UI.createView({
		top: 0,
		height: 121,
	});
	headerView.backgroundGradient = { type: 'linear',
       		startPoint: { x: '0%', y: '0%' },
       		endPoint: { x: '0%', y: '100%' },
       		colors: [ { color: '#fff', offset: 0.0}, { color: '#D0D0D0', offset: 1.0 } ] };
       		 
	self.add(headerView);

////////////////////////////////Header detail
	var programTitle = Ti.UI.createLabel({
		text: _tvprogramData.programTitle,
		textAlign: 'left',
		color: '#333',
		left: 155,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 10
	});
	headerView.add(programTitle);
	
	var programSubname = Ti.UI.createLabel({
		text: _tvprogramData.programSubname,
		color: '#333',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 35,
		left:155
	});
	headerView.add(programSubname);
	
	var programImage = Ti.UI.createImageView({
		image: _tvprogramData.programImage,
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
	headerView.add(programImageView);
	
	var channelView = Ti.UI.createView({
		width: 52,
		bottom:5,
		right: 10,
		height: 47,
	});
	var programChannelImage = Ti.UI.createImageView({
		image: 'images/icon/cs_tvchannel.png',
		top: 3
	});
	var programChannel = Ti.UI.createLabel({
		text: _tvprogramData.programChannel,
		textAlign: 'left',
		color: '#898687',
		height: 20,
		font: {fontSize: 14},
		bottom: 0
	});
	channelView.add(programChannel);
	channelView.add(programChannelImage);	
	headerView.add(channelView);
	
	var checkinNum = Ti.UI.createView({
		width: 52,
		bottom:5,
		left: 150,
		height: 47
	});
	var programNumCheckinImage = Ti.UI.createImageView({
		image: 'images/icon/cs_watch.png',
		top: 0
	});
	var programNumCheckin = Ti.UI.createLabel({
		text: _tvprogramData.programNumCheckin,
		textAlign: 'left',
		color: '#898687',
		font: {fontSize: 14},
		bottom: 0
	});
	checkinNum.add(programNumCheckin);
	checkinNum.add(programNumCheckinImage);	
	headerView.add(checkinNum);
	
	var friendView = Ti.UI.createView({
		width: 52,
		bottom:5,
		left: 202,
		height: 47
	});
	var programNumFriendImage = Ti.UI.createImageView({
		image: 'images/icon/cs_friends.png',
		top: 0
	});
	var programNumFriend = Ti.UI.createLabel({
		text: numFriendsCheckin,
		textAlign: 'left',
		color: '#898687',
		bottom: 0,
		font: {fontSize: 14},
	});
	friendView.add(programNumFriend);
	friendView.add(programNumFriendImage);	
	headerView.add(friendView);		
		
///////////////////////////////////////////////////Checkin Section

	var checkinSection = Ti.UI.createView({
		top: 121,
		left:0,
		height: 265,
		width:320,
		backgroundImage: 'images/checkin/checkin_bg.png'
	});

	var remote = Ti.UI.createView({
		backgroundImage: 'images/checkin/uncheckin_remote.png',
		width: 230,
		height: 232,
		top: 8
	});

	self.add(checkinSection);
	checkinSection.add(remote);
	
	var checkinView = Ti.UI.createView({
		top: 215,
		left: 130,
		width: 60,
		height: 60,
		backgroundColor: 'transparent',
		opacity: 0.3,
		zIndex: 3
	});
	self.add(checkinView);
	
	var meView = Ti.UI.createView({
		top: 206,
		right: 53,
		width: 68,
		height: 85,
		backgroundColor: 'transparent',
		opacity: 0.3,
		zIndex: 3
	});
	self.add(meView);
	
	var messageboardView = Ti.UI.createView({
		top: 141,
		width: 93,
		height: 59,
		right: 115,
		backgroundColor: 'transparent',
		opacity: 0.3,
		zIndex: 3
	});
	self.add(messageboardView);
	
	var chatView = Ti.UI.createView({
		top: 199,
		left: 55,
		width: 59,
		height: 94,
		backgroundColor: 'transparent',
		opacity: 0.3,
		zIndex: 3
	});
	self.add(chatView);
	
	var productView = Ti.UI.createView({
		top: 290,
		left: 113,
		width: 97,
		height: 57,
		backgroundColor: 'transparent',
		opacity: 0.3,
		zIndex: 3
	});
	self.add(productView);
	
	var checkin = CheckinModel.checkin_isCheckin(_tvprogramData.eventId,myUserId);

	var checkinPopup = function(_gotbadge){
		var popupView = Ti.UI.createView({
			backgroundColor: 'transparent',
			backgroundImage: 'images/checkin/checkin_success.png',
			top: 100,
			height: 96, width: 243,
			zIndex: 500,
		});
		
		var popupMessage = Ti.UI.createLabel({
			//text: '',
			color: '#262a21',
			font: {fontSize: 14},
			top: 2,
			textAlign: 'center',
			verticalAlign: 'top',
			width: 225, height: 60,
		});
		
		if(_gotbadge) {
			popupMessage.text = 'Congratulations! You just got a new badge from checking in to '+_tvprogramData.programTitle;
			popupView.backgroundImage = 'images/checkin/checkin_success_badge.png';
		} else {
			popupMessage.text = 'Check In to '+_tvprogramData.programTitle+' completed. You just earned 5 points!';
		}
		
		popupView.add(popupMessage);
		self.add(popupView);
		 setTimeout(function() {
			self.remove(popupView);
		},4000);
	}
	
	//Checkin Button
	if(checkin === false){
		messageboardView.touchEnabled = false;
		chatView.touchEnabled = false;
		productView.touchEnabled = false;
		
		checkinView.addEventListener('touchstart',function(){
			//remote.backgroundImage = 'images/checkin/checkin_remote.png';
		});
		
		checkinView.addEventListener('touchend',function() {
			var checkinEnable = false;
			var now = moment().format('YYYY-MM-DDTHH:mm:ss');
			if(_tvprogramData.programStarttime <= now && now <= _tvprogramData.programEndtime) {
				checkinEnable = true;
			} 
			
			if(checkinEnable) {	
				Ti.Analytics.featureEvent('checkin.program',{user:myUserId, tvprogram: _tvprogramData});
				Titanium.Media.vibrate();
				//changeImage of checkin here
				remote.backgroundImage = 'images/checkin/checkin_remote.png';
				checkinView.touchEnabled = false;
				messageboardView.touchEnabled = true;
				chatView.touchEnabled = true;
				productView.touchEnabled = true;
				
				var ActivityDataIdForACS = updateActivity.updateActivity_myDatabase('checkin',_tvprogramData);
			
				var allActivityDataForACS =  ActivityDataIdForACS[0];	//resultArray
				//checkinData / leaderboardData / activityData	
				var checkinData = allActivityDataForACS[0];
				var leaderboardData = allActivityDataForACS[1];
				var activityData = allActivityDataForACS[2];
			
				var allIdDataForACS = ActivityDataIdForACS[1];			//idArray
				// checkinId / leaderboardId / activityId
				var checkinId = allIdDataForACS[0]; 					//local id
				var leaderboardId = allIdDataForACS[1];			 		//acs id
				var activityId = allIdDataForACS[2]; 					//local id
	
				//increment number checkins by one
				TVProgram.TVProgramModel_incrementCheckins(_tvprogramData.eventId);

				//require callback from acs
				CheckinACS.checkinACS_createCheckin(checkinData,checkinId);
				ActivityACS.activityACS_createMyActivity(activityData,activityId);		
				
				// done after adding to acs
				PointACS.pointACS_createPoint(leaderboardData,_tvprogramData.eventId,'checkin');
				LeaderBoardACS.leaderACS_updateUserInfo(leaderboardId,leaderboardData.point);
				
				//check badge condition from checkin
				checkinData.program_type = _tvprogramData.programType;
				checkinData.program_id = _tvprogramData.programId;

				isGottenBadgeFromEvent = BadgeCondition.checkinEvent(checkinData);
				isGottenBadgeFromFriends = BadgeCondition.checkFriendCondition(numFriendsCheckin);
				//Ti.API.info('isGottenBadgeFromEvent = '+isGottenBadgeFromEvent+', isGottenBadgeFromFriends: '+isGottenBadgeFromFriends);
				checkinPopup(isGottenBadgeFromEvent || isGottenBadgeFromFriends);
								
				Ti.App.fireEvent('checkinToProgram', {'checkinProgramId': _tvprogramData.programId, 'checkinProgramName':_tvprogramData.programTitle});
			} else {
			Ti.Analytics.featureEvent('checkin.program.timeinvalid',{user:myUserId, tvprogram: _tvprogramData});
			var checkinWarningMessage = "";
				if(now < _tvprogramData.programStarttime)
					checkinWarningMessage = L("The program hasn't started yet!");
				else if(now > _tvprogramData.programEndtime)
					checkinWarningMessage = L("The program is already finished!");
				else checkinWarningMessage = L("Please try again later.");
				
				var checkinWarningDialog = Titanium.UI.createAlertDialog({
		       		title:L('You cannot Check In'),
		         	message:checkinWarningMessage
		       	});
		       	checkinWarningDialog.show();
			}
		});
	} else{
		remote.backgroundImage = 'images/checkin/checkin_remote.png';
		checkinView.touchEnabled = false;
	}
	
	//Me Button
	meView.addEventListener('touchstart',function(){
		if(remote.backgroundImage === 'images/checkin/uncheckin_remote.png'){
			remote.backgroundImage = 'images/checkin/me-hilight-uncheckin_remote.png';		
		}
		else{
			remote.backgroundImage = 'images/checkin/me-hilight-checkin_remote.png';
		}
	});
	meView.addEventListener('touchend',function(){
		if(remote.backgroundImage === 'images/checkin/me-hilight-uncheckin_remote.png'){
			remote.backgroundImage = 'images/checkin/uncheckin_remote.png';
		}
		else{
			remote.backgroundImage = 'images/checkin/checkin_remote.png';
		}	
		curTabGroup.setActiveTab(4);
	});
	
	//Messageboard Button
	messageboardView.addEventListener('touchstart',function(){
		remote.backgroundImage = 'images/checkin/messageboard-hilight_remote.png';
	});
	messageboardView.addEventListener('touchend',function(){
		remote.backgroundImage = 'images/checkin/checkin_remote.png';
		curTabGroup.setActiveTab(2);
		Ti.App.fireEvent('changingCurrentSelectedProgram',{newSelectedProgram:_tvprogramData.programId});
	});
	
	//Chat Button
	chatView.addEventListener('touchstart',function(){
		remote.backgroundImage = 'images/checkin/groupchat-hilight_remote.png';
	});
	chatView.addEventListener('touchend',function(){
		remote.backgroundImage = 'images/checkin/checkin_remote.png';

		//open the show's chat window straight away
		var pubnub_chat_window = Ti.App.Chat({
		    "chat-room" : _tvprogramData.programId,
		    "window"    : {backgroundColor:'transparent'},
		    "programId" : _tvprogramData.programId
		});
		_containingTab.open(pubnub_chat_window.chat_window);
	});
	
	//Product Button
	productView.addEventListener('touchstart',function(){
		remote.backgroundImage = 'images/checkin/product-hilight_remote.png';
	});
	productView.addEventListener('touchend',function(){
		remote.backgroundImage = 'images/checkin/checkin_remote.png';
		curTabGroup.setActiveTab(3)
		Ti.App.fireEvent('changingCurrentSelectedProgram',{newSelectedProgram:_tvprogramData.programId});
	});
	
	var notifyFriendsAboutCheckin = function(){
		var currentUser = acs.getUserLoggedIn();
		var PushNotificationCTB = require('ctb/pushnotificationCTB');
		var FriendModel = require('model/friend');
		var friendsList = FriendModel.friendModel_fetchFriend(myUserId);
		for(var i=0; i<friendsList.length; i++) {
			var textPn = currentUser.first_name+L(' just checked in to ')+_tvprogramData.programTitle+L('. Let watch together!');
			//Ti.API.info('sending pn: '+textPn);
			PushNotificationCTB.pushNotificationCTB_sendPN(friendsList[i].friend_id,2,textPn);
		}
	}
	
	var update1checkinCallBack = function(e) {
		var num = TVProgram.TVProgramModel_countCheckins(_tvprogramData.eventId);
		var FacebookSharing = require('helpers/facebookSharing');		
		programNumCheckin.text = programNumCheckin.text + 1;
		CheckinModel.checkin_updateOne(e.fetchedACheckin, myUserId);
		FacebookSharing.checkinPopUpOnFacebook(e.fetchedACheckin,_tvprogramData.programImage);
		Ti.App.fireEvent('updateNumCheckinAtDiscovery'+_tvprogramData.eventId,{numCheckin:num});
		Ti.App.fireEvent('updateHeaderCheckin');
		Ti.App.fireEvent('leaderDbUpdated');
		Ti.App.fireEvent('friendsDbUpdated'); //update friend channel selection
		notifyFriendsAboutCheckin();
	};
	Ti.App.addEventListener('update1checkin', update1checkinCallBack);

	self.addEventListener("close", function(e) {
		Ti.App.removeEventListener('update1checkin', update1checkinCallBack);
	});

	self.showNavBar();
	return self;
}
module.exports = CheckinMainWindow;
