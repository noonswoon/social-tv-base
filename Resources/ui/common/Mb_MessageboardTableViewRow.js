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
		width: 'auto',
		height: 'auto',
		font: { fontSize: 16, fontFamily: 'Helvetica Neue' }
	})
	
	//ADDING UI COMPONENTS
	row.add(row.topicLabel);
	
	//MISCELLENEOUS
	row.topic = _topic;
	row.filter = _topic.title;
	
	return row;
}

module.exports = MessageboardTableViewRow;

