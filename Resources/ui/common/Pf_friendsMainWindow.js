
FriendsMainView = function(){
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
		color: '#fff',
		opacity: 1,
		text: 'Show Friends Request (' + noFriendRequest +')',
		right: '5',
		font: {fontSize: 13},
		height: 20
	});
	var nav = Ti.UI.iPhone.createNavigationGroup({
		window: self
	});
	
	var addFriends = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.ADD
	});
	self.setRightNavButton(addFriends);
	addFriends.addEventListener('click',function(){
		alert('add friends');
	});
	
	//table row for friends
	var friendsTable = Ti.UI.createTableView({
		top: 20,
		backgroundColor: '#eee'
	});
	
	showRequestView.add(requestLabel);
	self.add(friendsTable);
	self.add(showRequestView);
	
	return self;
}
module.exports = FriendsMainView;