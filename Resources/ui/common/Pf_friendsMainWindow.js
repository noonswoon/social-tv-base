FriendsMainView = function(_parentWindow,_window){
	var FriendModel = require('model/friend');

	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	var tableViewRow = require('ui/common/Pf_FriendsTableViewRow');
	
	var userId = acs.getUserId();
	
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage: 'images/NavBG.png',
		barColor:'#489ec3'
	});

	var friendsTable = Ti.UI.createTableView({	//table row for friends
		top: 0,
		backgroundColor: '#fff'
	});

	var addFriendView = Ti.UI.createView({
		height: 50, 
		backgroundColor: '#42a1c9'
	});
	
	var addFriendLabel = Ti.UI.createLabel({
		text: 'Add friends to get more fun:)',
		color: '#fff',
		height: 30,
		bottom: 10,
		left: 70,
		font: { fontWeight: 'bold', fontSize: 15},
	});
	
	var addFriendImage = Ti.UI.createImageView({
		image: 'images/icon/act_add_white.png',
		left: 30
	});

	addFriendLabel.addEventListener('click', function(){
		var AddFriendMainWindow = require('ui/common/Pf_AddFriendMainWindow');
		var addFriendMainWindow = new AddFriendMainWindow(_parentWindow);
		_parentWindow.containingTab.open(addFriendMainWindow);	
	});

	addFriendView.add(addFriendImage);
	addFriendView.add(addFriendLabel);

	var createFriendTable = function(myFriends){
		var myFriendsList = [];
		for(var i = 0; i<myFriends.length;i++){
			var curUser = myFriends[i];
			var userRow = new tableViewRow(curUser,_window);
			 myFriendsList.push(userRow);
		};
		friendsTable.setData(myFriendsList);
	}

	var createFriendsMainView = function(){
		if(_window === "friend"){
			self.title = "My Friends";
			var myFriends = FriendModel.friendModel_fetchFriend(userId);
			createFriendTable(myFriends);
		}
		else {
			self.title = "Friend Requests";
			createFriendTable(friendRequests); //global variable from app.js
		}
	}

	friendsTable.addEventListener('click',function(e) {
		if(String(e.source) ==="[object TiUIButton]") {
			Ti.API.info('approve friend from friendsMainwindow');
			friendsTable.deleteRow(e.index);
			friendRequests.splice(e.index,1);
		}
		else _parentWindow.containingTab.open(new ProfileMainWindow(e.rowData.user.friend_id,_window));
	});
		
	self.addEventListener('close', function() {
		Ti.App.fireEvent('requestsLoaded',{fetchedRequests:friendRequests});
	});
	
	self.addEventListener('focus', function() {
		createFriendsMainView();
	});
	
	friendsTable.headerView = addFriendView;
	self.add(friendsTable);
	
	return self;
}
module.exports = FriendsMainView;