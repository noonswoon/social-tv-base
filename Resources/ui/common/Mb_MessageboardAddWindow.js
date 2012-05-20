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
		
	//ADDING EVENT LISTENERS
	self.addEventListener('return', function(e) {
		if(topicTextarea.value === '') {
			return;
		}
		
		//1. insert to the db topic table
		var newId = Topic.topicModel_add(_programId, 0,topicTextarea.value,acs.getUserLoggedIn().username);
		
		//2. insert into topics table view [first record]
		var topicDetailForNewTableViewRow = {
			title: topicTextarea.value,
			id: newId,
			acsObjectId:0,
			hasChild:true,
			color: '#fff',
			username: acs.getUserLoggedIn().username,
			updatedAt: moment().format("YYYY-MM-DDTHH:mm:ss")
		};
		
		Ti.App.fireEvent('insertingTopicTableViewRow', {topicDetailForNewTableViewRow:topicDetailForNewTableViewRow});
		
		//3 call TopicACS.topicACS_create(topicTextarea.value,_programId,newId);
		TopicACS.topicACS_create(topicTextarea.value,_programId,newId);
		
		//4 use the return object from ACS to update db and row in the table [update the acsObjectId]
		// in the function callback in Mb_MessageboardMainWindow.js
		topicTextarea.value = "";		
		self.close();
	
	});
	
	self.addEventListener('open', function(e) {
		topicTextarea.focus();
	});
	
	self.addEventListener('close', function(e) {
		topicTextarea.blur();
	});	
	
	return self;
}

module.exports = MessageboardAddWindow;