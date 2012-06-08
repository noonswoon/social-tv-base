function ChannelSelectionMainWindow(){
	
	var PopularWindow = require('ui/common/Cs_PopularWindow');
	var GuideWindow = require('ui/common/Cs_GuideWindow');
	var FriendsWindow = require('ui/common/Cs_FriendsWindow');

	//TODO
	//Bug when click at inappropriate area
	var self = Ti.UI.createWindow({
		barImage: 'images/NavBG.png',
	});
	
	var popularwin = new PopularWindow(self); 
	var guidewin = null; //new GuideWindow(self);
	var friendswin = null;// new FriendsWindow();

	var tabBar = Ti.UI.iOS.createTabbedBar({
		labels: ['Popular','Guide','Friends'],
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height:30,
		width:200,
		index:0,
		backgroundColor: '#429fc8'
	});
	
	// tabBar.addEventListener('click',function(e){
		// if(e.index === 0){
// 
		// }
	// });
	
	var mainView = Ti.UI.createView({
		top: 0,
		height: 'auto'
	}); 
	
	mainView.add(popularwin);
 	self.setTitleControl(tabBar)

	tabBar.addEventListener('click', function(e){
		for (var i in mainView.children){
			if (mainView.children.hasOwnProperty(i)) {
				mainView.remove(mainView.children[i]);
			}
		}		
		//TODO: revisit this logic
		if(e.index==0){
			mainView.add(popularwin);
			if(guidewin != null)
				guidewin._closePopupWindow();
			// if(friendswin != null)
				// friendswin._closePopupWindow();
		}
		else if (e.index==1){
			if(guidewin == null)
				guidewin = new GuideWindow(self);
			mainView.add(guidewin);
		}
		else if (e.index==2){
			if(friendswin == null)
				friendswin = new FriendsWindow();
			mainView.add(friendswin);
		}	
	});
	
	self.add(mainView);
	return self;
}
module.exports = ChannelSelectionMainWindow;
