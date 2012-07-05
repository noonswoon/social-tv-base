CheckinMainWindow = function (_tvprogramData, _containingTab){

	var CheckinACS = require('acs/checkinACS');
	var PointACS = require('acs/pointACS');
	var LeaderBoardACS = require('acs/leaderBoardACS');
	var ActivityACS = require('acs/activityACS');
	var CheckinModel = require('model/checkin');
	var BadgeCondition = require('helpers/badgeCondition');
	
	var TVProgram = require('model/tvprogram');
	
	var updateActivity = require('helpers/updateActivity');
	
	var checkinPoint = 10;
	
	var userID = acs.getUserId();
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/back_button.png',
        width:57,height:34
	});
	
	var self = Ti.UI.createWindow({
		title: 'Selected Program',
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
		//opacity: 0.5,
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
		//opacity: 0.5,
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
		text: _tvprogramData.programNumCheckin,
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
		backgroundImage: 'images/checkinBG.png'
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
	
	var eventId = _tvprogramData.eventId;
	var checkin = CheckinModel.checkin_isCheckin(eventId);
	
	//Checkin Button
	if(checkin === false){
		messageboardView.touchEnabled = false;
		chatView.touchEnabled = false;
		productView.touchEnabled = false;
		
		checkinView.addEventListener('touchstart',function(){
			remote.backgroundImage = 'images/checkin/checkin_remote.png';
		});
		checkinView.addEventListener('touchend',function(){
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
		
			var allIdDataForACS = ActivityDataIdForACS[1];	//idArray
			// checkinId / leaderboardId / activityId
			var checkinId = allIdDataForACS[0]; 			//local id
			var leaderboardId = allIdDataForACS[1]; 		//acs id
			var activityId = allIdDataForACS[2]; 			//local id

			//require callback from acs
			CheckinACS.checkinACS_createCheckin(checkinData,checkinId);//UPDATE DONE:)
			ActivityACS.activityACS_createMyActivity(activityData,activityId);		
			
			//done after adding to acs
			PointACS.pointACS_createPoint(leaderboardData,_tvprogramData.eventId,'checkin');
			LeaderBoardACS.leaderACS_updateUserInfo(leaderboardId,leaderboardData.point);
			
			//check badge condition from checkin
			checkinData.program_type = _tvprogramData.programType;
			Ti.API.info('calling BadgeCondition.checkinEvent // checkinData.program_type: '+checkinData.program_type);
			BadgeCondition.checkinEvent(checkinData);
			myCurrentCheckinPrograms.push(_tvprogramData.programId);
			Ti.API.info('firing checinToProgram event!');
			Ti.App.fireEvent('checkinToProgram', {'checkinProgramId': _tvprogramData.programId, 'checkinProgramName':_tvprogramData.programTitle});
		});
	}
	else{
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
	});
	
	//Chat Button
	chatView.addEventListener('touchstart',function(){
		remote.backgroundImage = 'images/checkin/groupchat-hilight_remote.png';
	});
	chatView.addEventListener('touchend',function(){
		remote.backgroundImage = 'images/checkin/checkin_remote.png';
		curTabGroup.setActiveTab(1)
	});
	
	//Product Button
	productView.addEventListener('touchstart',function(){
		remote.backgroundImage = 'images/checkin/product-hilight_remote.png';
	});
	productView.addEventListener('touchend',function(){
		remote.backgroundImage = 'images/checkin/checkin_remote.png';
		curTabGroup.setActiveTab(3)
	});
	

	function update1checkinCallBack(e) {
		var num = TVProgram.TVProgramModel_countCheckins(_tvprogramData.eventId);
		
		programNumCheckin.text = programNumCheckin.text + 1;
		CheckinModel.checkin_updateOne(e.fetchedACheckin);
	
		CheckinACS.checkinACS_fetchedUserTotalCheckIns(userID);
		
		//TODO: create facebook popup
		var FacebookSharing = require('helpers/facebookSharing');
		alert(e.fetchedACheckin);
		FacebookSharing.checkinPopUpOnFacebook(e.fetchedACheckin);
		
		Ti.App.fireEvent('updateNumCheckinAtDiscovery'+_tvprogramData.eventId,{numCheckin:num});
		Ti.App.fireEvent('updateHeaderCheckin');
		Ti.App.fireEvent('leaderDbUpdated');
	};
	Ti.App.addEventListener('update1checkin', update1checkinCallBack);

	self.addEventListener("close", function(e) {
		Ti.App.removeEventListener('update1checkin', update1checkinCallBack);
	});

	self.showNavBar();

	return self;
}
module.exports = CheckinMainWindow;
