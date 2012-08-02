function ChannelSelectionMainWindow(){
	
	var PopularWindow = require('ui/common/Cs_PopularWindow');
	var GuideWindow = require('ui/common/Cs_GuideWindow');
	var FriendsWindow = require('ui/common/Cs_FriendsWindow');

	//TODO
	//Bug when click at inappropriate area
	var self = Ti.UI.createWindow({
		barImage: 'images/nav_bg_w_pattern.png',
	});
	
	var popularwin = new PopularWindow(self); 
	var guidewin = null; //new GuideWindow(self);
	var friendswin = null;// new FriendsWindow();

	var tabBar = Ti.UI.iOS.createTabbedBar({
		labels: [L('Popular'),L('Guide'),L('Friends')],
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height:30,
		width:200,
		index:0,
		backgroundColor: '#429fc8'
	});

	var blankView = Ti.UI.createView({
		backgroundColor: 'transparent',
		zIndex: 0
	});
	blankView.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#d2d1d0', offset: 0.0}, { color: '#fffefd', offset: 1.0 }]
	};		

	var mainView = Ti.UI.createView({
		top: 0,
		height: 'auto'
	}); 
	
	mainView.add(popularwin);
 	self.setTitleControl(tabBar)

	tabBar.addEventListener('click', function(e){
		if(e.index === undefined) return; //แก้  bug จอดำ..click ไม่โดน tab
		
		for (var i in mainView.children){
			if (mainView.children.hasOwnProperty(i)) {
				mainView.remove(mainView.children[i]);
				//Ti.API.info('removing window...');
			}
		}		

		if(e.index==0){
			mainView.add(popularwin);
		}
		else if (e.index==1){
			if(guidewin == null)
				guidewin = new GuideWindow(self);
			mainView.add(guidewin);
		}
		else if (e.index==2){
			if(friendswin == null)
				friendswin = new FriendsWindow(self);
			mainView.add(friendswin);
		} else {
			Ti.API.info('what is going on???: '+JSON.stringify(e));
		} 	
	});
	
	self.addEventListener('focus', function() { //prevent openning multiple checkin windows when things are slow
		if(popularwin !== null) popularwin._enableOpenCheckinWindow();
		if(guidewin !== null) guidewin._enableOpenCheckinWindow();
		if(friendswin !== null) friendswin._enableOpenCheckinWindow();
	});
	
	self.add(blankView);
	self.add(mainView);
	return self;
}
module.exports = ChannelSelectionMainWindow;
