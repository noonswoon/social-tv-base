FriendsTableViewRow = function(_user,_source) {
	var FriendACS = require('acs/friendsACS');
	var ActivityACS = require('acs/activityACS');
	var FriendModel = require('model/friend');
	
	var curId = _user.friend_id;
	var currentUser = acs.getUserLoggedIn();
	
	var tableRow = Ti.UI.createTableViewRow({
		height: 50,
		selectedBackgroundColor: '#53b4df',
	});
	
	var friendPhoto = Ti.UI.createImageView({
		image: acs.getUserImageSquareOfFbId(_user.fb_id),
		left: 10,
		height: 40,
		width:40,
		borderRadius: 10,
		touchEnabled: false
	});
	
	var friendName = Ti.UI.createLabel({
		text: _user.first_name + ' ' + _user.last_name,
		left: 60,
		height: 20,
		color: '#3e3e3e',
		font: {fontSize: 14, fontWeight: 'bold'}
	});
	
	var approveRequest = function(_response) {
		alert('Approve '+_user.first_name + ' ' + _user.last_name+ ' as a friend.');
		FriendACS.friendACS_fetchedUserTotalFriends(acs.getUserId());
		Ti.API.info(_response);
	}
	
	var createFriendActivity = function(_category) {
 		var friendActivityData = {
 			user: acs.getUserId(),
 			targetedUserID: curId,
			category: _category,
			targetedObjectID: acs.getUserId(),
			additionalData: currentUser.first_name + ' '+ currentUser.last_name,
 		};
 		return friendActivityData;
 	}
 	
	if(_source === "stranger") {
		var approveButton = Ti.UI.createImageView({
			width: 58,
			height: 27,
			right: 10,
			image: 'images/button/button_accept@2x.png',
		});
	
		approveButton.addEventListener('click',function() {
			var approveFriendActivityData = createFriendActivity("approvefriend");
			FriendModel.friend_create(_user,_user.fb_id);
 			ActivityACS.activityACS_createMyActivity(approveFriendActivityData);
			FriendACS.approveFriend(_user.friend_id,approveRequest);
		});
		
	 	tableRow.add(approveButton);
	};
		
	tableRow.add(friendName);
	tableRow.add(friendPhoto);

	tableRow.user = _user;
	
	return tableRow;	
}
module.exports = FriendsTableViewRow;