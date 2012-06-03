FriendsMainView = function(_parentWindow){
//CALL ACS
	var friendsAddNew = require('ui/common/Pf_friendsAddNew');
	var friendsRequest = require('ui/common/Pf_friendsRequest');
	var tableViewRow = require('ui/common/Pf_friendsTableViewRow');
	var friendsProfile = require('ui/common/Pf_friendsProfile');
	var friendModel = require('model/friend');
	var userID = acs.getUserId();
//	var friendsACS = require('acs/friendsACS');
//	friendsACS.searchFriend(userID);

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

/*	function friendDbLoadedCallBack(e){
		friendModel.friendModel_updateFriendsFromACS(e.fetchedFriends);
	};
	Ti.App.addEventListener('friendsLoaded',friendDbLoadedCallBack);
*/
	Ti.App.addEventListener('friendsDbUpdated',function(e){
		var myFriendsList = [];
		myFriends = friendModel.friendModel_fetchFriend(userID);
		for(var i = 0; i<myFriends.length;i++){
			var curUser = myFriends[i];
			var userRow = new tableViewRow(curUser,'myFriend');
			 myFriendsList.push(userRow);
		};
		friendsTable.setData(myFriendsList);
	});
	
	addFriendsLabel.addEventListener('click',function(){
		_parentWindow.containingTab.open(new friendsAddNew());
	});	
	
	requestLabel.addEventListener('click',function(){
		_parentWindow.containingTab.open(new friendsRequest());
	});
	
	friendsTable.addEventListener('click',function(e){
		_parentWindow.containingTab.open(new friendsProfile(e.rowData.user));
	});
	
	
	showRequestView.add(requestLabel);
	addFriendsView.add(addFriendsLabel);
	self.add(addFriendsView);
	self.add(friendsTable);
	self.add(showRequestView);
	
	return self;
}
module.exports = FriendsMainView;