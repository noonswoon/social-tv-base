var CheckinGuideline = function(_tab) {
		
	var self = Ti.UI.createView({
		top: 0,
		width: 320,
		height: 370,
		zIndex:40
	});

	var checkinImgNotice = Ti.UI.createImageView({
		image: 'images/admin/checkin_first.png',
		top: 280
	});
	
	if(_tab==="chat") self.backgroundImage = 'images/chat/chat_checkinbg.png';
	if(_tab==="messageboard") self.backgroundImage = 'images/messageboard/board_checkinbg.png';
	if(_tab==="product") self.backgroundImage = 'images/product/product_checkinbg.png';

	self.add(checkinImgNotice);
	return self;	
};

module.exports = CheckinGuideline;
