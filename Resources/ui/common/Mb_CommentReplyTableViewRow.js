CommentReplyTableViewRow = function(_comment, _level) {
	//HEADER
	var Comment = require('model/comment');
	var CommentACS = require('acs/commentACS');
	var UserReportACS = require('acs/userReportACS');
	
	//var username = acs.getUserLoggedIn().username;
	var username = 'titaniummick'
		
	//UI Stuff
	var row = Ti.UI.createTableViewRow({
		height: 'auto',
		allowsSelection: false,
		className: "ReplyTableViewRow",
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	row.index = -1;
	
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
		left:nestedOffset,
		height: 15,
		width: 50
	});
	
	var userImage = Ti.UI.createImageView({
		image: "userImage.png",
		top: 5,
		left: nestedOffset + 15,
		width:55,
		height:40
	});
	
	var dm = moment(_comment.updatedAt, "YYYY-MM-DDTHH:mm:ss");
	var submitDateStr = since(dm);
	var usernameStr = _comment.username;
	if(_comment.username === username)
		usernameStr = 'you';
	
	var commentDetail = Ti.UI.createLabel({
		text: 'by '+usernameStr+', '+submitDateStr,
		color: '#420404',
		textAlign:'right',
		font:{fontWeight:'bold',fontSize:12},
		top: 0,
		left:nestedOffset+15,
		height: 15,
		width: 150
	});
		
	var lineHelper = "";
	for(var i=0;i<_level;i++) {
		lineHelper += "  |  ";	
	}
	var contentLabel = Ti.UI.createLabel({
		text:  _comment.content,
		top: 15,
		left: nestedOffset+ 75,
		height: 'auto',
		font: { fontSize: 15, fontFamily: 'Helvetica Neue' },
		width: 250
	});

	var replyToolbar = Ti.UI.createView({
		left: 0,
		top: 55,
		width: '100%',
		height: 60,
		visible: true
	});

	var replyTextField = Ti.UI.createTextField({
		left: 5,
		top: 0,
		width: 310,
		height: 20,
		hintText: "Reply here...",
    	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});

	var upButton = Ti.UI.createButton({
		left:5,
		top: 25,
		width: 35,
		height: 20,
		title: 'Up',
		font: { fontSize: 12, fontFamily: 'Helvetica Neue' }
	});

	var downButton = Ti.UI.createButton({
		left:45,
		top: 25,
		width: 35,
		height: 20,
		title: 'Down',
		font: { fontSize: 12, fontFamily: 'Helvetica Neue' }
	});
	
	var reportButton = Ti.UI.createButton({
		left:85,
		top: 25,
		width: 45,
		height: 20,
		title: 'Report',
		font: { fontSize: 12, fontFamily: 'Helvetica Neue' }
	});
	
	var deleteButton = Ti.UI.createButton({
		left:85,
		top: 25,
		width: 45,
		height: 20,
		title: 'Delete',
		font: { fontSize: 12, fontFamily: 'Helvetica Neue' }
	});

	var replyButton = Ti.UI.createButton({
		right: 5,
		top: 25,
		width: 50,
		height: 20,
		title: 'Reply',
		font: { fontSize: 12, fontFamily: 'Helvetica Neue' }
	});
		
	//ADDING UI COMPONENTS	

	row.add(ratingLabel);
	row.add(userImage);
	row.add(commentDetail);		
	row.add(contentLabel);
	
	//row.add(replyToolbar);
	
	replyToolbar.add(replyTextField);
	replyToolbar.add(upButton);
	replyToolbar.add(downButton);
	
	//either show reportButton or deleteButton (comment's owner)
	if(_comment.username === username)
		replyToolbar.add(deleteButton);
	else replyToolbar.add(reportButton);
	
	replyToolbar.add(replyButton);
	
	// CLASS METHODS GET&SET
	row._hideToolbar = function(rowIndex) {
		row.index = rowIndex;
		row.remove(replyToolbar);
	};
	
	row._showToolbar = function(rowIndex) {
		row.index = rowIndex;		
		row.add(replyToolbar);
	};
		
	replyButton.addEventListener('click',function(e) {
		//insert to db-->update UI-->then call acs to save data -->get callback then update the acs_object_id field
		var responseText = replyTextField.value;
		var newId = Comment.commentModel_addCommentOrRating(_comment.topicId,responseText,0,username,_comment.acsObjectId,0); 
		
		//add tableviewrow to the table manually, rather than calling reset
		var commentDetailForNewTableViewRow = {
			title: responseText,
			commentLevel: _level+1,
			rowIndex: row.index,  //will insert the new comment after the rowIndex row
			id: newId,
			acsObjectId: 0, //need to be later updated
			topicId: _comment.topicId,
			content: responseText,
			rating: 0,
			username: username,
			responseToObjectId: _comment.acsObjectId,
			isAVote: 0,
			updatedAt: moment().format("YYYY-MM-DDTHH:mm:ss")
		}
		
		//eventlistener of insertingCommentTableViewRow is in Mb_CommentWindow file, it will insert the tableviewrow
		Ti.App.fireEvent('insertingCommentTableViewRow',{commentDetailForNewTableViewRow: commentDetailForNewTableViewRow});
		
		
		//The fn fires a commentOfCommentCreatedACS event when done,
		// the listener for the event is in Mb_CommentWindow.js file...add newId param
		var rowIndexToUpdateACSObjectId = row.index+1; //currently the new inserted row will have acsObjectId = 0
		var commentLevel = _level+1;
		CommentACS.commentACS_createCommentOfComment(responseText,newId,_comment.acsObjectId,_comment.topicId,rowIndexToUpdateACSObjectId,commentLevel);
		
		//clear the UI, clear replyTextField value, hide the toolbar
		replyTextField.value = "";
		row._hideToolbar(row.index);
	});
	
	function handleVote(_isUpVote) {
		var ratingOffset = -1;
		if(_isUpVote) ratingOffset = 1;
		
		//need to check if alreaady voted
		if(Comment.commentModel_canUserVote(_comment.acsObjectId,username)) {		
			//updating the rating manually rather than calling setData for the entire table
			var ratingStr = '';
			rating = rating + ratingOffset;
			if(rating > 0) {
				ratingStr = '+'+rating;
			} else if(rating < 0) {
				ratingStr = rating;
			}
			ratingLabel.text = ratingStr;
			
			//The fn fires a voteOfCommentCreatedACS event when done,
			// the listener for the event is in Mb_CommentWindow.js file		
			var newId = Comment.commentModel_addCommentOrRating(_comment.topicId,'m',ratingOffset,username,_comment.acsObjectId,1); 
			CommentACS.commentACS_createVoteOfComment(ratingOffset,newId,_comment.acsObjectId,_comment.topicId);
			
			//clear the UI, clear replyTextField value, hide the toolbar
			replyTextField.value = "";
			row._hideToolbar(row.index);
		} else {
			alert("Sorry you already voted on this comment");	
		}
	}
	
	function handleUpVote() { handleVote(true); }
	
	function handleDownVote() { handleVote(false); }
	
	upButton.addEventListener('click', handleUpVote);
	downButton.addEventListener('click', handleDownVote);
	
	reportButton.addEventListener('click', function() {
		UserReportACS.userReportACS_reportObject(_comment.id,'comment',_comment.content);
	});
	
	deleteButton.addEventListener('click', function() {
		//fire the event & have commentWindow remove that row from the table
		Ti.App.fireEvent('deletingCommentTableViewRow',{rowIndexToDelete:row.index});		
		
		//update comments table to set the is_deleted column of commentId to 1
		Comment.commentModel_deleteComment(_comment.acsObjectId);
		
		//send update ACS query to Reviews to update the custom_fields.is_deleted to 1
		if(_level == 0)
			CommentACS.commentACS_deleteComment(_comment.responseToObjectId,_comment.acsObjectId);
		else CommentACS.commentACS_deleteCommentOfComment(_comment.responseToObjectId,_comment.acsObjectId);
	});
	
	return row;
}
module.exports = CommentReplyTableViewRow;
