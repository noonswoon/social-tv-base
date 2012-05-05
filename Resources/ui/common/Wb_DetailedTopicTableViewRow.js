DetailedTopicTableViewRow = function() {
	var header = Ti.UI.createTableViewRow({
		height: 90,
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		className: "DetailedTopicTableViewRow"
	});
	
	header.topicLabel = Ti.UI.createLabel({
		text: '-',
		top: 5,
		left: 5,
		width: 'auto',
		height: 30,
		font: { fontSize: 20, fontFamily: 'Helvetica Neue' }
	})
	header.add(header.topicLabel);
	
	header.dateLabel = Ti.UI.createLabel({
		text: '--',
		top: 30,
		left: 10,
		width: 'auto',
		height: 20,
		font: { fontSize: 10, fontFamily: 'Helvetica Neue' }
	})
	header.add(header.dateLabel);
	
		
	header.replyTextField = Ti.UI.createTextField({
		left: 5,
		top: 55,
		width: 310,
		height: 30,
		hintText: "Reply here...",
    	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	})
	header.add(header.replyTextField);
	
	return header;
}

module.exports = DetailedTopicTableViewRow;
