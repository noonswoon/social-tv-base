function ProfileMainWindow() {
	var self = Titanium.UI.createWindow({
		backgroundColor:'#fff',
		title: "My Profile",
		//barColor: '#61A598'
	});
/////////////////////////////////////
	var data = [];	

//NAVIGATION BAR//	
	
//HEADER//
	var headerView = Ti.UI.createView({
		 backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ],
   			},
		height: 120,
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
	var likeImage = Ti.UI.createImageView({
		image: 'images/KS_nav_ui.png',
		width: 30,
		height: 30,
		top: 3
	});
	// count
	var likeCount = Ti.UI.createLabel({
		text: '59',
		font: {fontSize: 26, fontStyle: 'bold'},
		color: '#fff',
		top: 30
	});
	headerView.like.add(likeImage);
	headerView.like.add(likeCount);

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
	var postImage = Ti.UI.createImageView({
		image: 'images/KS_nav_views.png',
		width: 30,
		height: 30,
		top: 3
	});
	// count
	var postCount = Ti.UI.createLabel({
		text: '27',
		font: {fontSize: 26, fontStyle: 'bold'},
		color: '#fff',
		top: 30
	});
	
	headerView.post.add(postImage);
	headerView.post.add(postCount);

headerView.add(headerView.post);		
	
//STAT//	
var profileMenu = Ti.UI.createTableViewRow({
	height: 50,
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		 backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ],
   			},
});
	profileMenu.profileTab = Ti.UI.createTabbedBar({
	labels:['Stats', 'Activity', 'Badges', 'Rewards'],
	//backgroundColor:'#61A598',
	style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	height:30,
	width:300,
	index:2
	});	
//TAB MENU
//	
var profileDetail = Ti.UI.createTableViewRow({
	height: 198,
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	backgroundColor: '#fff',
});

	profileDetail.details = Ti.UI.createView({
		height: 190,
		width: 312,
		borderRadius: 5,
		backgroundColor: '#999'});

profileDetail.add(profileDetail.details);	

//TAB MENU EVENT:D////////////////////////////////////////////
profileMenu.profileTab.addEventListener('click', function(e)
{
	l.text = 'You clicked index = ' + e.index;
});
//////////////////////////////////////////////////////////////
profileMenu.add(profileMenu.profileTab);

//no-edit! code:D//
var section = Ti.UI.createTableViewSection();
section.headerView = headerView;
section.add(profileMenu);
section.add(profileDetail);

data[0] = section;

var table = Ti.UI.createTableView({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		scrollable: false,
		data: data
	});
	self.add(table);
	
/////////////////////////////////////	
	return self;
}

module.exports = ProfileMainWindow;