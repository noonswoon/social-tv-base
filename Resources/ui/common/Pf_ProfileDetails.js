var ProfileDetailView = function(_parent){
	
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
	profileMenu.add(profileTab);
		
///DETAIL//////////////////////////////////////////////////////////
	var detail = Ti.UI.createTableViewSection();
	var profileDetail = Ti.UI.createTableViewRow({
		backgroundColor: '#212b3d',
//		backgroundImage: 'images/bg.png',
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
		disableBounce: true
	});	
	
///////////////////////////////////////////////////////////////////
	var ProfileStats = require('ui/common/Pf_ProfileDetails_Stats');
	var ProfileActivity = require('ui/common/Pf_ProfileDetails_Activity');
	var ProfileBadge = require('ui/common/Pf_ProfileDetails_Badge');
	var ProfileReward = require('ui/common/Pf_ProfileDetails_Reward');
	
	var profileStatsView = new ProfileStats(_parent);
	var profileActivityView = new ProfileActivity(_parent);
	var profileBadgeView = new ProfileBadge(_parent);	
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
		
	profileDetailScroll.add(profileStatsView);
	//profileDetailScroll.add(profileBadgeView);
	profileDetail.add(profileDetailScroll);
	
	detail.headerView = profileMenu;
	detail.add(profileDetail);

	return detail;
}

module.exports = ProfileDetailView;
