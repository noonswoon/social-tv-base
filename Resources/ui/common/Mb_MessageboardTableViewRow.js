MessageboardTableViewRow = function(_topic) {
	//UI STUFF
	var row = Ti.UI.createTableViewRow({
		top:0,
		height:'auto',
		backgroundColor: 'pink',
		allowsSelection: true,
		className: "TopicRow"
	});
	
	row.topicLabel = Ti.UI.createLabel({
		text: _topic.title,
		top:5,
		left: 5,
		width: '260',
		height: 'auto',
		font: { fontSize: 16, fontFamily: 'Helvetica Neue' }
	})
	
	var replyStr = _topic.commentsCount <= 1? ' reply >':' replies >';
	row.numComments = Ti.UI.createLabel({
		text: _topic.commentsCount+ replyStr,
		color: 'black',
		textAlign:'right',
		left:215,
		width:100,
		top:2,
		font:{fontWeight:'bold',fontSize:13}
	});
	
	
	//ADDING UI COMPONENTS
	row.add(row.topicLabel);
	row.add(row.numComments);
	
	//MISCELLENEOUS
	row.topic = _topic;
	row.filter = _topic.title;
	
	return row;
}

module.exports = MessageboardTableViewRow;

