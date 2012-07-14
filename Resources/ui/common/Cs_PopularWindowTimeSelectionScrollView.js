var PopularWindowScrollviewTimeSelection = function(){
	
	var PopularTimeSelectionView = require('ui/common/Cs_PopularTimeSelectionView');
	
	var self = Ti.UI.createView({
		backgroundColor: '#fff'
	});

	var selectionView = Ti.UI.createScrollView({
		contentWidth:1215,
		contentHeight:34,
		top:0,
		height:44,
		width:Ti.UI.SIZE,
		backgroundImage: 'images/ToolbarBG.png'
	});
	
	var currentHour = moment().hours();
		
	var positionX = ((currentHour-3)*45)+24;  
	selectionView.scrollTo(positionX,0);
	var selectedTimeIndex = currentHour;
	var hoursArray = [];
	
	for(var i = 0; i < 24; i++) {
		hoursArray[i] = new PopularTimeSelectionView(i);
		if(i === selectedTimeIndex) hoursArray[i]._selectView();
		
		hoursArray[i].addEventListener('click', function(e) {
			var timeIndex = this.timeIndex; //context of 'this' is PopularTimeSelectionView
			if(selectedTimeIndex !== timeIndex) {	//only do it if it is different time
				hoursArray[selectedTimeIndex]._deselectView();
				hoursArray[timeIndex]._selectView();
				selectedTimeIndex = timeIndex;	
				Ti.App.fireEvent('updatePopularProgramAtTime',{timeIndex:timeIndex});
			}
		});
		selectionView.add(hoursArray[i]);
	}

	self.syncTimeSelection = function() {
		Ti.API.info('syncing TimeSelection');
		currentHour = moment().hours();
		if(selectedTimeIndex !== currentHour) {	//only do it if it is different time
			hoursArray[selectedTimeIndex]._deselectView();
			hoursArray[currentHour]._selectView();
			selectedTimeIndex = currentHour;	
		}
	};
	
	self.add(selectionView);
	return self;
}
module.exports = PopularWindowScrollviewTimeSelection;