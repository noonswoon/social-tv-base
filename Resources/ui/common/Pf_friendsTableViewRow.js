FriendsTableViewRow = function(_user,_source){
	var _id = _user.friend_id;
	var	profileDataImg = 'images/kuma100x100.png';
	var friendsACS = require('acs/friendsACS');
	var userACS = require('acs/userACS');
	var userModel = require('model/user');
	var friendsModel = require('model/friend');
	var tableRow = Ti.UI.createTableViewRow({
		height: 50
	});
	
	var getFbId = function(){
		var userProfile = userModel.userModel_fetchUserProfile(_id);
		if(userProfile !== undefined) return userProfile.fb_id
		else {
			userACS.userACS_fetchUserFbId(_id);
			return 1;
			}
	};
	var fb_id = getFbId();
	
	var setFbImageFromACS = function(e){
		friendPhoto.image = acs.getUserImageNormalOfFbId(e.fb_id);
	};
	Ti.App.addEventListener('fbIdReturn', setFbImageFromACS);
	
//create view for each row	
	var friendPhoto = Ti.UI.createImageView({
		left: 10,
		height: 40,
		width:40,
		borderRadius: 10,
	});
	if(fb_id !== 1) friendPhoto.image = acs.getUserImageNormalOfFbId(fb_id)
	else friendPhoto.image = profileDataImg;
	
	var friendName = Ti.UI.createLabel({
		//text: _user.username,
		text: _user.first_name + ' ' + _user.last_name,
		left: 60,
		font: {fontSize: 14, fontStyle: 'bold'}
	});

//if table row is "addNew"
	if(_source ==='addNew'){
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
	tableRow.add(addButton);
	};	
		
	var sendRequest = function(_response){
		alert('Your request has been sent.');
		Ti.API.info(_response);
	};
//if table row is "request"
	if(_source ==='request'){
		var approveButton = Ti.UI.createButton({
			title: 'Approve',
			color: '#666',
			borderRadius: 10,
			font: {fontSize: 12, fontWeight: 'bold'},
			right: 10,
			widht: 30
	});
	
	approveButton.addEventListener('click',function(){
		alert('approve friend');
		//create in database before adding to cloud
		friendsModel.friend_create(_user);
		friendsACS.approveFriend(_user.friend_id,approveRequest);
	});		
	tableRow.add(approveButton);
	};	

	var approveRequest = function(_response){
		alert('You have approved the request');
		Ti.API.info(_response);
	};
		
	tableRow.add(friendName);
	tableRow.add(friendPhoto);

	tableRow.user = _user;
	
	return tableRow;
}
module.exports = FriendsTableViewRow;
