ChatParticipantsScrollView = function() {

	var self = Ti.UI.createView({
		backgroundColor: '#fff'
	});
	
	var scrollView = Ti.UI.createScrollView({
		contentWidth:600,
		contentHeight:35,
		top:0,
		height:50,
		width:320,
	});
	
	for(var i=0;i<10;i++){
		var dummyImage = Ti.UI.createImageView({
			image:'dummy.png',
			height:40,
			width:30,
			left:i*30+10,
		});
		scrollView.add(dummyImage);	
	}

	self.add(scrollView);
	return self;
}

module.exports = ChatParticipantsScrollView;
