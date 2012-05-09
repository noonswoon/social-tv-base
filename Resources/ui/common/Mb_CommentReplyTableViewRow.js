CommentReplyTableViewRow = function(_comment) {

	//UI Stuff
	var row = Ti.UI.createTableViewRow({
		height: 30,
		allowsSelection: false,
		className: "ReplyTableViewRow",
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	var contentLabel = Ti.UI.createLabel({
		text: _comment.content,
		top: 5,
		left: 5,
		width: 310,
		height: 30,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	})
	
	var replyToolbar = Ti.UI.createView({
		left: 5,
		top: 35,
		width: 310,
		height: 60,
		visible: false
	});

	var replyTextField = Ti.UI.createTextField({
		left: 0,
		top: 0,
		width: 310,
		height: 20,
		hintText: "Reply here...",
    	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});

	var upButton = Ti.UI.createButton({
		left: 0,
		top: 25,
		width: 70,
		height: 20,
		title: 'Vote Up',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});

	var downButton = Ti.UI.createButton({
		left: 80,
		top: 25,
		width: 70,
		height: 20,
		title: 'Vote Down',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});

	var replyButton = Ti.UI.createButton({
		right: 0,
		top: 25,
		width: 70,
		height: 20,
		title: 'Reply',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});
		
	//ADDING UI COMPONENTS			
	row.add(contentLabel);
	row.add(replyToolbar);
	replyToolbar.add(replyTextField);
	replyToolbar.add(upButton);
	replyToolbar.add(downButton);
	replyToolbar.add(replyButton);
	
	// CLASS METHODS GET&SET
	row._hideToolbar = function() {
		if (replyToolbar.visible == false) return;
		replyToolbar.visible = false;
		row.height -= replyToolbar.height;
	};
	
	row._showToolbar = function() {
		if (replyToolbar.visible == true) return;
		replyToolbar.visible = true;
		
		row.height += replyToolbar.height;
	};
	
	//ADD EVENTLISTNERS FOR REPLY VOTE UP/DOWN FOR THIS COMMENTS
	replyButton.addEventListener('click',function() {
		alert("submitting reply to this comment: "+_comment.id+", content: "+replyTextField.value);
	});
	
	upButton.addEventListener('click', function() {
		alert("upvote: "+_comment.id);
	});
	
	downButton.addEventListener('click', function() {
		alert("downvote: "+_comment.id);
	});
	
	return row;
}
module.exports = CommentReplyTableViewRow;
