FriendsTableViewRow = function(_user){
	var	profileDataImg = 'images/kuma100x100.png';
	var friendsACS = require('acs/friendsACS');
	var tableRow = Ti.UI.createTableViewRow({
		height: 50
	});

//create view for each row	
	var friendPhoto = Ti.UI.createImageView({
		left: 10,
		height: 40,
		width:40,
		borderRadius: 10,
//		image: _user.photo
		image: profileDataImg
	});
	var friendName = Ti.UI.createLabel({
		//text: _user.username,
		text: _user.first_name + ' ' + _user.last_name,
		left: 60,
		font: {fontSize: 14, fontStyle: 'bold'}
	});
	
	var addButton = Ti.UI.createLabel({
		text: '+',
		shadowColor: '#eee',
		font: {fontSize: 20, fontWeight: 'bold'},
		right: 10
	});
	
	addButton.addEventListener('click',function(){
		alert('add friend');
		friendsACS.addFriend(_user.id,sendRequest);

	});
	
	var sendRequest = function(_response){
		alert('Your request has been sent.');
		alert(_response);
	};
		
	tableRow.add(friendName);
	tableRow.add(friendPhoto);
	tableRow.add(addButton);
	tableRow.user = _user;
	
	return tableRow;
}
module.exports = FriendsTableViewRow;
