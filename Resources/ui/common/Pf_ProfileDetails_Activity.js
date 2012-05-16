var ProfileActivityView = function(){
//test data			
	var	ProfileDataName= 'Jaew Panisa';
	var	ProfileDataImg = 'images/kuma100x100.png';
	var	ProfileDataBadgeLevel = 'Super Fan';
	var activity =[];

	for(var i =0;i<10;i++){
		var userActivityRow = Ti.UI.createTableViewRow({
			backgroundColor: '#fff',
			width: 300,
			height: 50,
			selectedBackgroundColor: '#fff'
		});
		var userPicture = Ti.UI.createImageView({
			image: ProfileDataImg,
			height: 30,
			width: 30,
			//border: 1,
			//borderColor: '#999',
			//left: 50
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
		userActivityRow.add(userPictureView);
		userActivityRow.add(activityInfo);
		userActivityRow.add(activityTime);
		activity[i] = userActivityRow;
	}

	var userActivity = Ti.UI.createTableView({
		width: 312,
		height: 190,
		backgroundColor: '#fff',
		borderRadius: 10,
		data: activity
	});
	
	var userActivityView = Ti.UI.createView({
		width: 312,
		height: 190,
	});
	
	userActivityView.add(userActivity);
	
	return userActivityView;
}

module.exports = ProfileActivityView;