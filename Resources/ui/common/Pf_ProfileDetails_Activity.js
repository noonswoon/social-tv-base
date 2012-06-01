var ProfileActivityView = function(){
//test data			
	var	ProfileDataName= 'Jaew Panisa';
	var	ProfileDataImg = 'images/kuma100x100.png';
	var activity =[];
	var request =[];
	var requestUsers = []; //data to show in the request table view
	
	var activityView = Ti.UI.createView({
		top: 5
	});
	
	var createRequestFriends = function(){
	for(var i=0; i<requestUsers.length; i++){
		var requestRow = Ti.UI.createTableViewRow({
			selectedBackgroundColor: '#fff'
		});
		var requestPicture = Ti.UI.createImageView({
			image: ProfileDataImg,
			height: 30,
			width: 30,
		});			
		var requestPictureView = Ti.UI.createView({
			height: 34,
			width: 34,
			border: 1,
			borderColor: '#E2E5EE',
			backgroundColor: '#fff',
			left: 10
		});
		var requestInfo = Ti.UI.createLabel({
				font: {fontSize: 12},
				color: '#666',
				top: 5,
				left: 55,
				height:40,
				width:120,
				text: requestUsers[i].user.first_name+' '+ requestUsers[i].user.first_name + ' wants to add you as a friend'
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

		acceptButton.addEventListener('click',function(){
			alert('Accept')
		});
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
		requestPictureView.add(requestPicture);
		requestRow.add(requestPictureView);
		requestRow.add(requestInfo);
		requestRow.add(acceptButton);
		requestRow.add(declineButton);
		request[i] = requestRow;
	}
		requestActivity.height = (requestUsers.length*50)-(requestUsers.length*5);
		requestActivity.data = request;
		ActivityLabel.top = requestActivity.top + requestActivity.height +5;
		userActivityView.top = ActivityLabel.top+ActivityLabel.height+5;
	};

//	
	Ti.App.addEventListener('requestsLoaded',function(e){
		requestUsers = e.fetchedRequests[i];
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
		width: 300,
		backgroundColor: '#fff',
		height: 'auto',
		borderRadius: 10,
		top: 30,
		scrollable: false,
	});
//ACTIVITY////////////////////////////////////////////////////
	var ActivityLabel = Ti.UI.createLabel({
		text: 'ACTIVITY',
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		height:30,
		textAlign: 'left',
		left: 10,
	});
	for(var i =0;i<5;i++){
		var userActivityRow = Ti.UI.createTableViewRow({
			backgroundColor: '#fff',
			width: 300,
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
	var userActivity = Ti.UI.createTableView({
		width: 300,
		height: 200,
		backgroundColor: '#fff',
		borderRadius: 10,
		data: activity,
		scrollable: false,
		bottom: 10
	});
	
	var userActivityView = Ti.UI.createView({
		width: 312,
		height: 210,
	});
	
	userActivityView.add(userActivity);
	activityView.add(requestLabel);
	activityView.add(requestActivity);
	activityView.add(userActivityView);
	activityView.add(ActivityLabel);
	return activityView;
}

module.exports = ProfileActivityView;