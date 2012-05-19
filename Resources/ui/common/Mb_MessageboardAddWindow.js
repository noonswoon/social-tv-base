function MessageboardAddWindow(_programId) {
	//HEADERS
	var Topic = require('model/topic');
	var TopicACS = require('acs/topicACS');

	//UI STUFF
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Add",
		barColor: '#6d0a0c'
	});
	
	var topicTextarea = Titanium.UI.createTextArea({
		top: 5,
		left: 5,
		right: 5,
		height: 167,
		editable: true
	});
	
	//ADDING UI COMPONENTS TO THE WINDOW
	self.add(topicTextarea);
	
	//CALLBACK FUNCTIONS
	function topicCreatedACSCallback(e) {
		self.close();
		topicTextarea.value = "";
		var newTopic = e.newTopic;	
		Topic.topicModel_add(newTopic);
	}
	
	//ADDING EVENT LISTENERS
	self.addEventListener('return', function(e) {
		if(topicTextarea.value === '') {
			return;
		}
		
		//1. insert into topics table
		var newId = Topic.topicModel_add(_programId, 0,topicTextarea.value,acs.getUserLoggedIn().username);
		alert('new topicId: '+newId);
		//var newId = Comment.commentModel_addCommentOrRating(_topicId,commentHeader.replyTextField.value,0,acs.getUserLoggedIn().username,_topicId,0);
		
		//2. update the table
		/*
		var newCommentDetail = {
			title: commentHeader.replyTextField.value,
			id: newId,
			acsObjectId: 0, //need to be later updated
			topicId: _topicId,
			content: commentHeader.replyTextField.value,
			rating: 0,
			username: acs.getUserLoggedIn().username,
			responseToObjectId: _topicId,
			isAVote: 0,
			isDeleted: 0,
			updatedAt: moment().format("YYYY-MM-DDTHH:mm:ss")
		}
		var commentRow = new CommentReplyTableViewRow(newCommentDetail,0);
		commentsTable.insertRowAfter(0,commentRow);
		
		//3 call TopicACS.topicACS_create(topicTextarea.value,_programId,newId);
		
		//4 use the return object from ACS to update db and row in the table

		*/
	
	});
	
	Ti.App.addEventListener('topicCreatedACS', topicCreatedACSCallback);
	
	self.addEventListener('open', function(e) {
		topicTextarea.focus();
	});
	
	self.addEventListener('close', function(e) {
		topicTextarea.blur();
	});	
	
	return self;
}

module.exports = MessageboardAddWindow;