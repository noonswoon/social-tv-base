Ct_ChatTableViewRow = function(_curTVProgram){
	Ti.include('./pubnub-chat.js'); 
	var row = Ti.UI.createTableViewRow({
		height: 85,
	});
	
	row.backgroundGradient = { type: 'linear',
       		startPoint: { x: '0%', y: '0%' },
       		endPoint: { x: '0%', y: '100%' },
       		colors: [ { color: '#fff', offset: 0.0}, { color: '#D0D0D0', offset: 1.0 } ] };

	
	var detailButton = Ti.UI.createButton({
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		right: 10,
		height: 30,
		width: 30,
		borderRadius:15,
		image:'images/icon/detail_button.png'
	});
	row.add(detailButton);
	
	var programLabelName = Ti.UI.createLabel({
		text: _curTVProgram.event.name,
		textAlign: 'left',
		color: '#333',
		left: 120,
		height: 70,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
	});
	row.add(programLabelName);
	
	var programImage = Ti.UI.createImageView({
		image: _curTVProgram.event.photo.urls.medium_640,
		width:90,
		height:60
	});
	
	var programImageView = Ti.UI.createView({
		width: 103,
		height: 74,
		backgroundImage: 'images/ProgramImageBorder.png',
		left:10,
	});
	programImageView.add(programImage);
	row.add(programImageView);
//	row.tvprogram = _curTVProgram;
	
	alert(_curTVProgram.event.custom_fields.program_id);
	row.addEventListener('click', function(){
		var pubnub_chat_window = Ti.App.Chat({
		    "chat-room" : _curTVProgram.event.custom_fields.program_id,
		    "window"    : {backgroundColor:'transparent'},
		    "programId" : _curTVProgram.event.custom_fields.program_id
		});
	});
			
	return row;
}
module.exports = Ct_ChatTableViewRow;