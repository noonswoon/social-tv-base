function ProfileMainWindow() {
	var self = Titanium.UI.createWindow({
		backgroundColor:'#fff',
		title: "My Profile",
	});
	
//REQUIRE//
		var ProfileHeader = require('ui/common/Pf_ProfileHeader');
		var Detail = require('ui/common/Pf_ProfileDetails');

//UI//
		var headerView = Ti.UI.createView({
				height: 120
		});	
		var UserProfileTable = Ti.UI.createTableView({
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				scrollable: false,
			});
		var header = Ti.UI.createTableViewSection();
		var profileHeader = new ProfileHeader(self);
		var detail = new Detail();
		var UserProfile=[];

		headerView.add(profileHeader);
		
		header.headerView = headerView;
		
		UserProfile.push(header);
		UserProfile.push(detail);
		UserProfileTable.setData(UserProfile);
	
	self.add(UserProfileTable);		
	return self;
}

module.exports = ProfileMainWindow;