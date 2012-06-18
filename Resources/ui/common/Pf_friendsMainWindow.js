FriendsMainView = function(_parentWindow,_window){
	var userId = acs.getUserId();
	var friendsACS = require('acs/friendsACS');
	var tableViewRow = require('ui/common/Pf_friendsTableViewRow');
	var friendModel = require('model/friend');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');

	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage: 'images/NavBG.png',
		barColor:'#489ec3'
	});

	// var nav = Ti.UI.iPhone.createNavigationGroup({
		// window: self
	// });
// 	
	// var editFriends = Titanium.UI.createButton({
		// systemButton:Titanium.UI.iPhone.SystemButton.EDIT
	// });
	// self.setRightNavButton(editFriends);
	// editFriends.addEventListener('click',function(){
		// alert('edit friends');
	// });
//

	//table row for friends
	var friendsTable = Ti.UI.createTableView({
		top: 0,
		backgroundColor: '#fff'
	});

	friendsTable.addEventListener('click',function(e){
		if(String(e.source) ==="[object TiUIButton]") {
			Ti.API.info('approve friend from friendsMainwindow');
			friendsTable.deleteRow(e.index);
			friendRequests.splice(e.index,1);
		}
		else _parentWindow.containingTab.open(new ProfileMainWindow(e.rowData.user.friend_id,_window));
	});
		
	var createFriendTable = function(myFriends){
		var myFriendsList = [];
		for(var i = 0; i<myFriends.length;i++){
			var curUser = myFriends[i];
			var userRow = new tableViewRow(curUser,_window);
			 myFriendsList.push(userRow);
		};
		friendsTable.setData(myFriendsList);
	};

	var createFriendsMainView = function(){
		if(_window ==="friend"){
			self.title = "My Friends";
			var myFriends = friendModel.friendModel_fetchFriend(userId);
			createFriendTable(myFriends);
		}
		else {
			self.title = "Friend Requests";
			createFriendTable(friendRequests); //global variable from app.js
		}
	}

	self.addEventListener('close', function() {
		Ti.App.fireEvent('requestsLoaded',{fetchedRequests:friendRequests});
	});
	
	self.addEventListener('focus', function() {
		createFriendsMainView();
	});
	
	self.add(friendsTable);
	
	return self;
}
module.exports = FriendsMainView;