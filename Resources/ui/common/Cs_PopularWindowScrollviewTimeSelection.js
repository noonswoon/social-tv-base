var PopularWindowSrcollviewTimeSelection = function(){

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
	

	
////////////////////////////////////////SCROLLVIEW ACCORDING WITH TIME
	var hour;

	var hourIndexStr = moment().format('HH'); //<< change name from hour to hourIndexStr
	if(hourIndexStr <= '09'){
		var hourSubstring = hourIndexStr.substring(1);
		hour = parseInt(hourSubstring);
	}
	else{
		hour = parseInt(hourIndexStr);
	}
	var positionX = ((hour-3)*45)+24;  
	selectionView.scrollTo(positionX,0);
	
	var showNow = Ti.UI.createImageView({
		image: 'images/shownow8.png',
		top: 6,
		left: hour*50-22
	});
	
	if(hour === 23){
		showNow.left = hour*50-5;
	}
	else
	{
		showNow.left = hour*50-22;
	}
	// selectionView.add(showNow);
	
	var textOfShowNow = Ti.UI.createLabel({
		text: '',
		left: 12+hour*50,
		color: 'red',
		font:{fontSize:14,fontWeight:'bold'},
		textAlign:'center',
		zIndex: 1
	});

	if(hour<=9){
		textOfShowNow.text = '0'+hour+'.00';
	}
	else{
		textOfShowNow.text = hour+'.00';
	}
	selectionView.add(textOfShowNow);
	
//////////////////////////////////////////////////////////////////////
	var PopularTimeSelectionView = require('ui/common/Cs_PopularTimeSelectionView');
	var hoursArray = [];
	for(var i=0;i<24;i++){
		
		hoursArray[i] = new PopularTimeSelectionView(i);

		hoursArray[i].addEventListener('click', function(e) {
			var timeIndex = this.timeIndex;
			Ti.API.info('new timeIndex: '+timeIndex);
	
			if(timeIndex === undefined) {	
				Ti.API.info('timeIndexUndefined..causing undefined text');
				textOfShowNow.text = 'set to current time.00';
				showNow.left = hour*50-22; //calculate where showNow.left should be
			}
			
			if(timeIndex == 23) showNow.left = timeIndex*50-5;
			else showNow.left = timeIndex*50-22;
			if(timeIndex >9){
				textOfShowNow.text = timeIndex+'.00';
			}
			else{
				textOfShowNow.text = '0'+timeIndex+'.00';
			}
			textOfShowNow.left = 12+timeIndex*50;
			
			Ti.App.fireEvent('updatePopularProgramAtTime',{timeIndex:timeIndex});
		});
		selectionView.add(hoursArray[i]);
		
	}

	self.add(selectionView);
	return self;
}
module.exports = PopularWindowSrcollviewTimeSelection;
