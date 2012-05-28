var TimeSelectionView = function(){
	var self = Ti.UI.createView({
	backgroundColor: '#fff'
	});
	var leftImage = Ti.UI.createView({
		backgroundImage:'images/scheduleTime/left.png',
		height:40,
		width:30,
		left:0,
		//opacity: 0.7
	});
	var rightImage = Ti.UI.createView({
		backgroundImage:'images/scheduleTime/right.png',
		height:40,
		width:30,
		right:0,
		//opacity: 0.7
		});

	var selectionView = Ti.UI.createScrollView({
	contentWidth:1470,
	contentHeight:35,
	top:0,
	height:35,
	width:320,
	backgroundGradient: {
	type: 'linear',
	startPoint: { x: '0%', y: '0%' },
	endPoint: { x: '0%', y: '100%' },
	colors: [ { color: '#fffefd', offset: 0.0}, { color: '#d2d1d0', offset: 1.0 } ]}
	});
	
	selectionView.addEventListener('scroll', function(e)
	{
		if (e.x > 0)
		{
			leftImage.show();
		}
		else
		{
			leftImage.hide();
		}
		if (e.x < 1150)
		{
			rightImage.show();
		}
		else
		{
			rightImage.hide();
		}
	
	});
		
	var timeLabelView =Ti.UI.createView({
		height: 20,
	});
	var timeLabel = Ti.UI.createLabel({
		text: '00:00    01:00    02:00    03:00    04:00    05:00    06:00    07:00    08:00    09:00    10:00    11:00    12:00    13:00    14:00    15:00    16:00    17:00    18:00    19:00    20:00    21:00    22:00    23:00'
	});
	timeLabelView.add(timeLabel);
	selectionView.add(timeLabelView);
/*	var selectionBubble = Ti.UI.createImageView({
		image: 'images/scheduleTime/bubble.png',
		top:0,
	});
*/	
	self.add(selectionView);
//	self.add(selectionBubble);
	self.add(rightImage);
	self.add(leftImage);
	
return self;
}

module.exports = TimeSelectionView;
