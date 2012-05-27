CommentHeaderTableViewRow = function() {
	var headerTableData = [];
	
	var headerMainRow = Ti.UI.createTableViewRow({
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		backgroundColor: 'pink'
	})

	//tableview inside tableviewrow	
	var headerTable = Ti.UI.createTableView({
		top: 5,
		height: 'auto',
	})
	
//	COMMENT TOPIC SECTION
	var topicRow = Ti.UI.createTableViewRow({
		height: 'auto',
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		className: "DetailedTopicTableViewRow",
		backgroundColor: 'orange'
	});
		
	var topicLabel = Ti.UI.createLabel({
		text: '-',
		width: 'auto',
		height: 'auto',
		font: { fontSize: 20, fontFamily: 'Helvetica Neue' },
	})
		
// DATE SUBMISSION SECTION
	var dateRow = Ti.UI.createTableViewRow({
		height: 20,
		backgroundColor: 'green'
	});
	
	var dateLabel = Ti.UI.createLabel({
		text: '--',
		height: 20,
		width: 'auto',
		font: { fontSize: 10, fontFamily: 'Helvetica Neue' },
	});
	
// ADD NEW COMMENT SECTION
	var textAreaRow = Ti.UI.createTableViewRow();
	
	var replyButton = Titanium.UI.createButton({
	    title : 'Reply',
	    style : Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	
	var cancelButton = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
	});
	
	var replyTextArea = Ti.UI.createTextArea({
		width: '100%',
		height: 50,
		value: "Write your comment here...",
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
		keyboardToolbar : [cancelButton, replyButton], //this is iOS only
	    backgroundColor: 'gray'
	});
	
		
	cancelButton.addEventListener('click', function(e) {
		replyTextArea.blur();
	});

	//add table to the main row
	headerMainRow.add(headerTable);
	
	//set up label in the 3 rows
	topicRow.add(topicLabel);
	dateRow.add(dateLabel);
	textAreaRow.add(replyTextArea);
	
	//setup data for the headerTable
	headerTableData.push(topicRow);
	headerTableData.push(dateRow);
	headerTableData.push(textAreaRow);
	
	headerTable.setData(headerTableData);
	
	//class methods -- for some reason, has to have underscore '_' prefix
	headerMainRow._getReplyTextAreaContent = function() {
		return replyTextArea.value;
	};
	
	headerMainRow._getReplyTextArea = function() {
		return replyTextArea;
	};
	
	headerMainRow._getReplyButton = function() {
		return replyButton;
	};
	
	headerMainRow._setTitle = function(_title) {
		topicLabel.text = _title;
		var topicWidth = topicRow.toImage().width; 
		var topicHeight = topicRow.toImage().height; 
		
		var numLines = Math.ceil(topicWidth / ONE_LINE_LENGTH); 
		headerMainRow.height = numLines * topicHeight + dateRow.toImage().height + textAreaRow.toImage().height + 5;
	};
	
	headerMainRow._setSubmissionTime = function(_submissionTime) {
		dateLabel.text = _submissionTime;
	};
	
	headerMainRow._setReplyTextArea = function(_reply) {
		replyTextArea.value = _reply;
	};
	
	headerMainRow._blurReplyTextArea = function() {
		return replyTextArea.blur();
	};
	
	return headerMainRow;
}

module.exports = CommentHeaderTableViewRow;
