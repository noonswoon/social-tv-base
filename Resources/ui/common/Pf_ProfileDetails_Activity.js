var ProfileActivityView = function(_parentWindow,_userProfile,_status){
	var	profileDataImg = 'images/kuma100x100.png';
	var FriendACS = require('acs/friendsACS');
	var FriendsModel = require('model/friend');
	var activityModel = require('model/activity');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	var curId = _userProfile.id;
	var activity = [];
	var request =[];
	var requestUsers = []; //data to show in the request table view
	var name;
	
	if(_status==="me") name = "You"
	else name = _userProfile.first_name + ' ' + _userProfile.last_name;
	
	var activityView = Ti.UI.createView({
		top: 10,
		height: 'auto',
		bottom: 10	
	});
	
	var approveRequest = function(_response){
		alert('You have approved the request');
		Ti.API.info(_response);
		FriendACS.friendACS_fetchedUserTotalFriends(myUserId);
	};
		
	var deleteRequestData = function(e){
		requestActivity.deleteRow(e.index);
		request.splice(e.index,1);
		requestUsers.splice(e.index,1);
		friendRequests.splice(e.index,1);
		if(requestUsers.length!==0){
			requestActivity.height = (requestUsers.length)*45;
			userActivityView.top = requestActivity.height+ 30;
		} else {
			userActivityView.top = 0;
			userRequestView.remove(requestActivity);
			userRequestView.remove(requestLabel);
			activityView.remove(userRequestView);
		}; 
		
	}
	
	var createRequestFriends = function(){
		for(var i=0; i<requestUsers.length; i++){
			var fb_id = requestUsers[i].fb_id;
			var requestRow = Ti.UI.createTableViewRow({
				selectedBackgroundColor: '#fff',
				height: 45
			});
			requestRow.user_id = requestUsers[i].friend_id;
			
			var requestPicture = Ti.UI.createImageView({
				image: profileDataImg,
				height: 35,
				width: 35,
				borderRadius: 5,
				left: 5
			});
			requestPicture.image = acs.getUserImageNormalOfFbId(fb_id);
	
			var requestInfo = Ti.UI.createLabel({
					font: {fontSize: 13, fontWeight: 'bold'},
					color: '#42a2ca',
					left: 45,
					height:40,
					width:120,
					text: requestUsers[i].first_name+' '+ requestUsers[i].last_name
			});
			var acceptButton = Ti.UI.createButton({
				width: 66,
				height: 30,
				right: 10,
				backgroundImage: 'images/button/button_accept.png',
			});
			acceptButton.myIndex = i;
			acceptButton.addEventListener('click',function(e){
				var index = e.source.myIndex;
				alert("Accept "+requestUsers[index].first_name+' '+ requestUsers[index].last_name + ' as your friend.');
				FriendsModel.friend_create(requestUsers[index],requestUsers[index].fb_id);
				FriendACS.approveFriend(requestUsers[index].friend_id,approveRequest);
			});

			requestRow.add(requestPicture);
			requestRow.add(requestInfo);
			requestRow.add(acceptButton);
			request[i] = requestRow;
		}
		requestActivity.height = (requestUsers.length*45);
		requestActivity.data = request;
		if(requestUsers.length){
			userActivityView.top = requestActivity.height+30;
			userRequestView.add(requestActivity);
			userRequestView.add(requestLabel);
			activityView.add(userRequestView);			
		};
		activityView.height = 'auto';
		
		requestActivity.addEventListener('click',function(e){
			if(e.source.title ==="Accept"){
				deleteRequestData(e);
			} else if(e.source.title !=="Accept") {
				Ti.API.info('open new profile main : ' + e.rowData.user_id);
				_parentWindow.containingTab.open(new ProfileMainWindow(e.rowData.user_id,"stranger"));
			}
	
		});
	};

	var requestsLoadedCallBack = function(e){
		requestUsers = e.fetchedRequests; //update global variable - requestUsers
		for(var i=0;i<requestUsers.length;i++) {
			friendRequests.push(requestUsers[i]);
		}
		createRequestFriends();
	};

	Ti.App.addEventListener('requestsLoaded',requestsLoadedCallBack);
	
//FRIEND REQUEST//////////////////////////////////////////////
	var requestLabel = Ti.UI.createLabel({
		text: 'FRIEND REQUEST',
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		height:30,
		textAlign: 'left',
		left: 10,
		top:0
	});
	
	var requestActivity = Ti.UI.createTableView({
		width: 290,
		backgroundColor: '#fff',
		height: 'auto',
		borderRadius: 10,
		top: 25,
		scrollable: false,
	});
	
	
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
			//randomly set activity image
			if(myActivity[i].category==='addfriend'){activityType.image= 'images/icon/act_add_color.png'}
			else if(myActivity[i].category==='post'){activityType.image= 'images/icon/act_chat_color.png'}
			else if(myActivity[i].category==='getbadge'){
				activityType.image= 'images/icon/act_badge_color.png';
				activityInfo.text = name + ' have got a new badge: ' + myActivity[i].additionalData;
			}
			else if(myActivity[i].category==='checkin'){
				activityType.image= 'images/icon/act_checkin_color.png';
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
	
	var userRequestView = Ti.UI.createView({
		height: 'auto',
		top: 0, bottom:0,
		zIndex: 10
	});
		
	var userActivityView = Ti.UI.createView({
		height: 'auto',
		top: userRequestView.height,
	});
		
	userActivityView.add(userActivity);
	userActivityView.add(ActivityLabel);
	
	userRequestView.add(requestActivity);
	userRequestView.add(requestLabel);
	
	activityView.add(userActivityView);
	
	var activityLoadedCallBack = function(e){
		activityModel.activityModel_fetchedActivityFromACS(e.fetchedActivity,curId);
	};
	Ti.App.addEventListener('activityLoaded'+curId,activityLoadedCallBack);
	
	Ti.App.addEventListener('activityDbUpdated',function(){
		myActivity = activityModel.activityModel_fetchActivity(curId);
		createActivityTable(myActivity);
	});
	
	
	// function clearListeners() {
		// Ti.API.info('remove Eventlistener...openActivityDetail event'+_userProfile.id);
		// Ti.App.removeEventListener('profileMainWindowClosing'+_userProfile.id, clearListeners);
	// }
	// Ti.App.addEventListener('profileMainWindowClosing'+_userProfile.id, clearListeners);
// 	
	return activityView;
}

module.exports = ProfileActivityView;