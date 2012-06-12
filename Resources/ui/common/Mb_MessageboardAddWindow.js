function MessageboardAddWindow(_programId) {
	//HEADERS
	var Topic = require('model/topic');
	var TopicACS = require('acs/topicACS');

	//UI STUFF
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/Backbutton.png',
        width:57,height:34
	});
	
	var self = Titanium.UI.createWindow({
		barImage: 'images/NavBG.png',
		title: "Message Board",
	 	leftNavButton:backButton
	});

	backButton.addEventListener('click', function(){
   		self.close();
	});
	
	var addTopicToolbar = Ti.UI.createImageView({
		image: 'images/messageboard/add/addtopictoolbar.png',
		top: 0
	});
	
	var textAndButtonView = Ti.UI.createView({
		top: 49,
		heigth: 'auto',
		backgroundImage: 'images/messageboard/add/textandbuttonviewBG.png'
	});

	var topicTextarea = Ti.UI.createTextArea({
		top: 20,
		left: 10,
		right: 10,
		width: 227,
		height: 54,
		editable: true,
		borderRadius: 5,
		font: {fontSize:14},
		textAlign: 'left',
    	backgroundColor: 'transparent',
    	backgroundImage: 'images/messageboard/add/textareaBG.png'
	});
	textAndButtonView.add(topicTextarea);
	
	var addButton = Ti.UI.createButton({
		top: 20,
		right: 10,
		width: 58,
		height: 56,
		backgroundImage: 'images/messageboard/add/addbutton.png',
		backgroundSelectedImage: 'images/messageboard/add/addbutton_onclick.png'
	});
	textAndButtonView.add(addButton);
	
	//ADDING UI COMPONENTS TO THE WINDOW
	self.add(topicTextarea);
	self.add(addTopicToolbar);
	self.add(textAndButtonView);
		
	//ADDING EVENT LISTENERS
	addButton.addEventListener('click', function(e) {
		if(topicTextarea.value === '') {
			return;
		}
		
		//1. insert to the db topic table
		var newId = Topic.topicModel_add(_programId, 0,topicTextarea.value,acs.getUserLoggedIn().username, UrbanAirship.getDeviceToken());
		
		//2. insert into topics table view [first record]
		var topicDetailForNewTableViewRow = {
			title: topicTextarea.value,
			id: newId,
			acsObjectId:0,
			hasChild:true,
			color: '#fff',
			commentsCount: 0,
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