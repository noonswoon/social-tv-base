var ProfileActivityView = function(_parentWindow,_userProfile,_status){
	var FriendACS = require('acs/friendsACS');
	var FriendsModel = require('model/friend');
	var ActivityModel = require('model/activity');

	var curId = _userProfile.id;
	
	var activityView = Ti.UI.createView({	//main view
		top: 10,
		height: 'auto',
		bottom: 10	
	});
	
	var userRequestView = Ti.UI.createView({
		height: 60,
		top: 0, bottom:0
	});
		
	var userActivityView = Ti.UI.createView({
		height: 'auto',
		top: 0,
	});

//FRIEND REQUEST//////////////////////////////////////////////
if(_status==="me") {
	var requestNoticeView = Ti.UI.createView({
		height: 40, width: 290,
		backgroundColor: '#48a8d0',
		borderRadius: 10,
		top: 0,
	//	visible: false
	});
	
	var requestImage = Ti.UI.createImageView({
		image: 'images/icon/act_add_white.png',
		left: 10,
	//	visible: false
	});
	
	var requestLabel = Ti.UI.createLabel({
		color: '#fff',
		text: '',
		height: 30,
		shadowColor: '#999',
		left: 50,
		font: {fontSize: 13, fontWeight: 'bold'},
	//	visible: false
	});
	
	var setFriendRequestVisible = function(){
		if (friendRequests.length == 0 || friendRequests===undefined) {
			userRequestView.visible = false;
			requestImage.visible = false;
			requestLabel.visible = false;
		} else {
			requestImage.visible = true;
			requestLabel.visible = true;
			userRequestView.visible = true;
			}
	}	
	
	var createNotice = function(){
		if (friendRequests.length !== 0){
			requestLabel.text = 'You have got '+friendRequests.length+' friend request(s).',
			userActivityView.top = 40;
			activityView.height = 350;
		} else {
			userActivityView.top = 0;
		}
		setFriendRequestVisible();
	}
	
	 var requestsLoadedCallBack = function(e){
		friendRequests = [];
		var requestUsers = e.fetchedRequests; //update global variable - requestUsers
		for(var i=0;i<requestUsers.length;i++) {
			friendRequests.push(requestUsers[i]); //global variable in app.js
		}
		createNotice();
	 }
	 
	requestNoticeView.addEventListener('click', function(){
		var FriendsMainWindow = require('ui/common/Pf_FriendsMainWindow');
		_parentWindow.containingTab.open(new FriendsMainWindow(_parentWindow,"stranger"));
	});
	
	Ti.App.addEventListener('requestsLoaded',requestsLoadedCallBack);
	
	requestNoticeView.add(requestLabel);
	requestNoticeView.add(requestImage);
	userRequestView.add(requestNoticeView);
	activityView.add(userRequestView);	
	
}
//ACTIVITY////////////////////////////////////////////////////
	var ActivityLabel = Ti.UI.createLabel({
		text: 'ACTIVITY',
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		height: 30,
		textAlign: 'left',
		left: 10, top: 0,
		visible: false
	});

	var emptyActivity = Ti.UI.createLabel({
		text: _userProfile.first_name+' '+_userProfile.last_name+' has no activity.',
		font: {fontSize: 14},
		color: '#fff',
		height: 30,
		top: 10,
		zIndex: -10,
	});
	
	var userActivity = Ti.UI.createTableView({
		width: 290,
		backgroundColor: '#eeeeee',
		borderRadius: 10,
		scrollable: false,
		bottom: 10,
		top: 30,
		visible: false
	});
	
	var createActivityTable = function(myActivity) {
		var activity = [];
		var name;
		var numLoops = 5;
		
		emptyActivity.visible = false;
		
		if(_status==="me") name = "You";
		else name = _userProfile.first_name;
		
		if(myActivity.length < numLoops) {
			numLoops = myActivity.length;
			}
		
		if(numLoops===0) {
			emptyActivity.visible = true;
		}		

		for(var i =0;i< numLoops;i++){	// if numLoops = 0, it won't get into 'for' loop
			
			ActivityLabel.visible = true;
			userActivity.visible = true;
			
  			var dm = moment(myActivity[i].updated_at,"YYYY-MM-DDTHH:mm:ss");
			var activityDateStr = since(dm);
			
			var userActivityRow = Ti.UI.createTableViewRow({
				backgroundColor: '#eeeeee',
				width: 290,
				height: 55,
				selectedBackgroundColor: '#eeeeee'
			});
			
			var activityType = Ti.UI.createImageView({
				left: 10,
			});
			
			var activityInfo = Ti.UI.createLabel({
				font: {fontSize: 12},
				color: '#666',
				top: 2,
				left: 50,
				height:30,
				width: 220,
			});

			var activityTime = Ti.UI.createLabel({
				font: {fontSize: 12},
				color: '#999',
				left: 50,
				height:20,
				bottom: 5
			});
			userActivityRow.target_id = myActivity[i].targetedObjectID;
			userActivityRow.category = myActivity[i].category;			

			if(myActivity[i].category==='addfriend') {
				if(name ==="You") _name = "you";
				else _name = name;
				activityType.image= 'images/icon/act_add.png'
				activityInfo.text = myActivity[i].additionalData + ' sent '+_name+' a friend request';
			} else if (myActivity[i].category==='approvefriend') {
				if(name ==="You") _name = "you";
				else _name = name;
				activityType.image= 'images/icon/act_add.png';
				activityInfo.text = myActivity[i].additionalData + ' approved '+_name+' as a friend';
			} else if (myActivity[i].category==='comment') {
				activityType.image= 'images/icon/act_chat.png'
				activityInfo.text = 'Someone commented on your post: '+myActivity[i].additionalData;
			} else if (myActivity[i].category==='getbadge') {
				activityType.image= 'images/icon/act_badge.png';
				activityInfo.text = name + ' have got a new badge: ' + myActivity[i].additionalData;
			} else if (myActivity[i].category==='checkin') {
				activityType.image= 'images/icon/act_tv.png';
				activityInfo.text = name + ' have checked in to ' + myActivity[i].additionalData;
			};
			
			activityTime.text = activityDateStr;

			userActivityRow.add(activityType);	
			userActivityRow.add(activityInfo);
			userActivityRow.add(activityTime);
			activity[i] = userActivityRow;
		}	//end of for loop: create each activity row
		userActivity.height = numLoops*55;
		userActivity.data = activity;

		userActivityView.add(userActivity);
		userActivityView.add(ActivityLabel);
		activityView.add(userActivityView);
		
		if(friendRequests.length) activityView.height = 350;
		else activityView.height = userActivityView.height;
	}	// end of function: createActivityTable
		
	var checkFriend = function() {
		var user_status = "friend";
 		for(i=0;i<friendRequests.length;i++) {
 			if (friendRequests[i].friend_id) {
 				user_status = "stranger";
 				break;
 			}
 		}
 		return user_status;
	}
	
	var activityLoadedCallBack = function(e) {
		ActivityModel.activityModel_fetchedActivityFromACS(e.fetchedActivity,curId);
	}
	
	var updateAnActivityCallBack = function(e) {
		ActivityModel.activity_updateOne(e.fetchedAnActivity);
		Ti.App.fireEvent('activityDbUpdated');
	}
			
	userActivity.addEventListener('click',function(e) {
		var userStatus = checkFriend();	// add friend / approve friend
		if(e.rowData.target_id !== acs.getUserId() && (e.rowData.category === 'addfriend' || e.rowData.category === 'approvefriend')) {
			Ti.API.info('userStatus = '+userStatus);
			Ti.API.info('e.rowData.target_id = '+e.rowData.target_id);
			var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');	
			var profilewin = new ProfileMainWindow(e.rowData.target_id,userStatus);
			_parentWindow.containingTab.open(profilewin);
		}
		if(e.rowData.category === 'comment') {
			var CommentWindow = require('ui/common/Mb_CommentWindow');
			var commentwin = new CommentWindow(e.rowData.target_id);			
			_parentWindow.containingTab.open(commentwin);
		}
			
	});

	var activityDbUpdatedcallback = function() {
		myActivity = ActivityModel.activityModel_fetchActivity(curId);
		createActivityTable(myActivity);
	}
	
	Ti.App.addEventListener('activityDbUpdated',activityDbUpdatedcallback);
	Ti.App.addEventListener('activityLoaded'+curId, activityLoadedCallBack);
	Ti.App.addEventListener('updateAnActivity'+curId,updateAnActivityCallBack);	
		
	var clearListeners = function() {
		Ti.API.info('remove Eventlistener...openActivityDetail event'+curId);
		Ti.App.removeEventListener('activityDbUpdated',activityDbUpdatedcallback);
		Ti.App.removeEventListener('activityLoaded'+curId, activityLoadedCallBack);
		Ti.App.removeEventListener('updateAnActivity'+curId,updateAnActivityCallBack);
		Ti.App.removeEventListener('profileMainWindowClosing'+curId,clearListeners);
	}
	Ti.App.addEventListener('profileMainWindowClosing'+curId, clearListeners);
			
	userActivityView.add(emptyActivity);
	return activityView;
}

module.exports = ProfileActivityView;