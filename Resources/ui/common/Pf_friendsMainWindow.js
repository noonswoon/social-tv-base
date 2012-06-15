FriendsMainView = function(_parentWindow){

	var friendsAddNew = require('ui/common/Pf_friendsAddNew');
	var friendsRequest = require('ui/common/Pf_friendsRequest');
	var tableViewRow = require('ui/common/Pf_friendsTableViewRow');
	var friendsProfile = require('ui/common/Pf_friendsProfile');
	var friendModel = require('model/friend');
	var userModel = require('model/user');
	var userId = acs.getUserId();
	var friendsACS = require('acs/friendsACS');
	var userACS = require('acs/userACS');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');

	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		title: "My Friends",
		barImage: 'images/NavBG.png',
		barColor:'#489ec3'
	});
	
	var myFriends = friendModel.friendModel_fetchFriend(userId);

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
		for(var i = 0; i<myFriends.length;i++){
			var curUser = myFriends[i];
	//		var curId = myFriends[i].friend_id;
	//		userACS.userACS_fetchUserFbId(curId);
			var userRow = new tableViewRow(curUser,'myFriend');
			 myFriendsList.push(userRow);
		};
		friendsTable.setData(myFriendsList);
	};

	friendsTable.addEventListener('click',function(e){
		_parentWindow.containingTab.open(new ProfileMainWindow(e.rowData.user.friend_id,"friend"));
		});
	
	createFriendTable(myFriends);
	
	self.add(friendsTable);
	
	return self;
}
module.exports = FriendsMainView;