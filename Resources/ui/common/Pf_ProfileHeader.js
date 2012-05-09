
var ProfileHeaderView = function(){
	var headerView = Ti.UI.createView({
				backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]}
	});

		var profilePicture = Ti.UI.createImageView({
			image: 'images/kuma100x100.png',
			top: 10, left: 10,
			width: 100,
			height: 100,
			border: 1,
			borderColor: '#999',
			backgroundColor: '#E2E5EE'	
		});
		var profileName = Ti.UI.createLabel({
			text: 'Jaew Panisa', //name
			top: 5,
			left: 120,
			width: 'auto',
			height: 30,
			font: { fontWeight: 'bold', fontSize: 14}
		})
		//switch: login via ?
		var fbLogin = Ti.UI.createView({
			top: 40,
			left: 120,
			width: 60,
			height: 70
		});

		//number of like
		var columnLike = Ti.UI.createView({
			top: 40,
			left: 185,
			width: 60,
			height: 70,
			backgroundColor: '#999',
			opacity: 0.9
		});
			//img
			var columnLikeImage = Ti.UI.createImageView({
				image: 'images/KS_nav_ui.png',
				width: 30,
				height: 30,
				top: 3
			});
			//count
			var columnLikeCount = Ti.UI.createLabel({
				text: '59',
				font: {fontSize: 26, fontStyle: 'bold'},
				color: '#fff',
				top: 30
			});
		//number of post
		var columnPost = Ti.UI.createView({
			top: 40,
			left: 250,
			width: 60,
			height: 70,
			backgroundColor: '#999',
			opacity: 0.9
		});
			//	img
			var columnPostImage = Ti.UI.createImageView({
				image: 'images/KS_nav_views.png',
				width: 30,
				height: 30,
				top: 3
			});
			// count
			var columnPostCount = Ti.UI.createLabel({
				text: '27',
				font: {fontSize: 26, fontStyle: 'bold'},
				color: '#fff',
				top: 30
			});

	headerView.add(profilePicture);
	headerView.add(profileName);
	headerView.add(fbLogin);
		columnLike.add(columnLikeImage);
		columnLike.add(columnLikeCount);
	headerView.add(columnLike);
		columnPost.add(columnPostImage);
		columnPost.add(columnPostCount);
	headerView.add(columnPost);		

return headerView;

}

module.exports = ProfileHeaderView;
