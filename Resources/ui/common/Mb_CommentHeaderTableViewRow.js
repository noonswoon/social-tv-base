CommentHeaderTableViewRow = function(_topicId) {
	var Topic = require('model/topic');
	var topic = Topic.topicModel_getTopicById(_topicId);
	
	var headerTableData = [];
	
	var headerMainRow = Ti.UI.createTableViewRow({
	 	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		backgroundColor: 'transparent'
	});

	//tableview inside tableviewrow	
	var headerTable = Ti.UI.createTableView({
		top: 0,
		scrollable: false,
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		separatorColor: 'transparent',
		backgroundColor: 'transparent'
	});

	// COMMENT TOPIC SECTION
	// DATE SUBMISSION SECTION
	var topicRow = Ti.UI.createTableViewRow({
		height: 80,
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		className: "DetailedTopicTableViewRow",
		backgroundImage: 'images/messageboard/comment/topictitletoolbar.png',
	});
	
	var messageboardIcon = Ti.UI.createImageView({
		top: 15,
		left: 10,
		width: 30,
		height: 30
	});
	topicRow.add(messageboardIcon);
		
	var topicTitle = Ti.UI.createLabel({
		text: '-',
		textAlign: 'left',
		left: 50,
		right: 10,
		top: 5,
		bottom: 20, 
		// width: 'auto',
		// height: 'auto',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: 'bold'},
	})
	
	var dateLabel = Ti.UI.createLabel({
		text: '--',
		bottom: 5,
		left: 50,
		font: { fontSize: 10, fontFamily: 'Helvetica Neue' },
	});
	
	//ADD PHOTO SECTION
	var photoView = Ti.UI.createTableViewRow({
		top: 10,
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		height: 200,
		backgroundColor: 'transparent'
	});
	
	var photoOfTopic = Ti.UI.createImageView({
		image: topic.photo,
		top: 10,
		left: 10,
		right: 10,
		width: 300,
		height: 200
	});
	
	//ADD CONTENT SECTION
	var contentView = Ti.UI.createTableViewRow({
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	}); 
	
	var content = Ti.UI.createLabel({
		text: topic.content,
		top: 10,
		left: 10,
		right: 10,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});
	
	var contentWidth = content.toImage().width; 
	var contentHeight = content.toImage().height; 
	var numLines = Math.ceil(contentWidth / ONE_LINE_LENGTH); 
	var commentTopIndent = numLines * contentHeight;

	// ADD NEW COMMENT SECTION
	var textAreaRow = Ti.UI.createTableViewRow({
		top: commentTopIndent,
		height: 70,
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		backgroundColor: 'transparent'
	});
	
	//text.length = 42 is one line
	
	var lengthOfText = content.text.length;
	var line = Math.ceil(lengthOfText/40);

	var heightOfContent = null; 
	
	alert(line);
	

	if(topic.photo !== null){
		messageboardIcon.image = 'images/messageboard/cameraIcon.png';
		if(line <= 12){
			heightOfContent = CONTENT_LENGTH + (line*10) + 30 + 200;
		}
		else if(line <= 24){
			heightOfContent = CONTENT_LENGTH + (line*11) + 35 + 200;
		}
		else heightOfContent = CONTENT_LENGTH + (line*12) + 40 + 200;
	}
	else{
		messageboardIcon.image = 'images/messageboard/messageboardIcon.png';
		if(line <= 12){
			heightOfContent = CONTENT_LENGTH + (line*10) + 20;
		}
		else if(line <= 24){
			heightOfContent = CONTENT_LENGTH + (line*11) + 25;
		}
		else heightOfContent = CONTENT_LENGTH + (line*12) + 30;	
	}

	headerTable.height = heightOfContent;
	
	var replyButton = Titanium.UI.createButton({
	    title : 'Reply',
	    style : Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	
	var cancelButton = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
	});
	
	var spacer =  Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var replyTextArea = Ti.UI.createTextArea({
		top:8,
		left: 10,
		right: 10,
		width: 300,
		height: 50,
		value: "Write your comment here...",
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
		keyboardToolbar : [cancelButton, spacer, replyButton], //this is iOS only
    	backgroundColor: 'transparent',
    	backgroundImage: 'images/messageboard/comment/replytopictextareaBG.png'
	});	
	
	cancelButton.addEventListener('click', function(e) {
		replyTextArea.blur();
	});

	//add table to the main row
	headerMainRow.add(headerTable);
	
	//set up label in the 3 rows
	topicRow.add(topicTitle);
	topicRow.add(dateLabel);
	textAreaRow.add(replyTextArea);
	contentView.add(content);
	
	//setup data for the headerTable
	headerTableData.push(topicRow);
	
	if(topic.photo !== null){
		photoView.add(photoOfTopic);	
		headerTableData.push(photoView);
	}

	headerTableData.push(contentView);
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
		return topicTitle.text;
	};
	
	headerMainRow._setTitle = function(_title) {
		topicTitle.text = _title;
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
