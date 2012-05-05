function WebboardAddWindow(__args) {
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
		Topic.create(topicTextarea.value);
		self.close();
		topicTextarea.value = "";
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