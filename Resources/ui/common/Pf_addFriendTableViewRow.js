AddFriendsTableViewRow = function(_user,_category) {
	var tableRow = Ti.UI.createTableViewRow({
		height: 50,
		selectedBackgroundColor: '#fff',
		backgroundColor:'#fff'
	});

	var imageView = Ti.UI.createImageView({
		image: 'images/kuma100x100.png',
		left: 10,
		width: 40,
		height: 40
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
		
		var inviteButton = Ti.UI.createButton({
			height: 30,
			width: 66,
			right: 10,
			backgroundImage: 'images/button/button_invite.png',
		});
		
		inviteButton.addEventListener('click', function(){
			alert('invite friend');
		})
		tableRow.add(inviteButton);
	};

	if(_category==="withApp") {
		var FriendACS = require('acs/friendsACS');
		
		imageView.image = acs.getUserImageNormalOfFbId(_user.fb_id);
		userLabel.text = _user.first_name+' '+_user.last_name;
		tableRow.uid = _user.fb_id;

		var addButton = Ti.UI.createButton({
			height: 30,
			width: 66,
			right: 10,
			backgroundImage: 'images/button/button_add.png',
		});
		
		var addFriend = function(_response){
			Ti.API.info(_response);
			alert('Your friend has been added');
		}
		addButton.addEventListener('click', function(){
			FriendACS.addFriendwithNoApprove(_user.id,addFriend);
		})
		tableRow.add(addButton);
	};
	tableRow.filter = userLabel.text;
	tableRow.add(imageView);
	tableRow.add(userLabel);

	return tableRow;	
}
module.exports = AddFriendsTableViewRow;