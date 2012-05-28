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
		
	// var timeView00 =Ti.UI.createView({
		// backgroundColor:'#336699',
		// width:40,
		// height: 20,
		// left:10
	// });
	// var Label00 = Ti.UI.createLabel({
		// text: '00.00',
 		// font:{fontSize:13},
		// width:'auto',
		// textAlign:'center',
		// height:'auto'
	// });
// 
	// var timeView01 =Ti.UI.createView({
		// backgroundColor:'#336699',
		// width:40,
		// height: 20,
		// left:60
	// });
	// var Label01 = Ti.UI.createLabel({
		// text: '01.00',
		// font:{fontSize:13},
		// width:'auto',
		// textAlign:'center',
		// height:'auto'
	// });
// 	
	// var timeView02 =Ti.UI.createView({
		// backgroundColor:'#336699',
		// width:40,
		// height: 20,
		// left:110
	// });
	// var Label02 = Ti.UI.createLabel({
		// text: '02.00',
		// font:{fontSize:13},
		// width:'auto',
		// textAlign:'center',
		// height:'auto'
	// });
// 	
	// var timeView03 =Ti.UI.createView({
		// backgroundColor:'#336699',
		// width:40,
		// height: 20,
		// left:160
	// });
	// var Label03 = Ti.UI.createLabel({
		// text: '03.00',
		// font:{fontSize:13},
		// width:'auto',
		// textAlign:'center',
		// height:'auto'
	// });
// 	
	// var timeView04 =Ti.UI.createView({
		// backgroundColor:'#336699',
		// width:40,
		// height: 20,
		// left:210
	// });
	// var Label04 = Ti.UI.createLabel({
		// text: '04.00',
		// font:{fontSize:13},
		// width:'auto',
		// textAlign:'center',
		// height:'auto'
	// });
// 	
	
	var margin = 10;
	var time = '';
	for(var i=0;i<=24;i++){

		var timeView = Ti.UI.createView({
			backgroundColor:'#336699',
			width:40,
			height: 20,
			left:margin
		});
		margin = margin+50;
		
		if(i < 10)
			time = '0'+i
		else time = i.toString();
		
		var timeLabel = Ti.UI.createLabel({
			text: time+'.00',
			font:{fontSize:13},
			width:'auto',
			textAlign:'center',
			height:'auto'
		});	
		timeView.add(timeLabel);
		selectionView.add(timeView);
	}



	// selectionView.add(timeView00);
	// selectionView.add(timeView01);
	// selectionView.add(timeView02);
	// selectionView.add(timeView03);
	// selectionView.add(timeView04);
	// timeView00.add(Label00);
	// timeView01.add(Label01);
	// timeView02.add(Label02);
	// timeView03.add(Label03);
	// timeView03.add(Label04);

	self.add(selectionView);
//	self.add(selectionBubble);
	self.add(rightImage);
	self.add(leftImage);
	
return self;
}

module.exports = TimeSelectionView;
