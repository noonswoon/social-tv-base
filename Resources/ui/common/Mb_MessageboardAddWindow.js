function MessageboardAddWindow(__args) {
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
		TopicACS.topicACS_create(topicTextarea.value,1);
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