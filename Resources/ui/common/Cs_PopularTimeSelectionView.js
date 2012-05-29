PopularTimeSelectionView = function(_timeIndex){
	this.timeIndex = _timeIndex;
	var margin = 10+_timeIndex*50;;
	var time = '';
	
	var timeView = Ti.UI.createView({
		backgroundColor:'#336699',
		width:40,
		height: 20,
		left:margin,
	});
	//margin = margin*_timeIndex+50;
		
	if(_timeIndex < 10)
		time = '0'+_timeIndex;
	else time = _timeIndex.toString();
		
	timeView.timeLabel = Ti.UI.createLabel({
		text: time+'.00',
		font:{fontSize:13},
		width:'auto',
		textAlign:'center',
		height:'auto',
		timeIndex: this.timeIndex
	});	
	
	timeView.add(timeView.timeLabel);
	
	return timeView;
}
module.exports = PopularTimeSelectionView;