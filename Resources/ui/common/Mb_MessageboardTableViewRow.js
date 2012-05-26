MessageboardTableViewRow = function(_topic) {
	//UI STUFF
	var row = Ti.UI.createTableViewRow({
		top:0,
		height:'auto',
		backgroundColor: 'pink',
		allowsSelection: true,
		className: "TopicTableViewRow"
	});
	
	row.topicLabel = Ti.UI.createLabel({
		text: _topic.title,
		top:5,
		left: 5,
		width: '260',
		height: 'auto',
		font: { fontSize: 16, fontFamily: 'Helvetica Neue' }
	})
	
	row.numComments = Ti.UI.createLabel({
		text: '9 replies >',
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

