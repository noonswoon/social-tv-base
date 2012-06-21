Am_SettingWindowSocialsharing = function(){
	
	var dataForSetting = [];
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/Backbutton.png',
        width:57,height:34
	});

	var self = Ti.UI.createWindow({
		backgroundImage: '/images/admin/cb_back.png',
		barImage: 'images/NavBG.png',
		title: 'Social Sharing',
		leftNavButton: backButton
	});

	backButton.addEventListener('click', function(){
   		self.close();
	});
	
	var headerLabel = Ti.UI.createLabel({
		text: 'Share your action to ...',
		color: 'white',
		font:{fontWeight:'bold',fontSize:16},
		left: 20,
		top: 20
	});
	self.add(headerLabel);
	
	var socialsharingTableView = Ti.UI.createTableView({
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'transparent',
		rowBackgroundColor:'white',
		height: 'auto',
		scrollable:false,
		top: 30
	});

	//Facebook
	var facebook = Ti.UI.createTableViewRow({
		selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		height: 50
	});
	
	var facebookLabel = Ti.UI.createLabel({
		text: 'Share on Facebook',
		font:{fontWeight:'bold',fontSize:16},
		left: 10
	});
	facebook.add(facebookLabel);
	
	var facebookSwitch = Ti.UI.createSwitch({
		value: true,
		right: 10
	});
	facebook.add(facebookSwitch);
	
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
	
	dataForSetting.push(facebook);
	socialsharingTableView.setData(dataForSetting);
	
	self.add(socialsharingTableView);
	return self;
}
module.exports = Am_SettingWindowSocialsharing;
