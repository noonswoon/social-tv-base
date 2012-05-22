var ProfileDetailView = function(){
	
///MENU//////////////////////////////////////////////////////////
		var profileMenu = Ti.UI.createView({
			height: 50,
		 backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fffefd', offset: 0.0}, { color: '#d2d1d0', offset: 1.0 } ]},
		});
		var profileTab = Titanium.UI.iOS.createTabbedBar({
			labels:['Stats', 'Activity', 'Badges', 'Rewards'],
			backgroundColor:'#398bb0',
			backgroundSelectedColor: '#fff',
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
		//backgroundImage: 'images/icon/bg.png',
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	var profileDetailScroll = Ti.UI.createScrollView({
		contentWidth:312,
		contentHeight:'auto',
		backgroundColor: 'transparent',
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
		for (var i in profileDetailScroll.children){
			if (profileDetailScroll.children.hasOwnProperty(i)) {
				profileDetailScroll.remove(profileDetailScroll.children[i]);
			}
		}			
/*		while (profileDetailScroll.children !== undefined && profileDetailScroll.children.length !== 0){
				profileDetailScroll.remove(profileDetailScroll.children[0]);}	
*/			
		if(e.index==0){
			profileDetailScroll.add(profileStats);}
		else if (e.index==1) {
			profileDetailScroll.add(profileActivity);}
		else if (e.index==2) {
			profileDetailScroll.add(profileBadge);}	
		else{
			profileDetailScroll.add(profileReward);}
	});		
		
	profileDetailScroll.add(profileStats);
	profileDetail.add(profileDetailScroll);
//////////////////////////////////////////////////////////////////

	detail.headerView = profileMenu;
	detail.add(profileDetail);

return detail;
}

module.exports = ProfileDetailView;
