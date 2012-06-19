PopularTimeSelectionView = function(_timeIndex){
	
	this.timeIndex = _timeIndex;
	var margin = 10+_timeIndex*50;
	var time = '';
	
	var timeView = Ti.UI.createView({
		width:40,
		left:margin
	});
	
	timeView.timeIndex = _timeIndex;
	
	if(_timeIndex < 10)
		time = '0'+_timeIndex;
	else time = _timeIndex.toString();
		
	timeView.timeLabel = Ti.UI.createLabel({
		text: time+'.00',
		font:{fontSize:14},
		textAlign:'center',
		timeIndex: this.timeIndex
	});	

	timeView.add(timeView.timeLabel);
	
	return timeView;
}
module.exports = PopularTimeSelectionView;