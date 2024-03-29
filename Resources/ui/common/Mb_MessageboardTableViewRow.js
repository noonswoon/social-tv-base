MessageboardTableViewRow = function(_topic) {
	//UI STUFF
	var row = Ti.UI.createTableViewRow({
		top:0,
		height:50,
		backgroundColor: '#eeeeee',
		allowsSelection: true,
		className: "TopicRow"
	});
	
	row.topicLabel = Ti.UI.createLabel({
		text: _topic.title,
		top:5,
		textAlign: 'left',
		left: 50,
		right: 65,
		height: '37',
		font: { fontSize: 16, fontFamily: 'Helvetica Neue' }
	})
	
	row.numComments = Ti.UI.createLabel({
		text: _topic.commentsCount,
		top:16,
		color: 'white',
		right: 14,
		font:{fontWeight:'bold',fontSize:14},
		shadowColor:'#666666',
		shadowOffset:{x:1,y:1},
		zIndex: 2
	});
	
	row.numBackgroundComments = Ti.UI.createImageView({
		image: 'images/messageboard/replynumberBG.png',
		top: 10,
		right: 10
	});
	
	if(_topic.photo !== null && _topic.photo !== undefined){
		row.leftImage = 'images/messageboard/cameraIcon.png';
	}
	else row.leftImage = 'images/messageboard/messageboardIcon.png';
	
	if(_topic.commentsCount>9){
		row.numComments.right = 10;
	}
	else if(_topic.commentsCount>99){
		row.numComments.right = 6;
	}
	
	Ti.App.addEventListener('updateCommentNumCount'+_topic.acsObjectId, function(e){
		row.numComments.text = e.totalCommentNumCount;
	});

	//ADDING UI COMPONENTS
	row.add(row.topicLabel);
	row.add(row.numComments);
	row.add(row.numBackgroundComments);
	
	//MISCELLENEOUS
	row.topic = _topic;
	row.filter = _topic.title;
	
	return row;
}

module.exports = MessageboardTableViewRow;

