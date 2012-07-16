AddFriendsTableViewRow = function(_user,_category) {
	var tableRow = Ti.UI.createTableViewRow({
		height: 50,
		selectedBackgroundColor: '#fff',
		backgroundColor:'#fff'
	});

	var imageView = Ti.UI.createImageView({
		left: 10,
		width: 40,
		height: 40,
		touchEnabled: false
	});

	var userLabel = Ti.UI.createLabel({
		font: {fontSize:15, fontWeight:'bold'},
		left: 60,
		height: 20,
		width: 180,
		color: '#000'
	});
	
	if(_category==="facebook") {
		imageView.image = _user.pic_square;
		userLabel.text =  _user.name;
		tableRow.uid = _user.uid;
		
		var inviteButton = Ti.UI.createImageView({
			height: 30,
			width: 58,
			right: 10,
			backgroundImage: 'images/button/button_invite@2x.png',
		});
	
		
	var inviteFriend = function(_fbId) {
		var FacebookSharing = require('helpers/facebookSharing');	
		FacebookSharing.sendRequestOnFacebook(_fbId);
	}		
		
	inviteButton.addEventListener('click', function(){
			//alert('Invite '+_user.name);
			inviteFriend(_user.uid);
		})
		tableRow.add(inviteButton);
	};

	if(_category==="withApp") {
		imageView.image = acs.getUserImageNormalOfFbId(_user.fb_id);
		userLabel.text = _user.first_name+' '+_user.last_name;
		tableRow.uid = _user.fb_id;

		var addButton = Ti.UI.createImageView({
			height: 28,
			width: 61,
			right: 10,
			image: 'images/button/button_add@2x.png',
			
		});
		
		var createFriendActivity = function(_category){
			var curUser = acs.getUserLoggedIn();
	 		var friendActivityData = {
	 			user: curUser.id,
	 			targetedUserID: _user.id,
				category: _category,
				targetedObjectID: curUser.id,
				additionalData: curUser.first_name + ' '+ curUser.last_name,
	 		};
	 		return  friendActivityData;
 		}		
		
		var addFriend = function(_response){
			Ti.API.info(_response);
			//alert('Your friend has been added');
		}
		addButton.addEventListener('click', function(){
			var FriendACS = require('acs/friendsACS');
			var ActivityACS = require('acs/activityACS');
			var FriendsModel = require('model/friend');
			var addFriendActivityData = createFriendActivity("addfriend");
			//alert(addFriendActivityData);
		
			FriendsModel.friend_create(_user,_user.fb_id);
		 	FriendACS.addFriendwithNoApprove(_user.id,addFriend);
			ActivityACS.activityACS_createMyActivity(addFriendActivityData);
		})
		tableRow.add(addButton);
	};
	tableRow.filter = userLabel.text;
	tableRow.add(imageView);
	tableRow.add(userLabel);

	return tableRow;	
}
module.exports = AddFriendsTableViewRow;