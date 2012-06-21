Am_SettingWindowNotification = function(){
	
	var dataForSetting = [];
	
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
		text: 'Receive a push notification on ...',
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
	
	//received comment
	var receivedComment = Ti.UI.createTableViewRow({
		selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		height: 50
	});
	
	var receivedCommentLabel = Ti.UI.createLabel({
		text: 'Received comment',
		font:{fontWeight:'bold',fontSize:16},
		left: 10
	});
	receivedComment.add(receivedCommentLabel);
	
	var receivedCommentSwitch = Ti.UI.createSwitch({
		value: true,
		right: 10
	});
	receivedComment.add(receivedCommentSwitch);
	
	//friends check-in to a program
	var friendCheckin = Ti.UI.createTableViewRow({
		selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		height: 50
	});
	
	var friendCheckinLabel = Ti.UI.createLabel({
		text: 'Friends check-in to a program',
		width: 170,
		left: 10,
		textAlign: 'left',
		font:{fontWeight:'bold',fontSize:16}
	});
	friendCheckin.add(friendCheckinLabel);
	
	var friendCheckinSwitch = Ti.UI.createSwitch({
		value: true,
		right: 10
	});
	friendCheckin.add(friendCheckinSwitch);
	
	//Button
	var text = [];
	
	var saveButtonTableViewRow = Ti.UI.createTableViewRow({
		height: 40
	});
	
	var saveButtonLabel = Ti.UI.createLabel({
		text: 'Save Changes',
		font:{fontWeight:'bold',fontSize:16}
	});
	saveButtonTableViewRow.add(saveButtonLabel);
	
	var saveButton = Ti.UI.createTableView({
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'transparent',
		rowBackgroundColor:'white',
		scrollable:false,
		top: 160,
		separatorColor: 'white'
	});
	
	text.push(saveButtonTableViewRow);
	saveButton.setData(text);
	self.add(saveButton);
	
	dataForSetting.push(receivedComment);
	dataForSetting.push(friendCheckin);
	notificationTableView.setData(dataForSetting);
	
	self.add(notificationTableView);
	return self;
}
module.exports = Am_SettingWindowNotification;
