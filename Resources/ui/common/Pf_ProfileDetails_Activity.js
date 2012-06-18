var ProfileActivityView = function(_parentWindow,_userProfile,_status){
	var	profileDataImg = 'images/kuma100x100.png';
	var FriendACS = require('acs/friendsACS');
	var FriendsModel = require('model/friend');
	var activityModel = require('model/activity');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');	
	var BadgeDetailWindow = require('ui/common/Pf_BadgeDetailWindow');
	//var FriendsMainWindow = require('ui/common/pf_friendsMainWindow');
	var curId = _userProfile.id;
	var activity = [];
	var name;
	
	if(_status==="me") name = "You";
	else name = _userProfile.first_name; //+ ' ' + _userProfile.last_name;
	
	var activityView = Ti.UI.createView({
		top: 10,
		height: 'auto',
		bottom: 10	
	});

//FRIEND REQUEST//////////////////////////////////////////////
	var requestNoticeView = Ti.UI.createView({
		height: 40, width: 290,
		backgroundColor: '#48a8d0',
		borderRadius: 10,
		top: 0
	});
	
	requestNoticeView.addEventListener('click', function(){
		Ti.API.info('friend request window!');
		_parentWindow.containingTab.open(new FriendsMainWindow(_parentWindow,"stranger"));
	});
	
	var requestImage = Ti.UI.createImageView({
		image: 'images/icon/act_add_white.png',
		left: 10
	});
	
	var requestLabel = Ti.UI.createLabel({
		color: '#fff',
		text: '',
		shadowColor: '#999',
		left: 50,
		font: {fontSize: 13, fontWeight: 'bold'}
	});
	
	var createNotice = function(){
		if (friendRequests.length !== 0){
			requestLabel.text = 'You have got '+friendRequests.length+' friend request(s).',
			requestNoticeView.add(requestLabel);
			requestNoticeView.add(requestImage);
			userRequestView.add(requestNoticeView);
			activityView.add(userRequestView);
			userActivityView.top = 40;
		}
		else {	
			userActivityView.top = 0;
			userRequestView.visible = false;
		}
	}
	
	 var requestsLoadedCallBack = function(e){
		var requestUsers = e.fetchedRequests; //update global variable - requestUsers
			friendRequests = [];
		 for(var i=0;i<requestUsers.length;i++) {
			 friendRequests.push(requestUsers[i]); //global variable in app.js
		 }
		 createNotice();
	 };
	 Ti.App.addEventListener('requestsLoaded',requestsLoadedCallBack);

//ACTIVITY////////////////////////////////////////////////////
	var ActivityLabel = Ti.UI.createLabel({
		text: 'ACTIVITY',
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		height:30,
		textAlign: 'left',
		left: 10, top: 0,
		visible: false
	});

	var createActivityTable = function(myActivity){
		var numLoops = 5;
		if(myActivity.length < numLoops) numLoops = myActivity.length;
		if(myActivity.length!==0){
			ActivityLabel.visible = true;
			userActivity.visible = true;
		}
		for(var i =0;i< numLoops;i++){
			var userActivityRow = Ti.UI.createTableViewRow({
				backgroundColor: '#fff',
				width: 290,
				height: 55,
				selectedBackgroundColor: '#fff'
			});
			userActivityRow.target_id = myActivity[i].targetedObjectID;
			userActivityRow.category = myActivity[i].category;
			
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

			if(myActivity[i].category==='addfriend'){
				if(name ==="You") _name = "you";
				else _name = name;
				activityType.image= 'images/icon/act_add_color.png'
				activityInfo.text = myActivity[i].additionalData + ' sent '+_name+' you a friend request';
			} else
			if(myActivity[i].category==='approvefriend'){
				if(name ==="You") _name = "you";
				else _name = name;
				activityType.image= 'images/icon/act_add_color.png';
				activityInfo.text = myActivity[i].additionalData + ' approved '+_name+' as a friend';
			} else
			if(myActivity[i].category==='post'){
				activityType.image= 'images/icon/act_chat_color.png'
			} else
			if(myActivity[i].category==='getbadge'){
				activityType.image= 'images/icon/act_badge_color.png';
				activityInfo.text = name + ' have got a new badge: ' + myActivity[i].additionalData;
			} else
			if(myActivity[i].category==='checkin'){
				activityType.image= 'images/icon/act_tv_color.png';
				activityInfo.text = name + ' have checked in to ' + myActivity[i].additionalData;
			}
			var dm = moment(myActivity[i].updated_at, "YYYY-MM-DDTHH:mm:ss");
			var activityDateStr = since(dm);
			activityTime.text = activityDateStr;

			userActivityRow.add(activityType);	
			userActivityRow.add(activityInfo);
			userActivityRow.add(activityTime);
			activity[i] = userActivityRow;
		}
		
		userActivity.height = numLoops*55;
		userActivity.data = activity;
		
	};
	
//////////////////////////////////////////////////////////////
		
	var userActivity = Ti.UI.createTableView({
		width: 290,
		backgroundColor: '#fff',
		borderRadius: 10,
		scrollable: false,
		bottom: 10,
		top: 30,
		visible: false
	});

	userActivity.addEventListener('click',function(e){
		var userStatus = checkFriend();
		//add friend / approve friend
		if(e.rowData.target_id !== acs.getUserId() &&(e.rowData.category ==='addfriend' || e.rowData.category ==='approvefriend')) {
			_parentWindow.containingTab.open(new ProfileMainWindow(e.rowData.target_id,userStatus));
		}	
	});
	
	var checkFriend = function(){
		var isFriend = "friend";
 		for(i=0;i<friendRequests.length;i++){
 			if (friendRequests[i].friend_id) {
 				isFriend = "stranger";
 				break;
 			}
 		}
 		return isFriend;
	}
	
	var userRequestView = Ti.UI.createView({
		height: 60,
		top: 0, bottom:0
	});
		
	var userActivityView = Ti.UI.createView({
		height: 'auto',
		top: 0,
	});
		
	userActivityView.add(userActivity);
	userActivityView.add(ActivityLabel);
	
	
	activityView.add(userActivityView);
	
	var activityLoadedCallBack = function(e){
		activityModel.activityModel_fetchedActivityFromACS(e.fetchedActivity,curId);
	};
	Ti.App.addEventListener('activityLoaded'+curId,activityLoadedCallBack);
	
	Ti.App.addEventListener('activityDbUpdated',function(){
		myActivity = activityModel.activityModel_fetchActivity(curId);
		createActivityTable(myActivity);
	});
	
	return activityView;
}

module.exports = ProfileActivityView;