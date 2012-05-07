function WebboardAddWindow(__args) {
	var Topic = require('model/topic');
	var TopicACS = require('acs/topicACS');
	
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
	self.add(topicTextarea);
	
	self.addEventListener('return', function(e) {
		//Topic.create(topicTextarea.value,1);
		//connecting with Cloud
		TopicACS.topicACS_create(topicTextarea.value,1);
	});
	
	Ti.App.addEventListener('topicCreatedACS', function(e) {
		self.close();
		topicTextarea.value = "";
		var newTopic = e.newTopic;	
		Topic.topicModel_add(newTopic);
	});
	
	self.addEventListener('open', function(e) {
		topicTextarea.focus();
	});
	
	self.addEventListener('close', function(e) {
		topicTextarea.blur();
	});	
	
	return self;
}

module.exports = WebboardAddWindow;