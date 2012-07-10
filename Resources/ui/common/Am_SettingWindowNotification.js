Am_SettingWindowNotification = function(){
	var PushNotificationCTB = require('ctb/pushnotificationCTB');
	var userId = acs.getUserId();
	var dataForSetting = [];
	
	PushNotificationCTB.pushNotificationCTB_getPNPermissions(userId);
	
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/Backbutton.png',
        width:57,height:34
	});

	var self = Ti.UI.createWindow({
		backgroundImage: '/images/admin/cb_back.png',
		barImage: 'images/NavBG.png',
		title: 'Notifications',
		leftNavButton: backButton
	});

	backButton.addEventListener('click', function(){
   		self.close();
	});

	var headerLabel = Ti.UI.createLabel({
		text: 'Receive a push notification when ...',
		color: 'white',
		font:{fontWeight:'bold',fontSize:16},
		left: 20,
		top: 20
	});
	self.add(headerLabel);
	
	var notificationTableView = Ti.UI.createTableView({
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'transparent',
		rowBackgroundColor:'white',
		height: 'auto',
		scrollable:false,
		top: 30
	});
	
	//get a comment
	var getCommentPNSwitch = Ti.UI.createSwitch({
		value: true,
		right: 10
	});

	var getCommentPNLabel = Ti.UI.createLabel({
		text: 'Your post gets comments',
		font:{fontWeight:'bold',fontSize:14},
		left: 10
	});
	
	var getCommentPN = Ti.UI.createTableViewRow({
		selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		height: 50
	});
	
	var friendCheckinPNSwitch = Ti.UI.createSwitch({
		value: true,
		right: 10
	});
	
	var friendCheckinPNLabel = Ti.UI.createLabel({
		text: 'Your friends checkin to a program',
		width: 170,
		left: 10,
		textAlign: 'left',
		font:{fontWeight:'bold',fontSize:14}
	});
	
	var friendCheckinPN = Ti.UI.createTableViewRow({
		selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		height: 50
	});
	
	getCommentPN.add(getCommentPNLabel);
	getCommentPN.add(getCommentPNSwitch);
	friendCheckinPN.add(friendCheckinPNLabel);
	friendCheckinPN.add(friendCheckinPNSwitch);
	dataForSetting.push(getCommentPN);
	dataForSetting.push(friendCheckinPN);
	notificationTableView.setData(dataForSetting);	
	self.add(notificationTableView);
	
	var fetchedUserPNPermissionsCallback = function(e) {
		getCommentPNSwitch.value = e.userPNPermissions[0];
		friendCheckinPNSwitch.value = e.userPNPermissions[1];
	}
	Ti.App.addEventListener('fetchedUserPNPermissions',fetchedUserPNPermissionsCallback);
	
	getCommentPNSwitch.addEventListener('change',function(e){
		var notifyWhenGetComment = e.value;
		PushNotificationCTB.pushNotificationCTB_updatePNPermission(userId, notifyWhenGetComment,1);
	});
	
	friendCheckinPNSwitch.addEventListener('change',function(e){
		var notifyWhenFriendCheckin = e.value;
		PushNotificationCTB.pushNotificationCTB_updatePNPermission(userId, notifyWhenFriendCheckin,2);
	});

	return self;
}
module.exports = Am_SettingWindowNotification;
