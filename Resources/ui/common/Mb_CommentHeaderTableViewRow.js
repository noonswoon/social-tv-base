CommentHeaderTableViewRow = function() {
	var headerTableData = [];
	
	var headerMainRow = Ti.UI.createTableViewRow({
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		backgroundColor: 'transparent'
	});

	//tableview inside tableviewrow	
	var headerTable = Ti.UI.createTableView({
		top: 0,
		height: 125,
		backgroundColor: 'transparent'
	});
	
//	COMMENT TOPIC SECTION
// DATE SUBMISSION SECTION
	var topicRow = Ti.UI.createTableViewRow({
		height: 52,
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		className: "DetailedTopicTableViewRow",
		backgroundImage: 'images/messageboard/comment/topictitletoolbar.png',
	});
		
	var topicLabel = Ti.UI.createLabel({
		text: '-',
		textAlign: 'left',
		left: 50,
		top: 7,
		width: 260,
		height: 20,
		font: { fontSize: 16, fontFamily: 'Helvetica Neue', fontWeight: 'bold'},
	})
	
	var dateLabel = Ti.UI.createLabel({
		text: '--',
		top: 23,
		left: 50,
		height: 20,
		width: 'auto',
		font: { fontSize: 10, fontFamily: 'Helvetica Neue' },
	});
	
// ADD NEW COMMENT SECTION
	var textAreaRow = Ti.UI.createTableViewRow({
		top:52,
		height: 73,
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	var replyButton = Titanium.UI.createButton({
	    title : 'Reply',
	    style : Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	
	var cancelButton = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
	});
	
	var replyTextArea = Ti.UI.createTextArea({
		top:8,
		left: 10,
		right: 10,
		width: 300,
		height: 53,
		value: "Write your comment here...",
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
		keyboardToolbar : [cancelButton, replyButton], //this is iOS only
    	backgroundColor: 'transparent',
    	backgroundImage: 'images/messageboard/comment/replytopictextareaBG.png'
	});
	
		
	cancelButton.addEventListener('click', function(e) {
		replyTextArea.blur();
	});

	//add table to the main row
	headerMainRow.add(headerTable);
	
	//set up label in the 3 rows
	topicRow.add(topicLabel);
	topicRow.add(dateLabel);
	textAreaRow.add(replyTextArea);
	
	//setup data for the headerTable
	headerTableData.push(topicRow);
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
	
	headerMainRow._getTitle = function() {
		return topicLabel.text;
	};
	
	headerMainRow._setTitle = function(_title) {
		topicLabel.text = _title;
		var topicWidth = topicRow.toImage().width; 
		var topicHeight = topicRow.toImage().height; 
		
		var numLines = Math.ceil(topicWidth / ONE_LINE_LENGTH); 
		headerMainRow.height = numLines * topicHeight + textAreaRow.toImage().height + 5;
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
