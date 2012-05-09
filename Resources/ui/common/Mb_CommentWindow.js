function CommentWindow(_topicId) {
	//HEADERS
	var Comment = require('model/comment');
	var CommentACS = require('acs/commentACS');
	var CommentHeaderTableViewRow = require('ui/common/Mb_CommentHeaderTableViewRow');
	var CommentTableViewRow = require('ui/common/Mb_CommentReplyTableViewRow');
	
	//OBJECTS INSTANTIATION
	var commentHeader = new CommentHeaderTableViewRow();
	commentHeader.topicLabel.text = "What happened to Peter?";
	commentHeader.dateLabel.text = "Submitted 3 hours ago by Test";
	
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
		height:'480'
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
	
	//CALLBACK FUNCTIONS
	function commentsLoadedCompleteCallback(e) {
		//add to db
		Ti.API.info(e.fetchedComments);
		Comment.commentModel_updateCommentsFromACS(e.fetchedComments,_topicId); 
	}
	
	function commentsDbUpdatedCallback(e) {
		//clear current data in the table
		commentsTable.data = [];
		var commentRowsData = [commentHeader];
		
		//retrieve from db
		var allComments = Comment.commentModel_fetchFromTopicId(_topicId);
		for (var i=0;i<allComments.length;i++) {
			var curComment = allComments[i];
			var row = Ti.UI.createTableViewRow({
								title: curComment.content,
								height: 30,
								allowsSelection: false,
								selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
							});
			commentRowsData.push(row);
		}
		commentsTable.setData(commentRowsData);
	
		//take out the Loading... spinning wheel n
		toolActInd.hide();
		self.setToolbar(null,{animated:true});
	}
	
	function commentCreatedACSCallback(e) {
		commentHeader.replyTextField.value = "";
		var newComment = e.newComment;	
		Comment.commentModel_add(newComment);
	}
	
	//ADD EVENT LISTENERS
	commentHeader.replyTextField.addEventListener('return', function(e) {
		CommentACS.commentToPostACS_create(commentHeader.replyTextField.value,_topicId);
		commentHeader.replyTextField.value = "";
	});

	Ti.App.addEventListener('commentCreatedACS', commentCreatedACSCallback);
	Ti.App.addEventListener('commentsDbUpdated', commentsDbUpdatedCallback);
	Ti.App.addEventListener("commentsLoadedComplete", commentsLoadedCompleteCallback);

	self.addEventListener("close", function(e) {
		Ti.App.removeEventListener("commentsLoadedComplete",commentsLoadedCompleteCallback);
		Ti.App.removeEventListener("commentCreatedACS",commentCreatedACSCallback);
	});
	
	//PAGE LOGIC/CONTROLLER
	toolActInd.show();

	//just to be safe, commentACS_fetchAllCommentsOfPostId should come after addEventListener; should register before firing)
	CommentACS.commentACS_fetchAllCommentsOfPostId(_topicId);

	return self;
}


module.exports = CommentWindow;