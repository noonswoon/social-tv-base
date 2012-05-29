Cs_PopularWindowTableViewRow = function(_curTVProgram){	
	var TVProgram = require('model/tvprogram');
	var row = Ti.UI.createTableViewRow({
		//height: 100,
		backgroundGradient: {
       		type: 'linear',
       		startPoint: { x: '0%', y: '0%' },
       		endPoint: { x: '0%', y: '100%' },
       		colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]
    	} 
	});
	
	var detailButton = Ti.UI.createButton({
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		top: 5,
		right: 5,
		height: 30,
		width: 30,
		borderRadius:15,
		image:'images/icon/detailButton.png'
	});
	row.add(detailButton);
	
	var programLabelName = Ti.UI.createLabel({
		text: _curTVProgram.name,
		textAlign: 'left',
		color: '#333',
		left: 145,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 5
	});
	row.add(programLabelName);
		
	var programLabelSubname = Ti.UI.createLabel({
		text: _curTVProgram.channel_id,
		color: '#333',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 33,
		left:145
	});
	row.add(programLabelSubname);

	var programImage = Ti.UI.createImageView({
		image: _curTVProgram.photo,
		width:125,
		height:90
	});
	var programImageView = Ti.UI.createView({
		width: 131,
		height: 96,
		borderColor: '#D1CBCD',
		borderWidth: 1,
		backgroundColor: '#fff',
		top: 10,
		left:5,
		bottom:10
	});
	programImageView.add(programImage);
	row.add(programImageView);
	
	var checkinView = Ti.UI.createView({
		width: 52,
		bottom:5,
		left: 150,
		height: 47
	});
	var programNumCheckinImage = Ti.UI.createImageView({
		image: 'images/icon/watch.png',
		opacity: 0.5,
		top: 0
	});
	var programNumCheckin = Ti.UI.createLabel({
		text: _curTVProgram.number_checkins,
		textAlign: 'left',
		color: '#898687',
		font: {fontSize: 14},
		bottom: 0
	});
	checkinView.add(programNumCheckin);
	checkinView.add(programNumCheckinImage);	
	row.add(checkinView);

	var friendView = Ti.UI.createView({
		width: 52,
		bottom:5,
		left: 202,
		height: 47
	});
	var programNumFriendImage = Ti.UI.createImageView({
		image: 'images/icon/friends.png',
		opacity: 0.5,
		top: 0
	});
	var programNumFriend = Ti.UI.createLabel({
		text: _curTVProgram.number_checkins,
		textAlign: 'left',
		color: '#898687',
		bottom: 0,
		font: {fontSize: 14},
	});
	friendView.add(programNumFriend);
	friendView.add(programNumFriendImage);	
	row.add(friendView);

	var channelView = Ti.UI.createView({
		width: 52,
		bottom:5,
		right: 10,
		height: 47,
	});
	var programChannelImage = Ti.UI.createImageView({
		image: 'images/icon/tvchannel.png',
		opacity: 0.5,
		top: 3
	});
	var programChannel = Ti.UI.createLabel({
		text: _curTVProgram.channel_id,
		textAlign: 'left',
		color: '#898687',
		height: 20,
		font: {fontSize: 14},
		bottom: 0
	});
	channelView.add(programChannel);
	channelView.add(programChannelImage);	
	row.add(channelView);

		row.tvprogram = _curTVProgram;
			
		Ti.App.addEventListener('updateNumCheckinAtDiscovery'+_curTVProgram.id,function(e){
			_curTVProgram.number_checkins = _curTVProgram.number_checkins + e.numCheckin;
			row.tvprogram = _curTVProgram;  //need to reset to make it update the row.tvprogram
			programNumCheckin.text = _curTVProgram.number_checkins;
		});	
		
		return row;
}
module.exports = Cs_PopularWindowTableViewRow;