FriendsMainView = function(_parentWindow){
//CALL ACS
//	var userACS = require('acs/userACS');	
//	userACS.userACS_fetchAllUser();
	var FriendsAddNew = require('ui/common/Pf_friendsAddNew');
	var tableViewRow = require('ui/common/Pf_friendsTableViewRow');
//	var tempUsers = [];

	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		title: "My Friends",
	});

	var noFriendRequest = 5;
	var showRequestView = Ti.UI.createView({
		top: 0,
		height: 20,
		backgroundColor: '#666',
		opacity: 0.6
	});
	
	var requestLabel = Ti.UI.createLabel({
		color: '#333',
		text: 'Show Friends Request (' + noFriendRequest +')',
		right: '5',
		font: {fontSize: 13},
		height: 20
	});
	
	var addFriendsView = Ti.UI.createView({
		top: 20,
		height:30,
		backgroundColor: '#999',
	});
	
	var addFriendsLabel = Ti.UI.createLabel({
		color: '#fff',
		shadowColor: '#999',
		text: 'Add Friends +',
		right: '5',
		height: 30,
		font: {fontSize: 14, fontWeight: 'bold'},		
	});
	
	addFriendsLabel.addEventListener('click',function(){
		_parentWindow.containingTab.open(new FriendsAddNew());
	});	
	
	var nav = Ti.UI.iPhone.createNavigationGroup({
		window: self
	});
	
	var editFriends = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.EDIT
	});
	self.setRightNavButton(editFriends);
	editFriends.addEventListener('click',function(){
		alert('edit friends');
	});
	
	//table row for friends
	var friendsTable = Ti.UI.createTableView({
		top: 50,
		backgroundColor: '#eee'
	});

	showRequestView.add(requestLabel);
	addFriendsView.add(addFriendsLabel);
	self.add(addFriendsView);
	self.add(friendsTable);
	self.add(showRequestView);
	
	return self;
}
module.exports = FriendsMainView;