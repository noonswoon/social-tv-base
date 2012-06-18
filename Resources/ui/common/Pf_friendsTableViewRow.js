FriendsTableViewRow = function(_user,_source){
	var _id = _user.friend_id;
	var currentUser = acs.getUserLoggedIn();
	var	profileDataImg = 'images/kuma100x100.png';
	var FriendACS = require('acs/friendsACS');
	var ActivityACS = require('acs/activityACS');
	var friendsModel = require('model/friend');
	var tableRow = Ti.UI.createTableViewRow({
		height: 50,
		selectedBackgroundColor: '#d2eaff',
	});
	
	//Ti.API.info("FriendsTableViewRow fbId: " + _user.fb_id)
	var friendPhoto = Ti.UI.createImageView({
		image: acs.getUserImageNormalOfFbId(_user.fb_id),
		left: 10,
		height: 40,
		width:40,
		borderRadius: 10,
	});
	var friendName = Ti.UI.createLabel({
		text: _user.first_name + ' ' + _user.last_name,
		left: 60,
		font: {fontSize: 14, fontStyle: 'bold'}
	});
	  var createFriendActivity = function(_category){
 		var friendActivityData = {
 			user: acs.getUserId(),
 			targetedUserID: _id,
			category: _category,
			targetedObjectID: acs.getUserId(),
			additionalData: currentUser.first_name + ' '+ currentUser.last_name,
 		};
 		return  friendActivityData;
 	}		
	if(_source ==="stranger"){
		var approveButton = Ti.UI.createButton({
			width: 66,
			height: 30,
			right: 10,
			backgroundImage: 'images/button/button_accept.png',
		});
	
		approveButton.addEventListener('click',function(){
			var approveFriendActivityData = createFriendActivity("approvefriend");
			friendsModel.friend_create(_user);
 			ActivityACS.activityACS_createMyActivity(approveFriendActivityData);
			FriendACS.approveFriend(_user.friend_id,approveRequest);
			FriendACS.friendACS_fetchedUserTotalFriends(myUserId);
		});		
	 	tableRow.add(approveButton);
	};
	var approveRequest = function(_response){
		alert('Approve '+_user.first_name + ' ' + _user.last_name+ ' as a friend.');
		Ti.API.info(_response);
		
	};
		
	tableRow.add(friendName);
	tableRow.add(friendPhoto);

	tableRow.user = _user;
	
	return tableRow;
	
	
}
module.exports = FriendsTableViewRow;
