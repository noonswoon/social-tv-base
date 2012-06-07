var PopularWindowSrcollviewTimeSelection = function(){

	var self = Ti.UI.createView({
		backgroundColor: '#fff'
	});

	var selectionView = Ti.UI.createScrollView({
	contentWidth:1215,
	contentHeight:34,
	top:0,
	height:34,
	width:Ti.UI.SIZE,
	backgroundImage: 'images/popular/ScrollViewBG.png',
	disableBounce: true
	});
	

	
////////////////////////////////////////SCROLLVIEW ACCORDING WITH TIME
	var now = moment().format('HH');
	var b = ((now-3)*45)+24;
	selectionView.scrollTo(b,0);
	Ti.API.info(b);
	
	var showNow = Ti.UI.createImageView({
		image: 'images/shownow.png',
		left: now*50-22
	});
	selectionView.add(showNow);
	
	var textOfShowNow = Ti.UI.createLabel({
		text: now+'.00',
		left: 12+now*50,
		color: 'white',
		font:{fontSize:14,fontWeight:'bold'},
		textAlign:'center',
		zIndex: 1
	});
	selectionView.add(textOfShowNow);
		

//////////////////////////////////////////////////////////////////////
	var PopularTimeSelectionView = require('ui/common/Cs_PopularTimeSelectionView');
	var hoursArray = [];
	for(var i=0;i<24;i++){
		
		hoursArray[i] = new PopularTimeSelectionView(i);

		hoursArray[i].addEventListener('click', function(e) {
			var timeIndex = e.source.timeIndex;
			if(timeIndex == 23) showNow.left = timeIndex*50-5;
			else showNow.left = timeIndex*50-22;
			Ti.API.info('new left: '+(timeIndex*50-22));
			Ti.API.info('if do +: '+(timeIndex*50+22));
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
