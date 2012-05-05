TopicTableViewRow = function() {
	var row = Ti.UI.createTableViewRow({
		height: 40,
		allowsSelection: true,
		className: "TopicTableViewRow"
	});
	
	row.topicLabel = Ti.UI.createLabel({
		text: '-',
		top: 5,
		left: 5,
		width: 'auto',
		height: 30,
		font: { fontSize: 20, fontFamily: 'Helvetica Neue' }
	})
	row.add(row.topicLabel);
	
	row._setTopic = function(topic) {
		row.topicLabel.text = topic.title;
		row.topic = topic;
	};
	
	return row;
}

module.exports = TopicTableViewRow;
