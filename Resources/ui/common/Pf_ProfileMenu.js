var ProfileMenuView = function(){
	var profileMenu = Ti.UI.createView({
		height: 50,
		 backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ],
   			},

});
/*
	var profileTab = Titanium.UI.iOS.createTabbedBar({
		labels:['Stats', 'Activity', 'Badges', 'Rewards'],
		//backgroundColor:'#61A598',
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height:30,
		width:300,
		index:0
	});	*/
	
//	profileMenu.add(profileTab);

	return profileMenu;
	}


module.exports = ProfileMenuView;