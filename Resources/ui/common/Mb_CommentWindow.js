function CommentWindow(_topicId) {
	//HEADERS
	var Topic = require('model/topic');
	var Comment = require('model/comment');
	var CommentACS = require('acs/commentACS');
	var CommentHeaderTableViewRow = require('ui/common/Mb_CommentHeaderTableViewRow');
	var CommentTableViewRow = require('ui/common/Mb_CommentReplyTableViewRow');
	
	//OBJECTS INSTANTIATION
	var commentHeader = new CommentHeaderTableViewRow();
	
	//UI STUFF
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Webboard",
		barColor: '#6d0a0c'
	});

	var commentsTable = Titanium.UI.createTableView({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		scrollable: true,
		height:'auto',
		selectedToCommentRow: null
	});
	
	var toolActInd = Titanium.UI.createActivityIndicator({
		font:{fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'},
		color:'white',
		message: 'Loading...',
		style: Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
	});
	
	//ADDING UI COMPONENTS
	self.setToolbar([toolActInd],{animated:true});
	self.add(commentsTable);
	
	//HELPER FUNCTIONS
	
	//recursive function
	function showCommentTableViewRow(_commentLevel,_commentRowsData,_commentsArray,_targetedCommentId) {
		for(var i=0;i<_commentsArray.length;i++) {
			var curComment = _commentsArray[i];
			if(_targetedCommentId === curComment.response_to_object_id) {
				var commentRow = new CommentReplyTableViewRow(curComment,_commentLevel);
				_commentRowsData.push(commentRow);
				showCommentTableViewRow(_commentLevel+1,_commentRowsData,_commentsArray,curComment.id);
			}
		}
	}
	//CALLBACK FUNCTIONS
	function commentsLoadedCompleteCallback(e) {
		//add to db
		//Ti.API.info(e.fetchedComments);
		Comment.commentModel_updateCommentsOnTopicFromACS(e.fetchedComments,_topicId); 
	}
	
	function commentsDbUpdatedCallback(e) {
		//clear current data in the table
		commentsTable.data = [];
		
		//getting topicInfo from the db
		
		var curTopic = Topic.topicModel_getTopicById(_topicId);
		commentHeader.topicLabel.text = curTopic.title;

		//use momentjs for helping on converting dateObject from string
		//problematic because ACS stores the date as a string with timezone format (+0000)
		//and we can't directly convert datestring with timezone format to Javascript Date object
		//so --> create moment object with datestring from ACS (having timezone)
		//then use moment to output a format that javascript Date object can understand
		//namely, the 'MMM D, YYYY hh:mm:ss' format
		var dm = moment(curTopic.updated_at, "YYYY-MM-DDTHH:mm:ss z");
		var dateObjFormat = dm.format('MMM D, YYYY hh:mm:ss');
		var submitDateObj = new Date(dateObjFormat);
		commentHeader.dateLabel.text = "Submitted "+since(submitDateObj)+" by "+curTopic.username;

		//retrieve from db
		var allComments = Comment.commentModel_fetchCommentsFromTopicId(_topicId);
		var commentsOfTopic = [];
		var votesOfComments = [];
		
		
		//use recursion instead
		for (var i=0;i<allComments.length;i++) {
			var curComment = allComments[i];
			if(curComment.is_a_vote === 0) {
				commentsOfTopic.push(curComment);
			} else {
				votesOfComments.push(curComment);
			}
		}
		Ti.API.info('num commentsOfTopic: '+commentsOfTopic.length);
		Ti.API.info('num votesOfComments: '+votesOfComments.length);
		
		var commentRowsData = [commentHeader];
		
		//populate commentRowsData recursively from the below function
		showCommentTableViewRow(0,commentRowsData,commentsOfTopic,_topicId);
		commentsTable.setData(commentRowsData);
	
		//LOGIC/Controllers 		
		//take out the Loading... spinning wheel n
		toolActInd.hide();
		self.setToolbar(null,{animated:true});
	}
	
	function commentCreatedACSCallback(e) {
		commentHeader.replyTextField.value = "";
		var newComment = e.newComment;	
		Comment.commentModel_addCommentOrRating(newComment);
	}
	
	function commentOfCommentCreatedACSCallback(e) {
		var newCommentOfComment = e.newCommentOfComment;	
		Ti.API.info("new comment's comment id: "+newCommentOfComment.id);
		Comment.commentModel_addCommentOrRating(newCommentOfComment);
	}
	
	function voteOfCommentCreatedACSCallback(e) {
		var newVote = e.newVote;
		Ti.API.info("new vote id: "+newVote.id+", voteScore: "+newVote.rating);	
		Comment.commentModel_addCommentOrRating(newVote);
	}

	//ADD EVENT LISTENERS
	commentHeader.replyTextField.addEventListener('return', function(e) {
		CommentACS.commentACS_createCommentOfTopic(commentHeader.replyTextField.value,_topicId);
		commentHeader.replyTextField.value = "";
	});

	commentsTable.addEventListener('click', function(e) {
		if(e.index == 0) return;
		if(commentsTable.selectedToCommentRow != null)
			commentsTable.selectedToCommentRow._hideToolbar();	
	
		commentsTable.selectedToCommentRow = e.row;
		commentsTable.selectedToCommentRow._showToolbar();

		//reset the data to make the UI transition looks smoother
		commentsTable.setData(commentsTable.data);
	});

	Ti.App.addEventListener("commentsLoadedComplete", commentsLoadedCompleteCallback);

	Ti.App.addEventListener('commentCreatedACS', commentCreatedACSCallback);	
	Ti.App.addEventListener('commentOfCommentCreatedACS', commentOfCommentCreatedACSCallback);
	Ti.App.addEventListener('voteOfCommentCreatedACS', voteOfCommentCreatedACSCallback);
	Ti.App.addEventListener('commentsDbUpdated', commentsDbUpdatedCallback);
	
	self.addEventListener("close", function(e) {
		Ti.App.removeEventListener("commentsLoadedComplete",commentsLoadedCompleteCallback);
		Ti.App.removeEventListener("commentCreatedACS",commentCreatedACSCallback);
		Ti.App.removeEventListener('commentOfCommentCreatedACS', commentOfCommentCreatedACSCallback);
		Ti.App.removeEventListener('voteOfCommentCreatedACS', voteOfCommentCreatedACSCallback);
		Ti.App.removeEventListener('commentsDbUpdated', commentsDbUpdatedCallback);
	});
	
	//PAGE LOGIC/CONTROLLER
	toolActInd.show();

	//just to be safe, commentACS_fetchAllCommentsOfPostId should come after addEventListener; should register before firing)
	CommentACS.commentACS_fetchAllCommentsOfPostId(_topicId);
	//CommentACS.commentACS_getAllVotesOfUser('4fa17dd70020440df700950c',_topicId);
	return self;
}
module.exports = CommentWindow;