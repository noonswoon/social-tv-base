CommentHeaderTableViewRow = function() {
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
		font: { fontSize: 20, fontFamily: 'Helvetica Neue' },
		height: 20,
		width: 310
	})
	
	header.dateLabel = Ti.UI.createLabel({
		text: '--',
		top: 30,
		left: 10,
		width: 'auto',
		height: 20,
		font: { fontSize: 10, fontFamily: 'Helvetica Neue' },
		height: 10,
		width: 310
	})
	
	header.replyButton = Titanium.UI.createButton({
	    title : 'Reply',
	    style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});
	
	header.cancelButton = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
	});
	
	header.replyTextField = Ti.UI.createTextField({
		left: 5,
		top: 55,
		width: 310,
		height: 30,
		hintText: "Write your comment here...",
    	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
		keyboardToolbar : [header.cancelButton, header.replyButton], //this is iOS only
	})
	
	header.add(header.topicLabel);
	header.add(header.dateLabel);
	header.add(header.replyTextField);	
	
	header.cancelButton.addEventListener('click', function(e) {
		header.replyTextField.blur();
	});

	
	return header;
}

module.exports = CommentHeaderTableViewRow;
