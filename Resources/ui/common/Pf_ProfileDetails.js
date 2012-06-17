var ProfileDetailView = function(_parent,_userProfile,_status){
	var user_id = _userProfile.id;
	var friendACS = require('acs/friendsACS');
	
///MENU//////////////////////////////////////////////////////////
	var profileMenu = Ti.UI.createView({
		height: 40,
		backgroundGradient: {
			type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fffefd', offset: 0.0}, { color: '#d2d1d0', offset: 1.0 } ]},
		});
		
	var profileTab = Titanium.UI.iOS.createTabbedBar({
		labels:['Stats', 'Activity', 'Badges', 'Rewards'],
		backgroundColor:'#5baad1',
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height:30,
		width:300,
		index:0
	});	
	

		
///DETAIL//////////////////////////////////////////////////////////
	var detail = Ti.UI.createTableViewSection();
	var profileDetail = Ti.UI.createTableViewRow({
		backgroundImage: '/images/admin/cb_backProfile.png',
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	var profileDetailScroll = Ti.UI.createScrollView({
		contentWidth:312,
		contentHeight:'auto',
		backgroundColor: 'transparent',
		top:0,
		showVerticalScrollIndicator:true,
		showHorizontalScrollIndicator:false,
		width: 312,
		height: 220,
	//	disableBounce: true
	});	
	
///////////////////////////////////////////////////////////////////
	var ProfileStats = require('ui/common/Pf_ProfileDetails_Stats');
	var ProfileActivity = require('ui/common/Pf_ProfileDetails_Activity');
	var ProfileBadge = require('ui/common/Pf_ProfileDetails_Badge');
	var ProfileReward = require('ui/common/Pf_ProfileDetails_Reward');
	
	var profileStatsView = new ProfileStats(_parent, _userProfile, _status);
	var profileActivityView = new ProfileActivity(_parent, _userProfile, _status);
	var profileBadgeView = new ProfileBadge(_parent, _userProfile, _status);	
	var profileRewardView = new ProfileReward(_parent);
			
	profileTab.addEventListener('click',function(e){
		for (var i in profileDetailScroll.children){
			if (profileDetailScroll.children.hasOwnProperty(i)) {
				profileDetailScroll.remove(profileDetailScroll.children[i]);
			}
		}			
		
		if(e.index==0){
			profileDetailScroll.add(profileStatsView);}
		else if (e.index==1) {
			profileDetailScroll.add(profileActivityView);}
		else if (e.index==2) {
			profileDetailScroll.add(profileBadgeView);}	
		else{
			profileDetailScroll.add(profileRewardView);}
	});		
///////////////////////////////////////////////////////////////////////////////////
	var addFriendView = Ti.UI.createView({
		height: 352,
	});
	addFriendView.backgroundGradient = {
	type: 'linear',
	startPoint: { x: '0%', y: '0%' },
	endPoint: { x: '0%', y: '100%' },
	colors: [{ color: '#c0c0c0', offset: 0.0},{ color: '#fffefd', offset: 0.00005 }, { color: '#fffefd', offset: 1.0 }]
	};
	
	 var addFriendButton = Ti.UI.createButton({
		backgroundImage: 'images/button/button_addFriend.png',
		backgroundSelectedImage: 'images/button/button_addFriend_over.png',
		width: 202,
	 	height: 38,
	 	top: 30
	 });
	 
	 addFriendButton.addEventListener('click', function(user_id){
	 	friendACS.addFriend(user_id,sendRequest);
	 });

	var sendRequest = function(_response){
		alert('Your request has been sent.');
		Ti.API.info(_response);
	};
///////////////////////////////////////////////////////////////////////////////////	
		
//	if(_status==="me" || _status==="friend"){
		profileMenu.add(profileTab);
		profileDetailScroll.add(profileStatsView);
		profileDetail.add(profileDetailScroll);
		detail.headerView = profileMenu;
		detail.add(profileDetail);
//	 };		
	
//	if(_status==="stranger"){
//		addFriendView.add(addFriendButton);
//		detail.headerView = addFriendView;
//	};

	return detail;
}

module.exports = ProfileDetailView;
