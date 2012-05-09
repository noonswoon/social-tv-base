function CommentWindow(_postId) {
	//HEADERS
	var Comment = require('model/comment');
	var CommentACS = require('acs/commentACS');
	var CommentHeaderTableViewRow = require('ui/common/Mb_CommentHeaderTableViewRow');
	var CommentTableViewRow = require('ui/common/Mb_CommentReplyTableViewRow');
	
	//OBJECTS INSTANTIATION
	var header = new CommentHeaderTableViewRow();
	header.topicLabel.text = "What happened to Peter?";
	header.dateLabel.text = "Submitted 3 hours ago by Test";
	
	//UI STUFF
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Webboard",
		barColor: '#6d0a0c'
	});

	var table = Titanium.UI.createTableView({
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
	self.add(table);
	
	//CALLBACK FUNCTIONS
	function commentsLoadedCompleteCallback(e) {
		//add to db
		alert("Cloud CommentACS fetchAllComments - DONE");
		Ti.API.info(e.fetchedComments);
		toolActInd.hide();
		self.setToolbar(null,{animated:true});
		table.height += self.to
		//Comment.commentModel_updateCommentsFromACS(e.fetchedComments,_postId); 
	}
	
	function commentCreatedACSCallback(e) {
		header.replyTextField.value = "";
		var newComment = e.newComment;	
		alert("receving fired event from CommentACS create");
		//Comment.commentModel_add(newComment);
	}
	
	//ADD EVENT LISTENERS
	table.addEventListener('click', function(e){
		Ti.API.warn(e.index);
	});

	header.replyTextField.addEventListener('return', function(e) {
		CommentACS.commentToPostACS_create(header.replyTextField.value,_postId);
		header.replyTextField.value = "";
	});

	Ti.App.addEventListener('commentCreatedACS', commentCreatedACSCallback);
	Ti.App.addEventListener("commentsLoadedComplete", commentsLoadedCompleteCallback);

	self.addEventListener("close", function(e) {
		Ti.App.removeEventListener("commentsLoadedComplete",commentsLoadedCompleteCallback);
		Ti.App.removeEventListener("commentCreatedACS",commentCreatedACSCallback);
	});
	
	//PAGE LOGIC/CONTROLLER
	toolActInd.show();
	var viewRowsArray = [];
	viewRowsArray.push(header);
	table.setData(viewRowsArray);	
	
	//just to be safe, commentACS_fetchAllCommentsOfPostId should come after addEventListener; should register before firing)
	CommentACS.commentACS_fetchAllCommentsOfPostId(_postId);

	/*self._setTopic = function(topic) {
		self.topic = Topic.get(topic.id);
		header.topicLabel.text = self.topic.title;
		header.dateLabel.text = "Submitted " + since(self.topic.created_at);
		data = [
			header
		];
		
		for (var i=0;i<self.topic.replies.length;i++) {
			var row = new CommentTableViewRow(table);
			row._setReply(self.topic.replies[i]);
			data.push(row);
		}
		table.setData(data);
	};*/

	return self;
}


module.exports = CommentWindow;