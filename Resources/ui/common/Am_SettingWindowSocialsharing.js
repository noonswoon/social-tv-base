Am_SettingWindowSocialsharing = function(){
	
	var SettingHelper = require('helpers/settingHelper');
	
	var facebookCurrentSetting = SettingHelper.getFacebookShare();
	
	var dataForSetting = [];
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/back_button.png',
        width:57,height:34
	});

	var self = Ti.UI.createWindow({
		backgroundImage: '/images/admin/cb_back.png',
		barImage: 'images/nav_bg_w_pattern.png',
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

	
	//Set Current Switch
	facebookSwitch.value = facebookCurrentSetting
	
	facebookSwitch.addEventListener('change',function(e){
		var isShare = e.value;
		SettingHelper.setFacebookShare(isShare);
	});
	
	dataForSetting.push(facebook);
	socialsharingTableView.setData(dataForSetting);
	
	self.add(socialsharingTableView);
	return self;
}
module.exports = Am_SettingWindowSocialsharing;
