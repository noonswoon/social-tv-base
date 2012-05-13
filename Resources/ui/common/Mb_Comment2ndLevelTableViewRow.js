Comment2ndLevelTableViewRow = function(_comment) {
	//HEADER
	var CommentACS = require('acs/commentACS');
	
	//UI Stuff
	var row = Ti.UI.createTableViewRow({
		height: 30,
		allowsSelection: false,
		className: "2ndLevelTableViewRow",
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	var contentLabel = Ti.UI.createLabel({
		text: '|  '+_comment.content,
		top: 5,
		left: 10,
		width: 310,
		height: 30,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	})
	
	var actionToolbar = Ti.UI.createView({
		left: 5,
		top: 35,
		width: 310,
		height: 60,
		visible: false
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
		
	//ADDING UI COMPONENTS			
	row.add(contentLabel);
	row.add(actionToolbar);
	actionToolbar.add(upButton);
	actionToolbar.add(downButton);
	
	// CLASS METHODS GET&SET
	row._hideToolbar = function() {
		if (actionToolbar.visible == false) return;
		actionToolbar.visible = false;
		row.height -= actionToolbar.height;
	};
	
	row._showToolbar = function() {
		if (actionToolbar.visible == true) return;
		actionToolbar.visible = true;
		row.height += actionToolbar.height;
	};
	
	upButton.addEventListener('click', function() {
		Ti.API.info("upvote: "+_comment.id);
		//The fn fires a voteOfCommentCreatedACS event when done,
		// the listener for the event is in Mb_CommentWindow.js file
		CommentACS.commentACS_createVoteOfComment(1,_comment.id,_comment.topic_id);
	});
	
	downButton.addEventListener('click', function() {
		//The fn fires a voteOfCommentCreatedACS event when done,
		// the listener for the event is in Mb_CommentWindow.js file
		Ti.API.info("downvote: "+_comment.id);
		CommentACS.commentACS_createVoteOfComment(-1,_comment.id,_comment.topic_id);
	});
	
	return row;
}
module.exports = Comment2ndLevelTableViewRow;
