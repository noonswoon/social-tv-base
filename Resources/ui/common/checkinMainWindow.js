Checkin = function (_datafromrow){
	
	var self = Ti.UI.createWindow({
		title: 'Selected Program',
		backgroundColor: 'orange'
	});
	
	var headerView = Ti.UI.createView({
		top: 0,
		height: 100,
		backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]
    	} 
	});
	self.add(headerView);

////////////////////////////////Header detail
	var programTitle = Ti.UI.createLabel({
		text: _datafromrow.programTitle,
		textAlign: 'left',
		left: 150,
		font:{fontWeight:'bold',fontSize:18},
		top: 10
	});
	headerView.add(programTitle);
	
	var programSubname = Ti.UI.createLabel({
		text: _datafromrow.programSubname,
		color: '#420404',
		textAlign:'left',
		left: 150,
		font:{fontWeight:'bold',fontSize:13},
		top: 30
	});
	headerView.add(programSubname);
	
	var programImage = Ti.UI.createImageView({
		image: _datafromrow.programImage,
		top: 5,
		left: 10,
		bottom: 5,
		width:125,
		height:89
	});
	headerView.add(programImage);
	
	var programChannel = Ti.UI.createImageView({
		image: _datafromrow.programChannel,
		bottom: 5,
		left: 270,
		width: 35,
		height: 15
	});
	headerView.add(programChannel);
	
///////////////////////////////////////////////////Checkin Section

	var checkinView = Ti.UI.createView({
		backgroundImage: 'images/bgcheckin.png',
		top: 100
	});
	self.add(checkinView);
	
	var checkinButton = Ti.UI.createButton({
		title: 'Check-in',
		width: 180,
		height: 40,
		top: 110
	});
	self.add(checkinButton);
	
	checkinButton.addEventListener('click',function(){
		alert('Yeah! Check-in');
	});

	self.showNavBar();
	return self;
	
}
module.exports = Checkin;
