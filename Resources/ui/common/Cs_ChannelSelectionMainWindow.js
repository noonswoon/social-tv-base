function ChannelSelectionMainWindow(){
	
	var PopularWindow = require('ui/common/Cs_PopularWindow');
	var GuideWindow = require('ui/common/Cs_GuideWindow');
	var FriendsWindow = require('ui/common/Cs_FriendsWindow');

	var self = Ti.UI.createWindow({
		backgroundColor: 'transparent',
		barColor:'#398bb0',
		title: 'Popular'
	});
	
	var popularwin = new PopularWindow(self); 
	var guidewin = null; //new GuideWindow(self);
	var friendswin = new FriendsWindow();

	var tabBar = Ti.UI.iOS.createTabbedBar({
		labels: ['Popular','Guide','Friends'],
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		backgroundColor:'#398bb0',
		height:35,
		width:200,
		index:0
	});
	
	var mainView = Ti.UI.createView({
		top: 0,
		height: 'auto'
	}); 
	
	mainView.add(popularwin);
 	self.setTitleControl(tabBar);

	tabBar.addEventListener('click', function(e){
		for (var i in mainView.children){
			if (mainView.children.hasOwnProperty(i)) {
				mainView.remove(mainView.children[i]);
			}
		}		
		if(e.index==0){
			mainView.add(popularwin);
			if(guidewin != null)
				guidewin._closePopupWindow();
		}
		else if (e.index==1){
			if(guidewin == null)
				guidewin = new GuideWindow(self);
			mainView.add(guidewin);
		}
		else if (e.index==2){
			mainView.add(friendswin);
			if(guidewin != null)
				guidewin._closePopupWindow();
		}	
	});
	
	self.add(mainView);
	return self;
}
module.exports = ChannelSelectionMainWindow;
