var ProfileActivityView = function(){
	var FriendACS = require('acs/friendsACS');
	var FriendsModel = require('model/friend');
//test data			
	var _user = '4fa17dd70020440df700950c';
	var	ProfileDataName= 'Jaew Panisa';
	var	ProfileDataImg = 'images/kuma100x100.png';
	var activity =[];
	var request =[];
	var requestUsers = []; //data to show in the request table view
	
	var activityView = Ti.UI.createView({
		top: 10,
		height: 'auto',
		bottom: 10
		
	});
	
	var createRequestFriends = function(){
	for(var i=0; i<requestUsers.length; i++){
		var requestRow = Ti.UI.createTableViewRow({
			selectedBackgroundColor: '#fff',
			height: 45
		});
		
		var requestPicture = Ti.UI.createImageView({
			image: ProfileDataImg,
			height: 35,
			width: 35,
			borderRadius: 5,
			left: 5
		});			

		var requestInfo = Ti.UI.createLabel({
				font: {fontSize: 13, fontWeight: 'bold'},
				color: '#42a2ca',
				left: 45,
				height:40,
				width:120,
				text: requestUsers[i].first_name+' '+ requestUsers[i].last_name
		});
		var acceptButton = Ti.UI.createButton({
			backgroundColor: '#5baad1',
			borderRadius: 5,
			width: 50,
			height: 25,
			right: 65,
			title: 'Accept',
			style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
			font: {fontSize: 13},
		});
		acceptButton.myIndex = i;
		acceptButton.addEventListener('click',function(e){
			var index = e.source.myIndex;
			FriendsModel.friend_create(requestUsers[index].friend_id);
			FriendACS.approveFriend(requestUsers[index].friend_id,approveRequest);
		});

	var approveRequest = function(_response){
		alert('You have approved the request');
		Ti.API.info(_response);
	};

		var declineButton = Ti.UI.createButton({
			backgroundColor: '#d74e55',
			borderRadius: 5,
			width: 50,
			height: 25,
			right: 10,
			title: 'Decline',
			style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
			font: {fontSize: 13},
		});
		declineButton.addEventListener('click',function(){
			alert('Decline')
		});
		requestRow.add(requestPicture);
		requestRow.add(requestInfo);
		requestRow.add(acceptButton);
		requestRow.add(declineButton);
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
	};

	
	Ti.App.addEventListener('requestsLoaded',function(e){
		requestUsers = e.fetchedRequests;
		createRequestFriends();
	});
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
	
	requestActivity.addEventListener('click',function(e){
		if(e.source.title==="Accept")
		requestActivity.deleteRow(e.index);
		request.splice(e.index,1);
		requestUsers.splice(e.index,1);
		requestActivity.height = (requestUsers.length)*45;
		userActivityView.top = requestActivity.height+ 30;
		if(requestUsers.length===0){
			userActivityView.top = 0;
			userRequestView.remove(requestActivity);
			userRequestView.remove(requestLabel);
			activityView.remove(userRequestView);
		}; 
	});
	
	
//ACTIVITY////////////////////////////////////////////////////
	for(var i =0;i<5;i++){
		var userActivityRow = Ti.UI.createTableViewRow({
			backgroundColor: '#fff',
			width: 290,
			height: 50,
			selectedBackgroundColor: '#fff'
		});
		var activityType = Ti.UI.createImageView({
			left: 10,
			opacity: 0.6
		});
		//randomly set activity image
		if(i%3===0){activityType.image= 'images/icon/act_add.png'}
		else if(i%3===1){activityType.image= 'images/icon/act_chat.png'}
		else{activityType.image= 'images/icon/act_checkin.png'};
		
		var userPicture = Ti.UI.createImageView({
			image: ProfileDataImg,
			height: 30,
			width: 30,
		});			
		var userPictureView = Ti.UI.createView({
			height: 34,
			width: 34,
			border: 1,
			borderColor: '#E2E5EE',
			backgroundColor: '#fff',
			left: 50
		});
		
		var activityInfo = Ti.UI.createLabel({
				font: {fontSize: 12},
				color: '#666',
				top: 5,
				left: 90,
				height:20,
				text: 'Jaew Panisa added you as a friend aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
		});
		var activityTime = Ti.UI.createLabel({
				font: {fontSize: 12},
				color: '#999',
				top: 20,
				left: 90,
				height:20,
				text: '3 hours ago'
			});	
		userPictureView.add(userPicture);
		userActivityRow.add(activityType);	
		userActivityRow.add(userPictureView);
		userActivityRow.add(activityInfo);
		userActivityRow.add(activityTime);
		activity[i] = userActivityRow;
	}

//////////////////////////////////////////////////////////////
	var ActivityLabel = Ti.UI.createLabel({
		text: 'ACTIVITY',
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		height:30,
		textAlign: 'left',
		left: 10, top: 0,
		});
	var userActivity = Ti.UI.createTableView({
		width: 290,
		height: 200,
		backgroundColor: '#fff',
		borderRadius: 10,
		data: activity,
		scrollable: false,
		bottom: 10,
		top: 30
	});
	
	var userRequestView = Ti.UI.createView({
		height: 'auto',
		top: 0, bottom:0,
	});
		
	var userActivityView = Ti.UI.createView({
		height: 'auto',
		top: userRequestView.height,
	});
		
	userActivityView.add(userActivity);
	userActivityView.add(ActivityLabel);
	
	userRequestView.add(requestActivity);
	userRequestView.add(requestLabel);
	
	if(requestUsers.length!==0){
		activityView.add(userRequestView);
	};

	activityView.add(userActivityView);

	return activityView;
}

module.exports = ProfileActivityView;