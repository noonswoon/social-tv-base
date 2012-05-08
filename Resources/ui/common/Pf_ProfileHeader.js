
var ProfileHeaderView = function(){
	var headerView = Ti.UI.createView({
				backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ],
   			}
	});
	
	headerView.thumbnail = Ti.UI.createImageView({
		image: 'images/kuma100x100.png',
		top: 10, left: 10,
		width: 100,
		height: 100,
		border: 1,
		borderColor: '#999',
		backgroundColor: '#E2E5EE'	
	});
headerView.add(headerView.thumbnail);
	
	headerView.nameLabel = Ti.UI.createLabel({
		text: 'Jaew Panisa', //name
		top: 5,
		left: 120,
		width: 'auto',
		height: 30,
		font: { fontWeight: 'bold', fontSize: 14}
	})
headerView.add(headerView.nameLabel);
//switch: login via ?
	headerView.login = Ti.UI.createView({
		top: 40,
		left: 120,
		width: 60,
		height: 70,
		border:1,
		borderColor: '#999'
	});
headerView.add(headerView.login);

	//number of like
	headerView.like = Ti.UI.createView({
		top: 40,
		left: 185,
		width: 60,
		height: 70,
		backgroundColor: '#999',
		opacity: 0.9
	});
	//	img
	headerView.like.likeImage = Ti.UI.createImageView({
		image: 'images/KS_nav_ui.png',
		width: 30,
		height: 30,
		top: 3
	});
	// count
	headerView.like.likeCount = Ti.UI.createLabel({
		text: '59',
		font: {fontSize: 26, fontStyle: 'bold'},
		color: '#fff',
		top: 30
	});
	headerView.like.add(headerView.like.likeImage);
	headerView.like.add(headerView.like.likeCount);

headerView.add(headerView.like);
		
	//number of post
	headerView.post = Ti.UI.createView({
		top: 40,
		left: 250,
		width: 60,
		height: 70,
		backgroundColor: '#999',
		opacity: 0.9
	});
	//	img
	headerView.post.postImage = Ti.UI.createImageView({
		image: 'images/KS_nav_views.png',
		width: 30,
		height: 30,
		top: 3
	});
	// count
	headerView.post.postCount = Ti.UI.createLabel({
		text: '27',
		font: {fontSize: 26, fontStyle: 'bold'},
		color: '#fff',
		top: 30
	});
	
	headerView.post.add(headerView.post.postImage);
	headerView.post.add(headerView.post.postCount);

headerView.add(headerView.post);		

return headerView;

}

module.exports = ProfileHeaderView;
