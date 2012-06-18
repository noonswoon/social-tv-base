CheckinMainWindow = function (_tvprogramData, _containingTab){
	
	var CheckinACS = require('acs/checkinACS');
	var CheckinModel = require('model/checkin');
	var PointACS = require('acs/pointACS');
	var LeaderBoardACS = require('acs/leaderBoardACS');
	var ActivityACS = require('acs/activityACS');
	var ActivityModel = require('model/activity');
	var BadgeCondition = require('helpers/badgeCondition');
	var TVProgram = require('model/tvprogram');
	
	var updateActivity = require('helpers/updateActivity');
	
	var checkinPoint = 10;
	
	var userID = acs.getUserId();
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/Backbutton.png',
        width:57,height:34
	});
	
	var self = Ti.UI.createWindow({
		title: 'Selected Program',
		barImage: 'images/NavBG.png',
	 	leftNavButton:backButton
	});
	
	backButton.addEventListener('click', function(){
   		self.close();
	});
	
	var curTabGroup = _containingTab.tabGroup;
	
	var headerView = Ti.UI.createView({
		top: 0,
		height: 121,
		backgroundGradient: {
       		type: 'linear',
       		startPoint: { x: '0%', y: '0%' },
       		endPoint: { x: '0%', y: '100%' },
       		colors: [ { color: '#fff', offset: 0.0}, { color: '#D0D0D0', offset: 1.0 } ]
    	} 
	});
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
		image: 'images/icon/tvchannel.png',
		opacity: 0.5,
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
		text: _tvprogramData.programNumCheckin,
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

	var checkinView = Ti.UI.createView({
		top: 121,
		left:0,
		height: 265,
		width:320,
		backgroundImage: 'images/checkin/checkin_bg.png'
	});

	//add button as image
	var meButton = Ti.UI.createImageView({
		image: '/images/checkin/checkin_me_enable.png',
		right: 43,
		width:89,
		height: 167,
		touchEnabled: true,
	});

	var chatButton = Ti.UI.createImageView({
		image: '/images/checkin/checkin_chat.png',
		left: 43,
		width:89,
		height: 167,
		touchEnabled: false		
	});
	
	var boardButton = Ti.UI.createImageView({
		image: '/images/checkin/checkin_board.png',
		top: 16,
		width: 166,
		height: 89,
		touchEnabled: false
	});

	var productButton = Ti.UI.createImageView({
		image: '/images/checkin/checkin_products.png',
		bottom: 16,
		width: 167,
		height: 89,
		touchEnabled: false
	});

	var checkinButton = Ti.UI.createButton({
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		image: '/images/checkin/checkin_check.png',
		borderRadius: 42.5,
		width:85,
		height:85,
	});

	
	//Add UI
	self.add(checkinView);
	checkinView.add(meButton);
	checkinView.add(chatButton);
	checkinView.add(boardButton);
	checkinView.add(productButton);
	checkinView.add(checkinButton);
	
	var eventId = _tvprogramData.eventId;
	var checkin = CheckinModel.checkin_isCheckin(eventId);
	
	//This program is check-in or not
	if(checkin === true){
		checkinButton.enabled = false;
		chatButton.touchEnabled = true;
		productButton.touchEnabled =true;
		boardButton.touchEnabled = true;
		
		checkinButton.image = 'images/checkin/checkin_check_checked.png';
		chatButton.image = 'images/checkin/checkin_chat_enable.png';
		productButton.image = 'images/checkin/checkin_products_enable.png';
		boardButton.image = 'images/checkin/checkin_board_enable.png';	
	}
	
//////////////////////////////////////////////////////////////	
function isPointInPoly(poly, pt)
{
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) 
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) && (c = !c);
    return c;
}
	var boardPoint = [
		{x: 81, y:53},
		{x: 161, y:18},
		{x: 242, y:53},
		{x: 191, y:105},
		{x: 158, y:95},
		{x: 131, y:105}
	];			
	var mePoint = [
		{x: 192, y:108},
		{x: 243, y:55},
		{x: 277, y:136},
		{x: 246, y:214},
		{x: 192, y:162},
		{x: 203, y:134}
	];
	var productPoint = [
		{x: 189, y:163},
		{x: 243, y:216},
		{x: 161, y:243},
		{x: 81, y:218},
		{x: 130, y:165},
		{x: 162, y:175}
	];
	var chatPoint = [
		{x: 129, y:108},
		{x:	77, y:54},
		{x: 43, y:136},
		{x: 76, y:217},
		{x: 132, y:162},
		{x:120, y:134}
	];		
	
	self.addEventListener('touchstart',function(e){
		if(checkinButton.enabled===true){
			if(isPointInPoly(boardPoint, {x: e.x, y: e.y})||(isPointInPoly(productPoint, {x: e.x, y: e.y}))||(isPointInPoly(chatPoint, {x: e.x, y: e.y}))){
				alert('Check in to activate the control');
			}
			else if(isPointInPoly(mePoint, {x: e.x, y: e.y})){
				meButton.image = 'images/checkin/checkin_me_mouseover.png';
			}
		} else {
			if(isPointInPoly(boardPoint, {x: e.x, y: e.y})){
				boardButton.image = 'images/checkin/checkin_board_mouseover.png';
			}
			if(isPointInPoly(mePoint, {x: e.x, y: e.y})){
				meButton.image = 'images/checkin/checkin_me_mouseover.png';
			}
			if(isPointInPoly(productPoint, {x: e.x, y: e.y})){
				productButton.image = 'images/checkin/checkin_products_mouseover.png';
			}
			if(isPointInPoly(chatPoint, {x: e.x, y: e.y})){
				chatButton.image = 'images/checkin/checkin_chat_mouseover.png';
			}				
		}
	});

	self.addEventListener('touchend',function(e)
	{
		if(checkinButton.enabled===true){
			if(isPointInPoly(boardPoint, {x: e.x, y: e.y})||(isPointInPoly(productPoint, {x: e.x, y: e.y}))||(isPointInPoly(chatPoint, {x: e.x, y: e.y}))){
				//alert('Check in to activate the control');
			}
			else if(isPointInPoly(mePoint, {x: e.x, y: e.y})){
				meButton.image = 'images/checkin/checkin_me_enable.png';
			}
		} else {		
			if(isPointInPoly(boardPoint, {x: e.x, y: e.y})){
				boardButton.image = 'images/checkin/checkin_board_enable.png';
			}
			if(isPointInPoly(mePoint, {x: e.x, y: e.y})){
				meButton.image = 'images/checkin/checkin_me_enable.png';
			}
			if(isPointInPoly(productPoint, {x: e.x, y: e.y})){
				productButton.image = 'images/checkin/checkin_products_enable.png';
			}
			if(isPointInPoly(chatPoint, {x: e.x, y: e.y})){
				chatButton.image = 'images/checkin/checkin_chat_enable.png';
			}				
		}
	});	
/////////////////////////////////////////////////////////////
	
	checkinButton.addEventListener('click',function(){
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
		
		myCurrentCheckinPrograms.push(_tvprogramData.programId);
		checkinButton.enabled = false;
		checkinButton.image = 'images/checkin/checkin_check_checked.png';
		chatButton.image = 'images/checkin/checkin_chat_enable.png';
		productButton.image = 'images/checkin/checkin_products_enable.png';
		boardButton.image = 'images/checkin/checkin_board_enable.png';	
		
		Ti.App.fireEvent('checkinToProgram');	
	});
	
	chatButton.addEventListener('touchstart',function(){
		curTabGroup.setActiveTab(1)
	});
	
	boardButton.addEventListener('touchstart',function(){
		curTabGroup.setActiveTab(2);
	});

	productButton.addEventListener('touchstart',function(){
		curTabGroup.setActiveTab(3)
	});

	meButton.addEventListener('touchstart',function(){
		curTabGroup.setActiveTab(4)
	});

	function update1checkinCallBack(e) {
		var num = TVProgram.TVProgramModel_countCheckins(_tvprogramData.eventId);
		
		programNumCheckin.text = programNumCheckin.text + 1;
		CheckinModel.checkin_updateOne(e.fetchedACheckin);
	
		CheckinACS.checkinACS_fetchedUserTotalCheckIns(userID);
		
		Ti.App.fireEvent('updateNumCheckinAtDiscovery'+_tvprogramData.eventId,{numCheckin:num});
		Ti.App.fireEvent('updateHeaderCheckin');
		Ti.App.fireEvent('leaderDbUpdated');
	};
	Ti.App.addEventListener('update1checkin', update1checkinCallBack);

	function update1activityCallBack(e) {
		ActivityModel.activity_updateOne(e.fetchedAnActivity);
		Ti.App.fireEvent('activityDbUpdated');
	};
	Ti.App.addEventListener('update1activity',update1activityCallBack);

	self.addEventListener("close", function(e) {
		Ti.App.removeEventListener('update1checkin', update1checkinCallBack);
		Ti.App.removeEventListener('update1activity',update1activityCallBack);
		Ti.App.removeEventListener('checkinToProgram');
	});

	self.showNavBar();

	return self;
}
module.exports = CheckinMainWindow;
