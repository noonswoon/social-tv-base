var PopularWindowSrcollviewTimeSelection = function(){

	var self = Ti.UI.createView({
	backgroundColor: '#fff'
	});

	var selectionView = Ti.UI.createScrollView({
	contentWidth:1215,
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
////////////////////////////////////////SCROLLVIEW ACCORDING WITH TIME
	var now = moment().format('HH');
		var b = ((now-3)*45)+24;
		selectionView.scrollTo(b,0);
//////////////////////////////////////////////////////////////////////
	var PopularTimeSelectionView = require('ui/common/Cs_PopularTimeSelectionView');
	var hoursArray = [];
	for(var i=0;i<24;i++){
		
		hoursArray[i] = new PopularTimeSelectionView(i);

		hoursArray[i].addEventListener('click', function(e) {
			var timeIndex = e.source.timeIndex;
			Ti.App.fireEvent('updatePopularProgramAtTime',{timeIndex:timeIndex});
		});
		selectionView.add(hoursArray[i]);
		
	}

	self.add(selectionView);
//	self.add(selectionBubble);
	
return self;
}

module.exports = PopularWindowSrcollviewTimeSelection;
