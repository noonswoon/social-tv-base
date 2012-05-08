function ProfileMainWindow() {
	var self = Titanium.UI.createWindow({
		backgroundColor:'#fff',
		title: "My Profile",
		//barColor: '#61A598'
	});
/////////////////////////////////////
//NAVIGATION BAR//	
	
//HEADER//
var ProfileHeader = require('ui/common/Pf_ProfileHeader');
var profileHeader = new ProfileHeader();
var headerView = Ti.UI.createView({
	height: 120});
headerView.add(profileHeader);

//MENU//	
var ProfileMenu = require('ui/common/Pf_ProfileMenu');
var profileMenu = new ProfileMenu();

var menuView = Ti.UI.createView({
	height:50
});

menuView.add(profileMenu);


//DETAIL//
var ProfileDetail = require('ui/common/Pf_ProfileDetail');
var profileDetail = new ProfileDetail();
var detailView = Ti.UI.createView({
	height: 198
});
detailView.add(profileDetail);

//no-edit! code:D//
var data=[];

var header = Ti.UI.createTableViewSection();
header.headerView = headerView;
data[0] = header;

var menu = Ti.UI.createTableViewSection();
menu.headerView = menuView;
data[1] = menu;


var detail = Ti.UI.createTableViewSection();
detail.headerView = profileDetail;
data[2] = detail;

var table = Ti.UI.createTableView({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		scrollable: false,
		data: data
	});

	self.add(table);
	
/////////////////////////////////////	
	return self;
}

module.exports = ProfileMainWindow;