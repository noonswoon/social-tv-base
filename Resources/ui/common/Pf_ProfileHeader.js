var ProfileHeaderView = function(_parentWindow, _userProfile, _status) {
	//possible value for _status = me / friend / stranger
	var CheckinACS = require('acs/checkinACS');		
	var FriendACS = require('acs/friendsACS');
	var myBadgeACS = require('acs/myBadgeACS');
	var ActivityACS = require('acs/activityACS');

	var FriendsModel = require('model/friend');
	var CacheHelper = require('helpers/cacheHelper');
	var updateActivity = require('helpers/updateActivity');
	var UserModel = require('model/user');

	var FriendsMainWindow = require('ui/common/pf_friendsMainWindow');

	var currentUser = acs.getUserLoggedIn();
	var curId = _userProfile.id;
	var curUserName = _userProfile.username;
	var totalCheckins = 0;
	
	myBadgeACS.myBadgeACS_fetchedBadge(curId);
	ActivityACS.activityACS_fetchedMyActivity(curId,curUserName);

	var refreshButton = Ti.UI.createImageView({
		image: 'images/icon/refresh.png',
		right: 10,
		top: 5,
		height:20,
		width:20
	});

	var headerView = Ti.UI.createView();
	headerView.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#fffefd', offset: 0.0}, { color: '#d2d1d0', offset: 1.0 }]
	};	

	var profilePicture = Ti.UI.createImageView({
		image: acs.getUserImageNormalOfFbId(_userProfile.fb_id),
		width: 90,
		height: 90,
		backgroundColor: 'transparent'
	});
	
	//testing friend from facebook
	profilePicture.addEventListener('click', function(){
	var AddFriendMainWindow = require('ui/common/Pf_addFriendMainWindow');
	var addFriendMainWindow = new AddFriendMainWindow(_parentWindow);
		_parentWindow.containingTab.open(addFriendMainWindow);
	});
	
	var profilePictureContain = Ti.UI.createView({
		backgroundColor: '#fff',
		top: 10, left: 10,
		borderWidth: 1,
		width:100, height:100,
		borderColor: '#b1b1b1'
	});
		
	var profileName = Ti.UI.createLabel({
		text: _userProfile.first_name + ' ' + _userProfile.last_name,
		top: 5,
		left: 120,
		color: '#3e3e3e',
		width: 'auto',
		height: 30,
		font: { fontWeight: 'bold', fontSize: 15}
	})
		
	var columnCheckIn = Ti.UI.createView({
		top: 40,
		left: 120,
		width: 60,
		height: 70,
		backgroundColor: '#a7c63d',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#8ba82f'
	});
	
	var columnCheckInImage = Ti.UI.createImageView({
		image: 'images/icon/tv.png',
		width: 22, height: 22, top: 10,
	});
	
	var columnCheckInCount = Ti.UI.createLabel({
		font: {fontSize: 20, fontStyle: 'bold'},
		shadowColor: '#999',
		color: '#fff',
		height: 30,
		bottom:10
	});
	
	var columnFriend = Ti.UI.createView({
		top: 40,
		left: 185,
		width: 60,
		height: 70,
		backgroundColor: '#9969a8',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#80538e'
	});
	
	var columnFriendImage = Ti.UI.createImageView({
		image: 'images/icon/112-group.png',
		top: 10
	});
	
	var columnFriendCount = Ti.UI.createLabel({
		font: {fontSize: 20, fontStyle: 'bold'},
		color: '#fff',
		shadowColor: '#999',
		height: 30,
		bottom: 10
	});
	
	 var columnIsFriend = Ti.UI.createView({
		top: 40,
		left: 185,
		width: 60,
		height: 70,
		backgroundColor: '#42a1c9',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#3283a6'
	 });
	 
	 var columnIsFriendImage = Ti.UI.createImageView({
	 	image: 'images/icon/checkin.png',
		top: 10,
	 });
	var columnIsFriendLabel = Ti.UI.createLabel({
		text: "Friend",
		font: {fontSize: 15, fontStyle: 'bold'},
		color: '#fff',
		shadowColor: '#999',
		height: 30,
		bottom: 10
	});

	 var columnNotFriend = Ti.UI.createView({
		top: 40,
		left: 185,
		width: 60,
		height: 70,
		backgroundColor: '#c3c3c3',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#8e8e8e'
	 });
	 
	 var columnNotFriendImage = Ti.UI.createImageView({
	 	image: 'images/icon/checkin_grey.png',
		top: 10,
	 });
	 
	var columnNotFriendLabel = Ti.UI.createLabel({
		text: "Friend",
		font: {fontSize: 15, fontStyle: 'bold'},
		color: '#8e8e8e',
		shadowColor: '#d3d2d1',
		height: 30,
		bottom: 10
	});
 
	 var columnAddFriend = Ti.UI.createView({
		top: 40,
		left: 250,
		width: 60,
		height: 70,
		backgroundColor: '#42a1c9',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#3283a6'
	 });
	 
	 var columnAddFriendImage = Ti.UI.createImageView({
	 	image: 'images/icon/act_add_white.png',
		top: 10,
	 });
	 
	var columnAddFriendLabel = Ti.UI.createLabel({
		text: "Add",
		font: {fontSize: 15, fontStyle: 'bold'},
		color: '#fff',
		shadowColor: '#999',
		height: 30,
		bottom: 10
	});
	
	var sendRequest = function(_response){
		Ti.API.info(_response);
	}
	
 	var approveRequest = function(_response){
		alert('You have approved the request');
		Ti.API.info(_response);
		FriendACS.friendACS_fetchedUserTotalFriends(acs.getUserId());
		var approveFriendActivityData = createFriendActivity("approvefriend");
		FriendACS.friendACS_fetchedUserTotalFriends(acs.getUserId());
		ActivityACS.activityACS_createMyActivity(approveFriendActivityData);
		Ti.App.fireEvent('requestsLoaded',{fetchedRequests:friendRequests});
	}
	
 	var createFriendActivity = function(_category){
 		var friendActivityData = {
 			user: acs.getUserId(),
 			targetedUserID: _userProfile.id,
			category: _category,
			targetedObjectID: acs.getUserId(),
			additionalData: currentUser.first_name + ' '+ currentUser.last_name,
 		};
 		return  friendActivityData;
 	}		

 	var addFriend = function(isRequest,i) {
 		//condition 1: no request from this user
 		if(!isRequest) {
		 	var addFriendActivityData = createFriendActivity("addfriend");
		 	FriendACS.addFriend(curId,sendRequest);
			ActivityACS.activityACS_createMyActivity(addFriendActivityData);
 			} 			
 		//condition 2: there's a request from this guy	
 		else {
 			alert(_userProfile.first_name+' '+ _userProfile.last_name +' has request you as a friend. Accept him/her?');
			friendRequests.splice(i,1);
			FriendsModel.friend_create(_userProfile,_userProfile.fb_id);
			FriendACS.approveFriend(curId,approveRequest);	
		}	
		_parentWindow.close();
 	}	

	//Create view for header
	var createHeaderView = function(status){
		profilePictureContain.add(profilePicture);
		columnCheckIn.add(columnCheckInImage);
		columnCheckIn.add(columnCheckInCount);
		headerView.add(columnCheckIn);
		headerView.add(profilePictureContain);
		headerView.add(profileName);

		if(status === "friend") {
			columnIsFriend.add(columnIsFriendImage);
			columnIsFriend.add(columnIsFriendLabel);
			headerView.add(columnIsFriend);
		} else 
		if(status === "stranger") {
			columnNotFriend.add(columnNotFriendImage);
			columnNotFriend.add(columnNotFriendLabel);
			headerView.add(columnNotFriend);
			columnAddFriend.add(columnAddFriendImage);
			columnAddFriend.add(columnAddFriendLabel);
			headerView.add(columnAddFriend);
		} else 
		if(status === "me") {
			headerView.add(refreshButton);
			columnFriend.add(columnFriendImage);
			columnFriend.add(columnFriendCount);	
			headerView.add(columnFriend);
		};
	};
	
	// respond in total result only
	Ti.App.addEventListener('UserTotalCheckInsFromACS'+curId, function(e) {
		columnCheckInCount.text = e.result;
	});
	
	//only listen to when ApplicationTabGroup is open, only the current user will get to fire the friendACS event
	Ti.App.addEventListener('UserTotalFriendsFromACS', function(e){ 
		columnFriendCount.text = e.result;
	});

	refreshButton.addEventListener('click',function(){
		alert('refresh');
	});
	
	columnFriend.addEventListener('click',function(){
		_parentWindow.containingTab.open(new FriendsMainWindow(_parentWindow,"friend"));
	});	
 	
 	columnAddFriend.addEventListener('click',function(){
 		var isRequest = false;
 		for(i=0;i<friendRequests.length;i++){
 			if (_userProfile.id===friendRequests[i].friend_id) {
 				isRequest = true;
 				break;
 			}
 		}
 		addFriend(isRequest,i);
 	});

	// headerView._setProfileName = function() {
		// //select from db and set label text for firstname/lastname
		// var profile = UserModel.userModel_fetchUserProfile(curId);
		// profileName.text = profile.first_name + ' ' + profile.last_name;
	// };

	CheckinACS.checkinACS_fetchedUserTotalCheckIns(curId);	
	createHeaderView(_status);

	return headerView;
}

module.exports = ProfileHeaderView;
