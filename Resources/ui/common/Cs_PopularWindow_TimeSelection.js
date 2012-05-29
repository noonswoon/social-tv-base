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
	

	var PopularTimeSelectionView = require('ui/common/Cs_PopularTimeSelectionView');
	var hoursArray = [];
	for(var i=0;i<24;i++){
		
		hoursArray[i] = new PopularTimeSelectionView(i);

		hoursArray[i].addEventListener('click', function(e) {
			var timeIndex = e.source.timeIndex;
			alert(timeIndex);
			Ti.App.fireEvent('updatePopularProgramAtTime',{timeIndex:timeIndex});
		});
		selectionView.add(hoursArray[i]);
		
	}

	self.add(selectionView);
//	self.add(selectionBubble);
	self.add(rightImage);
	self.add(leftImage);
	
return self;
}

module.exports = TimeSelectionView;
