CommentReplyTableViewRow = function(_comment, _level) {
	//HEADER
	var Topic = require('model/topic');
	var ActivityModel = require('model/activity');
	var Comment = require('model/comment');
	var CommentACS = require('acs/commentACS');
	var UserReportACS = require('acs/userReportACS');
	var ActivityACS = require('acs/activityACS');
	
	var userId = acs.getUserId();
	var username = acs.getUserLoggedIn().username;
	//var username = 'titaniummick'
		
	//UI Stuff
	var row = Ti.UI.createTableViewRow({
		top: 0,
		height: 'auto',
		allowsSelection: false,
		className: "CommentRow",
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		separatorColor: 'transparent',
		backgroundColor: 'blue'
		// zIndex: 10
	});

	row.index = -1;
	
	var nestedOffset = _level * 10 + 5;
	var rating = _comment.rating;
	var ratingStr = '';
	if(rating > 0) {
		ratingStr = ' +'+rating;
	} else if(rating < 0) {
		ratingStr = ' '+rating;
	}
	
	var ratingLabel = Ti.UI.createLabel({
		text: ratingStr,
		color: '#420404',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:12},
		top: 5,
		// left:nestedOffset,
		right:15,
		height: 20,
		width: 20,
		zIndex: 2
	});
	
	if(rating > 0) {
		ratingLabel.backgroundImage = 'images/messageboard/comment/goodratingBG.png';
	} else if(rating < 0) {
		ratingLabel.backgroundImage = 'images/messageboard/comment/badratingBG.png';
	}
	
	var borderUserImage = Ti.UI.createImageView({
		image: 'images/messageboard/comment/displayprofile.png',
		left: nestedOffset + 5,
		top: 5,
		bottom: 5,
		width:51,
		height:52,
		zIndex: 2
	});
	
	var userImage = Ti.UI.createImageView({
		image: 'images/messageboard/comment/user_dummy.png',
		top: 6,
		width:39,
		height:39
	});
	borderUserImage.add(userImage);
	
	var dm = moment(_comment.updatedAt, "YYYY-MM-DDTHH:mm:ss");
	var submitDateStr = since(dm);
	var usernameStr = _comment.username;
	if(_comment.username === username)
		usernameStr = 'you';
	
	var commentDetail = Ti.UI.createLabel({
		text: 'by '+usernameStr+', '+submitDateStr,
		color: '#999999',
		font:{fontWeight:'bold',fontSize:12},
		top: 5,
		left: nestedOffset+65,
		height: 15,
		zIndex: 2
	});
		
	var lineHelper = "";
	for(var i=0;i<_level;i++) {
		lineHelper += "  |  ";	
	}
	var contentLabel = Ti.UI.createLabel({
		text:  _comment.content,
		top: 20,
		left: nestedOffset+65,
		right: 10,
		height: 'auto',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
		textAlign: 'left',
		zIndex: 2
	});
	
	var commentTextLength = contentLabel.text.length;
	var numLinesForHighlightedComment = Math.ceil(commentTextLength / CHARACTER_PER_LINE);
	var heightOfContent = 65 + (numLinesForHighlightedComment-1)*15;

	var replyToolbar = Ti.UI.createView({
		left: 0,
		top: heightOfContent+5,
		width: '100%',
		height: 60,
		visible: true,
	});
	
	var replyTextField = Ti.UI.createTextField({
		top: 0,
		height: 28,
		hintText: "Reply here...",
		left: nestedOffset,
		right: 10,
    	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    	backgroundColor: 'transparent',
		backgroundImage: 'images/messageboard/comment/replyothertextareaBG.png',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});

	var upButton = Ti.UI.createButton({
		left: nestedOffset,
		top: 35,
		width: 50,
		height: 23,
		backgroundImage: 'images/messageboard/comment/up.png'
	});

	var downButton = Ti.UI.createButton({
		left: nestedOffset + 55,
		top: 35,
		width: 70,
		height: 23,
		backgroundImage: 'images/messageboard/comment/down.png'
	});
	
	var reportButton = Ti.UI.createButton({
		left: nestedOffset + 130,
		top: 35,
		width: 59,
		height: 18,
		backgroundImage: 'images/messageboard/comment/flag.png'
	});
	
	var deleteButton = Ti.UI.createButton({
		left: nestedOffset + 130,
		top: 35,
		width: 59,
		height: 18,
		backgroundImage: 'images/messageboard/comment/flag.png'
	});

	var replyButton = Ti.UI.createButton({
		right: 10,
		top: 35,
		width: 50,
		height: 23,
		backgroundImage: 'images/messageboard/comment/reply.png'
	});
	
	var commentView = Ti.UI.createView({
		top:0,
		left: nestedOffset,
		right: 10,
		height: heightOfContent,
		// backgroundColor: 'orange',
		backgroundImage: 'images/messageboard/comment/reply_onclick.png',
		zIndex: 1
	});
		
	//ADDING UI COMPONENTS	

	row.add(ratingLabel);
	row.add(borderUserImage);
	row.add(commentDetail);		
	row.add(contentLabel);

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
		row.remove(commentView);
		
		//change text color
		contentLabel.color = 'black';
		commentDetail.color = '#999999'
	};
	
	row._showToolbar = function(rowIndex) {
		row.index = rowIndex;		
		row.add(replyToolbar);
		row.add(commentView);
		
		//change text color
		contentLabel.color = 'white';
		commentDetail.color = '#cccccc';
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
		
		//activity stuff
		//update to activity feed to the thread's owner
		//1. insert to activity db 
		var curTopic = Topic.topicModel_getTopicById(_comment.topicId);
		var commentActivityData = {
			user_id: userId,
			targetedUserID: _comment.username, //owner of the thread
			category: 'comment',
			targetedObjectID: _comment.topicId, //acsId of the topic
			additionalData: curTopic.title, //topicStr
		};
		
		//2. send activity object to acs with local_id
		var newActivityId = ActivityModel.activityModel_create(commentActivityData);
		
		//3. come back and update local activity db with acs_object_id
		ActivityACS.activityACS_createMyActivity(commentActivityData,newActivityId);
		
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
				ratingStr = ' +'+rating;
				ratingLabel.backgroundImage = 'images/messageboard/comment/goodratingBG.png';
			} else if(rating < 0) {
				ratingStr = ' '+rating;
				ratingLabel.backgroundImage = 'images/messageboard/comment/badratingBG.png';
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
