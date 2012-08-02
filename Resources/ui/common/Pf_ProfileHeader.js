var ProfileHeaderView = function(_parentWindow, _userProfile, _status) {
	//possible value for _status = me / friend / stranger

	var CheckinACS = require('acs/checkinACS');		
	var myBadgeACS = require('acs/myBadgeACS');
	var ActivityACS = require('acs/activityACS');

	var currentUser = acs.getUserLoggedIn();
	var curId = _userProfile.id;
	var totalCheckins = 0;
	
	var canOpenWindow = true;
	
	CheckinACS.checkinACS_fetchedUserTotalCheckIns(curId);	
	myBadgeACS.myBadgeACS_fetchedBadge(curId);
	ActivityACS.activityACS_fetchedMyActivity(curId);
	
	var headerView = Ti.UI.createView();
	headerView.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#fffefd', offset: 0.0}, { color: '#d2d1d0', offset: 1.0 }]
	};	
	
	var profilePicture = Ti.UI.createImageView({
		image: acs.getUserImageNormalOfFbId(_userProfile.fb_id),
		width: 88,
		height: 88,
		backgroundColor: 'transparent'
	});

	var profilePictureContain = Ti.UI.createView({
		top: 10, left: 10,
		width:103, height:104,
		backgroundImage: 'images/icon/pf_imagedisplay.png'
	});

	var profileName = Ti.UI.createLabel({
		text: _userProfile.first_name + ' ' + _userProfile.last_name,
		top: 5,
		left: 120,
		color: '#3e3e3e',
		width: 'auto',
		height: 30,
		font: { fontWeight: 'bold', fontSize: 15}
	});

	var columnCheckIn = Ti.UI.createView({
		top: 40,
		left: 120,
		width: 60,
		height: 70,
		backgroundColor: '#acd032',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#8fb125'
	});
	
	var columnCheckInImage = Ti.UI.createImageView({
		image: 'images/icon/pf_checkin.png',
		top: 10,
	});
	
	var columnCheckInCount = Ti.UI.createLabel({
		text: '0',
		font: {fontSize: 20, fontStyle: 'bold'},
		shadowColor: '#999',
		color: '#fff',
		height: 30,
		bottom:5
	});
	
	var columnFriend = Ti.UI.createView({
		top: 40,
		left: 185,
		width: 60,
		height: 70,
		backgroundColor: '#a570b6',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#8d5c9d'
	});
	
	var columnFriendImage = Ti.UI.createImageView({
		image: 'images/icon/pf_friend.png',
		top: 15
	});
	
	var columnFriendCount = Ti.UI.createLabel({
		font: {fontSize: 20, fontStyle: 'bold'},
		text: '0',
		color: '#fff',
		shadowColor: '#999',
		height: 30,
		bottom: 5
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
		bottom: 5
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
		bottom: 5
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
		top: 15,
	 });
	 
	var columnAddFriendLabel = Ti.UI.createLabel({
		text: "Add",
		font: {fontSize: 15, fontStyle: 'bold'},
		color: '#fff',
		shadowColor: '#999',
		height: 30,
		bottom: 5
	});
	
 	var updateNameCallback = function(e){
		profileName.text = e.name;
 	};
	
	var sendRequest = function(_response){
		Ti.API.info(_response);
	}
	
 	var approveRequest = function(_response){
		alert(L('You have approved the request'));
		Ti.API.info(_response);
		var FriendACS = require('acs/friendsACS');
		var approveFriendActivityData = createFriendActivity("approvefriend");
		FriendACS.friendACS_fetchedUserTotalFriends(acs.getUserId());
		ActivityACS.activityACS_createMyActivity(approveFriendActivityData);
		Ti.App.fireEvent('friendRequestsLoaded',{fetchedRequests:friendRequests});
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
 		var FriendACS = require('acs/friendsACS');
 		//condition 1: no request from this user
 		if(!isRequest) {
		 	var addFriendActivityData = createFriendActivity("addfriend");
		 	FriendACS.friendsACS_addFriend(curId,sendRequest);
			ActivityACS.activityACS_createMyActivity(addFriendActivityData);
 			} 			
 		//condition 2: there's a request from this guy	
 		else {
 			friendRequests.splice(i,1);
 			var FriendsModel = require('model/friend');
			FriendsModel.friend_create(_userProfile,_userProfile.fb_id);
			FriendACS.friendsACS_approveFriend(curId,approveRequest);	
		}	
		_parentWindow.close();
 	};	
 	
 	var UserTotalFriendsFromACSCallback = function(e) {
 		columnFriendCount.text = e.result;
 	};
 	
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
		} else  if(status === "stranger") {
			columnNotFriend.add(columnNotFriendImage);
			columnNotFriend.add(columnNotFriendLabel);
			headerView.add(columnNotFriend);
			columnAddFriend.add(columnAddFriendImage);
			columnAddFriend.add(columnAddFriendLabel);
			headerView.add(columnAddFriend);
		} else if(status === "me") {
			columnFriend.add(columnFriendImage);
			columnFriend.add(columnFriendCount);	
			headerView.add(columnFriend);
			
			Ti.App.addEventListener('UserTotalFriendsFromACS', UserTotalFriendsFromACSCallback); 
			Ti.App.addEventListener('updateName'+curId, updateNameCallback);
		};
	};
	
	// respond in total result only
	var UserTotalCheckInsFromACSCallback = function(e) {
		columnCheckInCount.text = e.result;
	}; 
	Ti.App.addEventListener('UserTotalCheckInsFromACS'+curId,UserTotalCheckInsFromACSCallback);
	
	headerView._enableOpenFriendWindow = function() {
		//Ti.API.info('enable to open friend window again - profileHeader');
		canOpenWindow = true;
	};
	
	//only listen to when ApplicationTabGroup is open, only the current user will get to fire the friendACS event
	columnFriend.addEventListener('click',function(){
		if(canOpenWindow) {
			var FriendMainWindow = require('ui/common/Pf_FriendMainWindow');
			_parentWindow.containingTab.open(new FriendMainWindow(_parentWindow,"friend"));
			canOpenWindow = false;
			//Ti.API.info('canOpen FriendMain Window set to false - profileHeader');
		}
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
	
	/* setting stuff..unrelated
	headerView._setProfileName = function() {
		//select from db and set label text for firstname/lastname
		var profile = UserModel.userModel_fetchUserProfile(curId);
		profileName.text = profile.first_name + ' ' + profile.last_name;
	};
	*/

	createHeaderView(_status);

	var resumeCallback = function(){
		CheckinACS.checkinACS_fetchedUserTotalCheckIns(curId);	
		myBadgeACS.myBadgeACS_fetchedBadge(curId);
		ActivityACS.activityACS_fetchedMyActivity(curId);
	};
	Ti.App.addEventListener('resume', resumeCallback);

	var clearListeners = function() {
		Ti.App.removeEventListener('resume',resumeCallback);
		Ti.App.removeEventListener('UserTotalCheckInsFromACS'+curId, UserTotalCheckInsFromACSCallback);
		if(_status === "me") {
			Ti.App.removeEventListener('UserTotalFriendsFromACS', UserTotalFriendsFromACSCallback); 
			Ti.App.removeEventListener('updateName'+curId, updateNameCallback);
		}
		Ti.App.removeEventListener('profileMainWindowClosing'+curId, clearListeners);
	};
	Ti.App.addEventListener('profileMainWindowClosing'+curId, clearListeners);

	return headerView;
}

module.exports = ProfileHeaderView;
