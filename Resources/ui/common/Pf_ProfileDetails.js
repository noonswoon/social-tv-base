var ProfileDetailView = function(){
	
///MENU//////////////////////////////////////////////////////////
		var profileMenu = Ti.UI.createView({
			height: 50,
		 backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]},
		});
		var profileTab = Titanium.UI.iOS.createTabbedBar({
			labels:['Stats', 'Activity', 'Badges', 'Rewards'],
			//backgroundColor:'#61A598',
			style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
			height:30,
			width:300,
		//index:0
			index:3
		});	
		profileMenu.add(profileTab);
///DETAIL//////////////////////////////////////////////////////////
	var detail = Ti.UI.createTableViewSection();
	var profileDetail = Ti.UI.createTableViewRow({
		backgroundColor: '#212b3d',
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	var profileDetailScroll = Ti.UI.createScrollView({
		contentWidth:312,
		contentHeight:'auto',
		top:0,
		showVerticalScrollIndicator:true,
		showHorizontalScrollIndicator:true,
		width: 312,
		height: 198,
		disableBounce: true
	});	
	
///////////////////////////////////////////////////////////////////
	var ProfileStats = require('ui/common/Pf_ProfileDetails_Stats');
	var profileStats = new ProfileStats();
	var ProfileActivity = require('ui/common/Pf_ProfileDetails_Activity');
	var profileActivity = new ProfileActivity();
	var ProfileBadge = require('ui/common/Pf_ProfileDetails_Badge');
	var profileBadge = new ProfileBadge();	
	var ProfileReward = require('ui/common/Pf_ProfileDetails_Reward');
	var profileReward = new ProfileReward();
		
	profileTab.addEventListener('click',function(e){
		while (profileDetailScroll.children !== undefined && profileDetailScroll.children.length !== 0){
				profileDetailScroll.remove(profileDetailScroll.children[0]);
		}		
		if(e.index==0){
			profileDetailScroll.add(profileStats);}
		else if (e.index==1) {
			profileDetailScroll.add(profileActivity);}
		else if (e.index==2) {
			profileDetailScroll.add(profileBadge);}	
		else{
			profileDetailScroll.add(profileReward);}
	});		
		
	//profileDetailScroll.add(profileStats);
	profileDetailScroll.add(profileReward);
	profileDetail.add(profileDetailScroll);
//////////////////////////////////////////////////////////////////

	detail.headerView = profileMenu;
	detail.add(profileDetail);

return detail;
}

module.exports = ProfileDetailView;
