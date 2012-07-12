BadgeDetailWindow = function (_badge){

	var self = Ti.UI.createWindow({
		top: 0,
		left: 320,
		width: 257,
		height: 480,
		zIndex: 1,
		backgroundImage: 'images/badge/badgewin.png'
	});
	//make click event avaliable
	var badgeView = Ti.UI.createView({
		left: 20
	});
	
	var badgeImg = Ti.UI.createImageView({
		height: 200, width: 200,
		top: 35,
	});
	var badgeTitle = Ti.UI.createLabel({
		font: {fontSize: 16, fontWeight: 'bold'},
		top: 245,
		textAlign: 'center',
		height: 30,
		width: 220,
		color: '#0ab7ff',
		shadowColor: '#026490'
	});
	var badgeCons = Ti.UI.createLabel({
		top: 290, 
		height: 30,
		width: 220,
		color: '#999',
		font: {fontSize: 12}
	});	
	var badgeDesc = Ti.UI.createLabel({
		top: 330, left: 5,
		width: 220,
		height: 'auto',
		color: '#999',
		font: {fontSize: 12}
	});	
	
	var badgeWinClose = Ti.UI.createButton({
		bottom: 45,
		width: 200,
		height: 30,
		title: 'close'
	});

	badgeWinClose.addEventListener('click',function(){
		self.animate(animateRight);
	});

	badgeView.add(badgeImg);
	badgeView.add(badgeTitle);
	badgeView.add(badgeCons);
	badgeView.add(badgeDesc);
	badgeView.add(badgeWinClose);	
	self.add(badgeView);
	
	var animateRight = Ti.UI.createAnimation({
		left: 320,
		curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
		duration: 500
	});
	
	self._setBadgeTitle = function(_newTitle,_unlock) {
		if(_unlock===1){badgeTitle.text = _newTitle;} 
		else {badgeTitle.text ='';}
	};
	
	self._setBadgeImage = function(_newImage,_unlock) {
		if(_unlock===1){badgeImg.image = _newImage;}
		else {badgeImg.image = 'images/badge/lockedbadge.png';}
	};
	self._setBadgeDesc = function(_newDesc,_unlock) {
		if(_unlock===1){
			badgeCons.text = 'Congratulations on Your Badge!';
			badgeDesc.text = _newDesc;
			badgeCons.left = 5;	
		}
		else{
			badgeCons.text = 'You have not unlock this badge yet';
			badgeDesc.text = _newDesc;
		}
	};
	return self;
}
module.exports = BadgeDetailWindow;