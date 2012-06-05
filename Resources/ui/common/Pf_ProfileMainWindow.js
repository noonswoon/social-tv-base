function ProfileMainWindow() {
	//REQUIRE//
	var ProfileHeader = require('ui/common/Pf_ProfileHeader');
	var Detail = require('ui/common/Pf_ProfileDetails');


	var self = Titanium.UI.createWindow({
		title: "My Profile",
		barColor:'#398bb0'
	});
	
	//UI//
	var nav = Ti.UI.iPhone.createNavigationGroup({
		window: self
	});
		
	var settingButton = Titanium.UI.createButton({
		image: 'images/icon/19-gear.png'
	});
	settingButton.addEventListener('click',function(){
		var SettingWindow = require('ui/common/Am_SettingWindow');					
		var settingwin = new SettingWindow();
		self.containingTab.open(settingwin);
	});

	var headerView = Ti.UI.createView({
		height: 120
	});	
	
	var userProfileTable = Ti.UI.createTableView({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		scrollable: false,
		backgroundColor: '#212b3d',
	});
	
	var header = Ti.UI.createTableViewSection();
	var profileHeader = new ProfileHeader(self);
	var detail = new Detail(self);
	var userProfile=[];
		
	self.setRightNavButton(settingButton);
	headerView.add(profileHeader);
	header.headerView = headerView;
	userProfile.push(header);
	userProfile.push(detail);
	userProfileTable.setData(userProfile);
	self.add(userProfileTable);		
	return self;
}

module.exports = ProfileMainWindow;