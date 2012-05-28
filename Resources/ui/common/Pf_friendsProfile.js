Pf_friendsProfile = function(_friend){
	
	var self = Titanium.UI.createWindow({
		backgroundColor:'#fff',
		title: ''+_friend.first_name,
		barColor:'#398bb0'
	});
	
//REQUIRE//
		var FriendsHeader = require('ui/common/Pf_friendsHeader');
		var FriendsDetail = require('ui/common/Pf_FriendsDetail');

//UI//
		var nav = Ti.UI.iPhone.createNavigationGroup({
			window: self
		});

		var headerView = Ti.UI.createView({
				height: 120
		});	
		var friendProfileTable = Ti.UI.createTableView({
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				scrollable: false,
			});
		var headerTableViewSection = Ti.UI.createTableViewSection();
		var friendsHeader = new FriendsHeader(_friend);
		var friendsDetail = new FriendsDetail();
		var friendProfile=[];

		headerView.add(friendsHeader);
		headerTableViewSection.headerView = headerView;
		friendProfile.push(headerTableViewSection);
		friendProfile.push(friendsDetail);
		friendProfileTable.setData(friendProfile);
	
	self.add(friendProfileTable);		
	return self;
}
module.exports = Pf_friendsProfile;
