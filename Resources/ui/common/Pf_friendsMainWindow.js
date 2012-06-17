FriendsMainView = function(_parentWindow){
	var userId = acs.getUserId();
	var friendsACS = require('acs/friendsACS');
	var tableViewRow = require('ui/common/Pf_friendsTableViewRow');
	var friendModel = require('model/friend');
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