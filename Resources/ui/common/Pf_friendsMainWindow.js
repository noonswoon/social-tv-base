FriendsMainView = function(_parentWindow){

	var friendsAddNew = require('ui/common/Pf_friendsAddNew');
	var friendsRequest = require('ui/common/Pf_friendsRequest');
	var tableViewRow = require('ui/common/Pf_friendsTableViewRow');
	var friendsProfile = require('ui/common/Pf_friendsProfile');
	var friendModel = require('model/friend');
	var userId = acs.getUserId();
	var friendsACS = require('acs/friendsACS');
	var userACS = require('acs/userACS');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');

	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		title: "My Friends",
		barColor:'#398bb0'
	});
	
	var myFriends = friendModel.friendModel_fetchFriend(userId);
	
	for(i=0; i<myFriends.length; i++){
		
	};
	// var addFriendsView = Ti.UI.createView({
		// top: 0,
		// height:30,
		// backgroundColor: '#999',
	// });
// 	
	// var addFriendsLabel = Ti.UI.createLabel({
		// color: '#fff',
		// shadowColor: '#999',
		// text: 'Add Friends +',
		// right: '5',
		// height: 30,
		// font: {fontSize: 14, fontWeight: 'bold'},		
	// });
// 	
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
		top: 0,
		backgroundColor: '#fff'
	});

	var createFriendTable = function(myFriends){
		var myFriendsList = [];
		// myFriends = friendModel.friendModel_fetchFriend(userId);
		for(var i = 0; i<myFriends.length;i++){
			var curUser = myFriends[i];
			var userRow = new tableViewRow(curUser,'myFriend');
			 myFriendsList.push(userRow);
		};
		friendsTable.setData(myFriendsList);
	};
	
	// addFriendsLabel.addEventListener('click',function(){
		// _parentWindow.containingTab.open(new friendsAddNew());
	// });	
// 	
	friendsTable.addEventListener('click',function(e){
		_parentWindow.containingTab.open(new ProfileMainWindow(e.rowData.user.friend_id,"friend"));
	});
	
	createFriendTable(myFriends);
	
//	addFriendsView.add(addFriendsLabel);
//	self.add(addFriendsView);
	self.add(friendsTable);
	
	return self;
}
module.exports = FriendsMainView;