BadgeView = function (_badge){
	
//hard code
	img = 'images/badge/badge0.png';
	desc = 'Extreme Lover';
	detail = 'BwAHHHHH!';
	unlock = 1;
//		
	var self = Ti.UI.createWindow({
		top: 0,
		left: 0,
		width: 257,
		zIndex: 1
	});
	
	var badgeImg = Ti.UI.createImageView({
		height: 200, width: 200,
		top: 35,
	});
	var badgeDesc = Ti.UI.createLabel({
		font: {fontSize: 28, fontWeight: 'bold'},
		top: 245,
		height: 30,
		color: '#0ab7ff',
		shadowColor: '#026490'
	});
	var badgeCons = Ti.UI.createLabel({
		top: 290, left: 5,
		height: 30,
		color: '#999',
	});	
	var badgeDetail = Ti.UI.createLabel({
		top: 330, left: 5,
		width: 230,
		height: 'auto',
		color: '#999',
	});	
	
	//if badge unlock
	if(unlock===1){
		badgeImg.image = img;
		badgeDesc.text = desc;
		badgeCons.text = 'Congratulations on Your' + badgeDesc.text + 'Badge!';
		badgeDetail.text = detail;
	}
	else {
		badgeImg.image = 'images/lockbadge.png';
		badgeDesc.text = '';
		badgeCons.text = 'You have not unlock this badge yet';
		badgeDetail.text = '';
	};
	
	self.add(badgeImg);
	self.add(badgeDesc);
	self.add(badgeCons);
	self.add(badgeDetail);	
	
return self;
	
}
module.exports = BadgeView;
