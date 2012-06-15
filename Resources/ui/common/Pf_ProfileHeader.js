var ProfileHeaderView = function(_parentWindow, _userProfile, _status){
	Ti.API.info('Profile Status: '+_status);
	var curId = _userProfile.id;
	var totalCheckins = 0;
	var CheckinACS = require('acs/checkinACS');		
	var FriendACS = require('acs/friendsACS');
	var myBadgeACS = require('acs/myBadgeACS');
	var ActivityACS = require('acs/activityACS');
	var CacheHelper = require('helpers/cacheHelper');
	var FriendsMainWindow = require('ui/common/pf_friendsMainWindow');
	
	//POSSIBLE STATUS = me / friend / stranger
	var checkStatusRunACS = function(status){
		if(status==="me" || status==="friend"){
			myBadgeACS.myBadgeACS_fetchedBadge(curId);
			ActivityACS.activityACS_fetchedMyActivity(curId);
		}
	};
	
	checkStatusRunACS(_status);

//ACS RESPONDING//////////////////////////////////////////////////////////////	
	// respond in total result only
	Ti.App.addEventListener('UserTotalCheckInsFromACS'+curId, function(e){
		columnCheckInCount.text = e.result;
	});
	
	Ti.App.addEventListener('UserTotalFriendsFromACS', function(e){ //only listen to when ApplicationTabGroup is open, only the current user will get to fire the friendACS event
		columnFriendCount.text = e.result;
	});
//////////////////////////////////////////////////////////////////////////////
	//REFRESH BUTTON TO RELOAD THE ACS//
	var refreshButton = Ti.UI.createImageView({
		image: 'images/icon/refresh.png',
		right: 10,
		top: 5,
		height:20,
		width:20
	});
	refreshButton.addEventListener('click',function(){
		alert('refresh');
		// FriendACS.searchFriend(curId);
		 FriendACS.showFriendsRequest();
		// CheckinACS.checkinACS_fetchedUserTotalCheckIns(curId);
		myBadgeACS.myBadgeACS_fetchedBadge(curId);
	});

	var headerView = Ti.UI.createView({
	});
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
		backgroundColor: '#a7c63d',//'#99cc33',//'#a7c63d',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#8ba82f'
		// backgroundColor: '#d74e55',//'#ff6666',//'#d74e55',
		// borderRadius: 10,
		// borderWidth: 1,
		// borderColor: '#bc3e44'

	});
	//img
	var columnCheckInImage = Ti.UI.createImageView({
		image: 'images/icon/tv.png',
		width: 22, height: 22, top: 10,
		// image: 'images/icon/checkin.png',
		// top: 10
	});
	//count
	var columnCheckInCount = Ti.UI.createLabel({
		font: {fontSize: 20, fontStyle: 'bold'},
		shadowColor: '#999',
		color: '#fff',
		height: 30,
		bottom:10
	});

	CheckinACS.checkinACS_fetchedUserTotalCheckIns(curId);
	
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
	//img
	var columnFriendImage = Ti.UI.createImageView({
		image: 'images/icon/112-group.png',
		top: 10
	});
	// count
	var columnFriendCount = Ti.UI.createLabel({
	//	text: FriendACS.friendACS_fetchedUserTotalFriends(curId),
		font: {fontSize: 20, fontStyle: 'bold'},
		color: '#fff',
		shadowColor: '#999',
		height: 30,
		bottom: 10
	});
	
	columnFriend.addEventListener('click',function(){
		_parentWindow.containingTab.open(new FriendsMainWindow(_parentWindow));
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
		// image: 'images/icon/isFriend.png',
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

 	
	//MANAGE VIEW FOR HEADER
	//POSSIBLE STATUS = me / friend / stranger
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
		}
		else if(status === "me") {
			headerView.add(refreshButton);
			columnFriend.add(columnFriendImage);
			columnFriend.add(columnFriendCount);	
			headerView.add(columnFriend);
		};
	};
	
	createHeaderView(_status);

return headerView;

}

module.exports = ProfileHeaderView;

/*		var socialNet = Ti.UI.createView({
			top: 40,
			left: 120,
			width: 60,
			height: 70,
		});
		fbButton = Ti.UI.createImageView({
			image: 'images/icon/facebook-icon_24x24.png',
			borderRadius: 7,
			bottom:0,
			left: 4
		});			
		twButton = Ti.UI.createImageView({
			image: 'images/icon/twitter-icon_24x24.png',
			borderRadius: 7,
			bottom: 0,
			right: 4			
		});*/		
	//socialNet.add(fbButton);
	//socialNet.add(twButton);
	//headerView.add(socialNet);