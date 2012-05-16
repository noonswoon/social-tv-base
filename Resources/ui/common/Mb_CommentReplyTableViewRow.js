CommentReplyTableViewRow = function(_comment, _level) {
	//HEADER
	var Comment = require('model/comment');
	var CommentACS = require('acs/commentACS');
	
	//UI Stuff
	var row = Ti.UI.createTableViewRow({
		height: 55,
		allowsSelection: false,
		className: "ReplyTableViewRow",
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	var nestedOffset = _level * 10 + 5;
	var rating = _comment.rating;
	var ratingStr = '';
	if(rating > 0) {
		ratingStr = '+'+rating;
	} else if(rating < 0) {
		ratingStr = rating;
	}
	var ratingLabel = Ti.UI.createLabel({
		text: ratingStr,
		color: '#420404',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:12},
		top: 15,
		left:nestedOffset
	});
	
	var userImage = Ti.UI.createImageView({
		image: "userImage.png",
		top: 5,
		left: nestedOffset + 15,
		width:55,
		height:40
	});
	
	
	var dm = moment(_comment.updated_at, "YYYY-MM-DDTHH:mm:ss");
	var submitDateStr = since(dm);
		
	var commentDetail = Ti.UI.createLabel({
		text: 'by '+_comment.username+', '+submitDateStr,
		color: '#420404',
		textAlign:'right',
		font:{fontWeight:'bold',fontSize:12},
		top: 0,
		left:nestedOffset+75
	});
		
	var lineHelper = "";
	for(var i=0;i<_level;i++) {
		lineHelper += "  |  ";	
	}
	var contentLabel = Ti.UI.createLabel({
		text:  _comment.content,
		top: 15,
		left: nestedOffset+ 75,
		width: 310,
		height: 30,
		font: { fontSize: 15, fontFamily: 'Helvetica Neue' }
	});

	var replyToolbar = Ti.UI.createView({
		left: nestedOffset+ 5,
		top: 35,
		width: 310,
		height: 60,
		visible: false
	});

	var replyTextField = Ti.UI.createTextField({
		left: nestedOffset+0,
		top: 0,
		width: 310,
		height: 20,
		hintText: "Reply here...",
    	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});

	var upButton = Ti.UI.createButton({
		left:nestedOffset+ 0,
		top: 25,
		width: 70,
		height: 20,
		title: 'Vote Up',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});

	var downButton = Ti.UI.createButton({
		left:nestedOffset+ 80,
		top: 25,
		width: 70,
		height: 20,
		title: 'Vote Down',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});

	var replyButton = Ti.UI.createButton({
		right: nestedOffset+0,
		top: 25,
		width: 70,
		height: 20,
		title: 'Reply',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});
		
	//ADDING UI COMPONENTS	

	row.add(ratingLabel);
	row.add(userImage);
	row.add(commentDetail);		
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
		
	replyButton.addEventListener('click',function() {
		//The fn fires a commentOfCommentCreatedACS event when done,
		// the listener for the event is in Mb_CommentWindow.js file
		CommentACS.commentACS_createCommentOfComment(replyTextField.value,_comment.id,_comment.topic_id);
	});
	
	upButton.addEventListener('click', function() {
		//need to check if alreaady voted
		if(Comment.commentModel_canUserVote(_comment.id,acs.getUserLoggedIn().username)) {		
			Ti.API.info("upvote: "+_comment.id);
			//The fn fires a voteOfCommentCreatedACS event when done,
			// the listener for the event is in Mb_CommentWindow.js file		
			CommentACS.commentACS_createVoteOfComment(1,_comment.id,_comment.topic_id);
		} else {
			alert("Sorry you already voted on this comment");	
		}
	});
	
	downButton.addEventListener('click', function() {
		//need to check if alreaady voted
		if(Comment.commentModel_canUserVote(_comment.id,acs.getUserLoggedIn().username)) {		
			Ti.API.info("downvote: "+_comment.id);
			//The fn fires a voteOfCommentCreatedACS event when done,
			// the listener for the event is in Mb_CommentWindow.js file		
			CommentACS.commentACS_createVoteOfComment(-1,_comment.id,_comment.topic_id);
		} else {
			alert("Sorry you already voted on this comment");	
		}
	});
	
	return row;
}
module.exports = CommentReplyTableViewRow;
