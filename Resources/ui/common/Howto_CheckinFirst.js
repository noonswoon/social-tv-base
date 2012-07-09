var CheckinNotice = function(_tab) {
		
	var self = Ti.UI.createView({
		//backgroundColor:'#000',
		top: 0,
		width: 320,
		height: 365,
		zIndex:40,
		
	});


	var checkinimg_notice = Ti.UI.createImageView({
		image: 'images/admin/checkin_first.png',
		top: 280
	});
	
	if(_tab==="chat") self.backgroundImage = 'images/chat/chat_checkinbg.png';
	if(_tab==="messageboard") self.backgroundImage = 'images/messageboard/board_checkinbg.png';
	if(_tab==="product") self.backgroundImage = 'images/product/product_checkinbg.png';
	self.add(checkinimg_notice);
	return self;	

};

module.exports = CheckinNotice;
