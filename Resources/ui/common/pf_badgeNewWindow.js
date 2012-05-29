BadgeView = function (_badge){
	
//hard code
	img = _badge.badgeImage;
	title = _badge.badgeTitle;
	detail = _badge.badgeDesc;
	unlock = _badge.badgeUnlock;
//		
	var self = Ti.UI.createWindow({
		top: 0,
		left: 320,
		width: 257,
		height: 480,
		zIndex: 1,
		backgroundImage: 'images/badge/badgewin.png'
	});
	
	var badgeView = Ti.UI.createView({
		left: 20
	});
	
	var badgeImg = Ti.UI.createImageView({
		height: 200, width: 200,
		top: 35,
	});
	var badgeTitle = Ti.UI.createLabel({
		font: {fontSize: 20, fontWeight: 'bold'},
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
	
	//if badge unlock
	if(unlock===1){
		badgeImg.image = img;
		badgeTitle.text = title;
		badgeCons.text = 'Congratulations on Your Badge!';
		badgeCons.left = 5,
		badgeDesc.text = detail;
	}
	else {
		badgeImg.image = 'images/lockbadge.png';
		badgeTitle.text = '';
		badgeCons.text = 'You have not unlock this badge yet';
		badgeDesc.text = '';
	};
	
	badgeView.add(badgeImg);
	badgeView.add(badgeTitle);
	badgeView.add(badgeCons);
	badgeView.add(badgeDesc);	
	self.add(badgeView);
	
	var animateRight = Ti.UI.createAnimation({
		left: 320,
		curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT,
		duration: 500
	});
	
	badgeView.addEventListener('click',function(){
		self.animate(animateRight);
	//	self.close();
	});
	
	self._setBadgeTitle = function(_newTitle) {
		badgeTitle.text = _newTitle;
	};
	
	//write a setter function for image, detail, unlock
}
module.exports = BadgeView;
