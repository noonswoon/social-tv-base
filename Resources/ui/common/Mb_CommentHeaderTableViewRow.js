CommentHeaderTableViewRow = function() {
	Ti.API.info('start setting up');
	var headerWrapper = Ti.UI.createTableViewRow({
		height: 180,
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	})

	var headerTableData = [];
	//tableview inside tableviewrow	
	headerWrapper.headerTable = Ti.UI.createTableView({
		height: 'auto',
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
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
		width: 'auto',
		height: 'auto',
		font: { fontSize: 20, fontFamily: 'Helvetica Neue' },
	})
	headerWrapper.headerTable.topicRow.add(headerWrapper.headerTable.topicRow.topicLabel);
	headerTableData.push(headerWrapper.headerTable.topicRow);
		
// DATE SUBMISSION SECTION
	headerWrapper.headerTable.dateRow = Ti.UI.createTableViewRow({
		height: 20
	});
	
	headerWrapper.headerTable.dateRow.dateLabel = Ti.UI.createLabel({
		text: '--',
		height: 20,
		width: 'auto',
		font: { fontSize: 10, fontFamily: 'Helvetica Neue' },
	});
	headerWrapper.headerTable.dateRow.add(headerWrapper.headerTable.dateRow.dateLabel);
	headerTableData.push(headerWrapper.headerTable.dateRow);
	
// ADD NEW COMMENT SECTION
	headerWrapper.headerTable.textFieldRow = Ti.UI.createTableViewRow({
		height: 35
	});
	
	var replyButton = Titanium.UI.createButton({
	    title : 'Reply',
	    style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});
	
	var cancelButton = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
	});
	
	headerWrapper.headerTable.textFieldRow.replyTextField = Ti.UI.createTextArea({
		width: '100%',
		height: 65,
		hintText: "Write your comment here...",
		borderRadius : 5,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
		keyboardToolbar : [cancelButton, replyButton], //this is iOS only
	});

	headerWrapper.headerTable.textFieldRow.add(headerWrapper.headerTable.textFieldRow.replyTextField);
	headerWrapper.headerTable.textFieldRow.replyButton = replyButton;
	headerWrapper.headerTable.textFieldRow.cancelButton = cancelButton;
	headerTableData.push(headerWrapper.headerTable.textFieldRow);
		
	cancelButton.addEventListener('click', function(e) {
		headerWrapper.headerTable.textFieldRow.replyTextField.blur();
	});
	headerWrapper.headerTable.setData(headerTableData);
	
	return headerWrapper;
}

module.exports = CommentHeaderTableViewRow;
