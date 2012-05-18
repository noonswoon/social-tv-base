MessageboardTableViewRow = function(_topic) {
	//UI STUFF
	var row = Ti.UI.createTableViewRow({
		height: 40,
		allowsSelection: true,
		className: "TopicTableViewRow"
	});
	
	row.topicLabel = Ti.UI.createLabel({
		text: _topic.title,
		top: 5,
		left: 5,
		width: 'auto',
		height: 30,
		font: { fontSize: 20, fontFamily: 'Helvetica Neue' }
	})
	
	//ADDING UI COMPONENTS
	row.add(row.topicLabel);
	
	//MISCELLENEOUS
	row.topic = _topic;
	
	return row;
}

module.exports = MessageboardTableViewRow;

