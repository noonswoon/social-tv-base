function CommentWindow(_topicId) {
	//HEADERS
	var Topic = require('model/topic');
	var Comment = require('model/comment');
	var CommentACS = require('acs/commentACS');
	var CommentHeaderTableViewRow = require('ui/common/Mb_CommentHeaderTableViewRow');
	var CommentTableViewRow = require('ui/common/Mb_CommentReplyTableViewRow');
	var CacheHelper = require('helpers/cacheHelper');
	
	//OBJECTS INSTANTIATION
	var commentHeader = new CommentHeaderTableViewRow();
	var usingPull2Refresh = false;
	var topicOwnerDeviceTokenId = "";
	
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
		scrollable: true,
		height:'auto',
		selectedToCommentRow: null,
	});
	
	//ADDING UI COMPONENTS
	self.add(commentsTable);
	
	//HELPER FUNCTIONS
	function assignRankingScores(_commentsArray) {
		for(var i=0;i<_commentsArray.length;i++) {
			var curComment = _commentsArray[i];
			var commentACSId = curComment.acsObjectId;
			var totalVotes = Comment.commentModel_getNumberOfVotes(commentACSId);
			var positiveVotes = Comment.commentModel_getPositiveVotes(commentACSId);
			curComment.rankingScore = calculateRankingScore(totalVotes,positiveVotes);	
			_commentsArray[i] = curComment;
		}
	}
	
	function commentSort(a,b) {
		return b.rankingScore - a.rankingScore; //high ranking score should be at the front (smaller)
	}
	
	//recursive function
	function showCommentTableViewRow(_commentLevel,_commentRowsData,_commentsArray,_targetedCommentId) {
		for(var i=0;i<_commentsArray.length;i++) {
			var curComment = _commentsArray[i];
			if(_targetedCommentId === curComment.responseToObjectId) {
				var commentRow = new CommentReplyTableViewRow(curComment,_commentLevel);
				_commentRowsData.push(commentRow);
				showCommentTableViewRow(_commentLevel+1,_commentRowsData,_commentsArray,curComment.acsObjectId);
			}
		}
	}
	//CALLBACK FUNCTIONS
	function commentsLoadedCompleteCallback(e) {
		//add to db
		//Ti.API.info(e.fetchedComments);
		Comment.commentModel_updateCommentsOnTopicFromACS(e.fetchedComments,_topicId); 
		
		//signify pull2refresh to be done [if it comes from Pull2Refresh] 
		if(usingPull2Refresh) {
			commentsTable.refreshFinished();
			usingPull2Refresh = false;
			CacheHelper.resetCacheTime('commentsOfTopic'+_topicId);
		}
	}
	
	function commentsDbUpdatedCallback(e) {
		//clear current data in the table
		commentsTable.data = [];
		
		//getting topicInfo from the db
		
		var curTopic = Topic.topicModel_getTopicById(_topicId);
		topicOwnerDeviceTokenId = curTopic.deviceTokenId;
				
		commentHeader._setTitle(curTopic.title);
		
		//use momentjs for helping on converting dateObject from string
		//problematic because ACS stores the date as a string with timezone format (+0000)
		//and we can't directly convert datestring with timezone format to Javascript Date object
		//so --> create moment object with datestring from ACS (having timezone)
		//then use moment to output a format that javascript Date object can understand
		//namely, the 'MMM D, YYYY hh:mm:ss' format
		var dm = moment(curTopic.updatedAt, "YYYY-MM-DDTHH:mm:ss");
		var submitDateStr = since(dm);
		commentHeader._setSubmissionTime("Submitted "+submitDateStr+" by "+curTopic.username);
		//retrieve from db
		var allComments = Comment.commentModel_fetchReviewsFromTopicId(_topicId);
		var commentsOfTopic = [];
		var votesOfComments = [];
		
		for (var i=0;i<allComments.length;i++) {
			var curComment = allComments[i];
			if(curComment.isAVote === 0) {
				commentsOfTopic.push(curComment);
			} else {
				votesOfComments.push(curComment);
			}
		}
		//Ti.API.info('num commentsOfTopic: '+commentsOfTopic.length);
		//Ti.API.info('num votesOfComments: '+votesOfComments.length);
		
		var commentRowsData = [commentHeader];
		
		//populate commentRowsData recursively from the below function
		//need to modify this so that the first level of comment is ranked by score
		
		//calculate ranking score of each comment
		assignRankingScores(commentsOfTopic); 
		
		//sort comments based on rankingScore
		for(var i=0;i<commentsOfTopic.length;i++) {
			Ti.API.info('pre sort: '+commentsOfTopic[i].id+ ' score '+commentsOfTopic[i].rankingScore);
		}
		commentsOfTopic.sort(commentSort);
		for(var i=0;i<commentsOfTopic.length;i++) {
			Ti.API.info('post sort: '+commentsOfTopic[i].id+ ' score '+commentsOfTopic[i].rankingScore);
		}
		//recursively build the comment lists
		showCommentTableViewRow(0,commentRowsData,commentsOfTopic,_topicId);
		commentsTable.setData(commentRowsData);
		//LOGIC/Controllers 		
		//take out the Loading...
		hidePreloader(self);
	}
	
	function commentCreatedACSCallback(e) {
		commentHeader._setReplyTextArea("");
		var newComment = e.newComment;	
		var commentForTableViewRow = {
			commentLevel: 0,
			acsObjectId: newComment.id, //just to update this field!
			topicId: newComment.custom_fields.response_to_object_id,
			content: newComment.content,
			rating: 0,
			username: newComment.user.username,
			responseToObjectId: newComment.custom_fields.response_to_object_id,
			isAVote: 0,
			isDeleted: 0,
			updatedAt: convertACSTimeToLocalTime(newComment.updated_at)
		}
		var updatedRow = new CommentReplyTableViewRow(commentForTableViewRow,0);
		commentsTable.updateRow(1,updatedRow);
		
		Comment.commentModel_updateACSObjectIdField(newComment);
	}
	
	function commentOfCommentCreatedACSCallback(e) {
		var newCommentOfComment = e.newCommentOfComment;	
		var rowIndexToUpdateACSObjectId = e.rowIndexToUpdateACSObjectId;
		var commentLevel = e.commentLevel;
		var commentForTableViewRow = {
			commentLevel: commentLevel,
			acsObjectId: newCommentOfComment.id, //just to update this field!
			topicId: newCommentOfComment.custom_fields.topic_id,
			content: newCommentOfComment.content,
			rating: 0,
			username: newCommentOfComment.user.username,
			responseToObjectId: newCommentOfComment.custom_fields.response_to_object_id,
			isAVote: 0,
			isDeleted: 0,
			updatedAt: convertACSTimeToLocalTime(newCommentOfComment.updated_at)
		}
		var updatedRow = new CommentReplyTableViewRow(commentForTableViewRow,commentLevel);
		commentsTable.updateRow(rowIndexToUpdateACSObjectId,updatedRow);
		
		Comment.commentModel_updateACSObjectIdField(newCommentOfComment);
	}
	
	function voteOfCommentCreatedACSCallback(e) {
		var newVote = e.newVote;
		Ti.API.info("new vote id: "+newVote.id+", voteScore: "+newVote.rating);	
		Comment.commentModel_updateACSObjectIdField(newVote);
	}
	
	function addNewCommentTableViewRowCallback(e) {
		var tableViewRowDetail = e.commentDetailForNewTableViewRow;
		var commentRow = new CommentReplyTableViewRow(tableViewRowDetail,tableViewRowDetail.commentLevel);
		commentsTable.insertRowAfter(tableViewRowDetail.rowIndex,commentRow);
	}
	
	function removeTableViewRowCallback(e) {
		commentsTable.deleteRow(e.rowIndexToDelete);
	}

	function postCommentAction(e) {
		if(commentHeader._getReplyTextAreaContent() === '') {
			commentHeader._blurReplyTextArea();
			return;
		}
		var newId = Comment.commentModel_addCommentOrRating(_topicId,commentHeader._getReplyTextAreaContent(),0,acs.getUserLoggedIn().username,_topicId,0);
		var newCommentDetail = {
			title: commentHeader._getReplyTextAreaContent(),
			id: newId,
			acsObjectId: 0, //need to be later updated
			topicId: _topicId,
			content: commentHeader._getReplyTextAreaContent(),
			rating: 0,
			username: acs.getUserLoggedIn().username,
			responseToObjectId: _topicId,
			isAVote: 0,
			isDeleted: 0,
			updatedAt: moment().format("YYYY-MM-DDTHH:mm:ss")
		}
		var commentRow = new CommentReplyTableViewRow(newCommentDetail,0);
		commentsTable.insertRowAfter(0,commentRow);
		
		CommentACS.commentACS_createCommentOfTopic(commentHeader._getReplyTextAreaContent(),newId,_topicId);
		Ti.API.info('sending notification to deviceTokenId: '+topicOwnerDeviceTokenId);
		commentHeader._setReplyTextArea("");
		commentHeader._blurReplyTextArea();
	}
	//ADD EVENT LISTENERS  header.replyButton
	commentHeader._getReplyButton().addEventListener('click',postCommentAction); //can either post by click on the 'reply' keyboard button (only iOS)
	commentHeader._getReplyTextArea().addEventListener('return',postCommentAction); //or click on the 'return' button (iOS/Android)
	commentHeader._getReplyTextArea().addEventListener('focus',function() {
		commentHeader._setReplyTextArea(""); //get rid of psedu hint text
	}); //or click on the 'return' button (iOS/Android)
	
	commentsTable.addEventListener('click', function(e) {
		if(e.source.toString().indexOf("TiUIButton") > 0) return; //prevent event propagation of clicking reply,vote up/down
		if(e.index == 0) return;
		if(commentsTable.selectedToCommentRow != null)
			commentsTable.selectedToCommentRow._hideToolbar(e.index);	
	
		commentsTable.selectedToCommentRow = e.row;
		commentsTable.selectedToCommentRow._showToolbar(e.index);
	});

	Ti.App.addEventListener("commentsLoadedComplete", commentsLoadedCompleteCallback);
	Ti.App.addEventListener('commentCreatedACS', commentCreatedACSCallback);	
	Ti.App.addEventListener('commentOfCommentCreatedACS', commentOfCommentCreatedACSCallback);
	Ti.App.addEventListener('voteOfCommentCreatedACS', voteOfCommentCreatedACSCallback);
	Ti.App.addEventListener('commentsDbUpdated', commentsDbUpdatedCallback);
	Ti.App.addEventListener('insertingCommentTableViewRow', addNewCommentTableViewRowCallback);
	Ti.App.addEventListener('deletingCommentTableViewRow', removeTableViewRowCallback);
	
	self.addEventListener("close", function(e) {
		Ti.App.removeEventListener("commentsLoadedComplete",commentsLoadedCompleteCallback);
		Ti.App.removeEventListener("commentCreatedACS",commentCreatedACSCallback);
		Ti.App.removeEventListener('commentOfCommentCreatedACS', commentOfCommentCreatedACSCallback);
		Ti.App.removeEventListener('voteOfCommentCreatedACS', voteOfCommentCreatedACSCallback);
		Ti.App.removeEventListener('commentsDbUpdated', commentsDbUpdatedCallback);
		Ti.App.removeEventListener('insertingCommentTableViewRow', addNewCommentTableViewRowCallback);
		Ti.App.removeEventListener('deletingCommentTableViewRow', removeTableViewRowCallback);
	});
	
	//PAGE LOGIC/CONTROLLER
	showPreloader(self,'Loading...');

	//pull2refresh module
	var lastUpdatedDateObj = CacheHelper.getCacheTime('commentsOfTopic'+_topicId);
	var lastUpdatedStr = "No updated";
	if(lastUpdatedDateObj != null) {
		lastUpdatedStr = lastUpdatedDateObj.format("DD-MM-YYYY HH:mm"); 
	}
	PullToRefresh.addASyncPullRefreshToTableView(commentsTable, function() {
		usingPull2Refresh = true;
		CommentACS.commentACS_fetchAllCommentsOfPostId(_topicId);
	}, { //settings
		updateLabel: {
			text: 'Last Updated: '+lastUpdatedStr,
		}
	});	


	//*** ON-THE-PLANE STUFF 
	//Comment.contentsDuringOffline();
	//Comment.commentModel_updateRankingScore('4fbfbcdb002044729301dd73');
	//*** END ON-THE-PLANE STUFF
	
	//just to be safe, commentACS_fetchAllCommentsOfPostId should come after addEventListener; should register before firing)
	
	//fetching data or get data through caching mechanism
	CacheHelper.fetchACSDataOrCache('commentsOfTopic'+_topicId, CommentACS.commentACS_fetchAllCommentsOfPostId, _topicId, 'commentsDbUpdated');
	return self;
}
module.exports = CommentWindow;