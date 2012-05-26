CommentHeaderTableViewRow = function() {
	Ti.API.info('start setting up');
	var headerWrapper = Ti.UI.createTableViewRow({
		height: 'auto',
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		backgroundColor: 'yellow'
	})

	var headerTableData = [];
	
	headerWrapper.headerTable = Ti.UI.createTableView({
		height: 'auto',
		backgroundColor: 'green'
	})
	headerWrapper.add(headerWrapper.headerTable);
	
//	COMMENT TOPIC SECTION
	headerWrapper.headerTable.topicRow = Ti.UI.createTableViewRow({
		height: 'auto',
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		className: "DetailedTopicTableViewRow",
		backgroundColor: 'pink'
	});
		
	headerWrapper.headerTable.topicRow.topicLabel = Ti.UI.createLabel({
		text: '-',
		top: 5,
		left: 5,
		width: 'auto',
		height: 'auto',
		font: { fontSize: 20, fontFamily: 'Helvetica Neue' },
	})
	headerWrapper.headerTable.topicRow.add(headerWrapper.headerTable.topicRow.topicLabel);
	headerTableData.push(headerWrapper.headerTable.topicRow);
		
// DATE SUBMISSION SECTION
	headerWrapper.headerTable.dateRow = Ti.UI.createTableViewRow({
		height: 'auto'
	});
	
	headerWrapper.headerTable.dateRow.dateLabel = Ti.UI.createLabel({
		text: '--',
		top: 30,
		left: 10,
		width: 'auto',
		font: { fontSize: 10, fontFamily: 'Helvetica Neue' },
		backgroundColor: 'orange'
	});
	headerWrapper.headerTable.dateRow.add(headerWrapper.headerTable.dateRow.dateLabel);
	headerTableData.push(headerWrapper.headerTable.dateRow);
	
// ADD NEW COMMENT SECTION
	headerWrapper.headerTable.textFieldRow = Ti.UI.createTableViewRow({
		height: 'auto'
	});
	
	var replyButton = Titanium.UI.createButton({
	    title : 'Reply',
	    style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});
	
	var cancelButton = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
	});
	
	headerWrapper.headerTable.textFieldRow.replyTextField = Ti.UI.createTextField({
		left: 5,
		top: 55,
		width: 310,
		height: 30,
		hintText: "Write your comment here...",
    	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
		keyboardToolbar : [cancelButton, replyButton], //this is iOS only
		backgroundColor: 'blue'
	});

	headerWrapper.headerTable.textFieldRow.add(headerWrapper.headerTable.textFieldRow.replyTextField);
	headerWrapper.headerTable.textFieldRow.replyButton = replyButton;
	headerWrapper.headerTable.textFieldRow.cancelButton = cancelButton;
	headerTableData.push(headerWrapper.headerTable.textFieldRow);
		
	cancelButton.addEventListener('click', function(e) {
		headerWrapper.headerTable.textFieldRow.replyTextField.blur();
	});
	headerWrapper.headerTable.setData(headerTableData);
	
	Ti.API.info('succeeed setting up');
	
	return headerWrapper;
}

module.exports = CommentHeaderTableViewRow;
