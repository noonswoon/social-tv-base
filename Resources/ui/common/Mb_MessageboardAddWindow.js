function MessageboardAddWindow(_programId) {
	//HEADERS
	var Topic = require('model/topic');
	var TopicACS = require('acs/topicACS');
	var programId = _programId;
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
	
	var title = Ti.UI.createLabel({
		text: 'Topic Title',
		top: 10,
		left: 10,
		font:{fontWeight:'bold',fontSize:14},
	});
	textAndButtonView.add(title);
	
	
	var topicTitle = Ti.UI.createTextField({
		color:'#336699',
		top: 30,
		height:35,
		left:10,
		width:300,
		editable: true,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	})
	textAndButtonView.add(topicTitle);
	
	// var photoIcon = Ti.UI.createImageView({
		// image: 'images/messageboard/add/photo.png',
		// top: 80,
		// left: 10
	// });
	// textAndButtonView.add(photoIcon);
	
	var title = Ti.UI.createLabel({
		text: 'Say something',
		top: 80,
		left: 10,
		font:{fontWeight:'bold',fontSize:14},
	});
	textAndButtonView.add(title);

	var topicContent = Ti.UI.createTextArea({
		value: '',
		top: 100,
		left: 10,
		right: 10,
		width: 300,
		height: 80,
		editable: true,
		borderRadius: 5,
		font: {fontSize:14},
		textAlign: 'left',
    	backgroundColor: 'transparent',
    	backgroundImage: 'images/messageboard/add/textareaBG.png'
	});
	textAndButtonView.add(topicContent);
	
	var addImage = Ti.UI.createButton({
		title: 'Add Image',
		top: 200,
		width: 120,
		height: 40,
		left: 10
	});
	textAndButtonView.add(addImage);
	
	var thumbnailLabel = Ti.UI.createLabel({
		text: 'No Image',
		top: 200,
		width: 120,
		height: 40,
		left: 140		
	});
	textAndButtonView.add(thumbnailLabel);
	
	var thumbnail = Ti.UI.createImageView({
		top: 200,
		width: 120,
		height: 40,
		left: 140		
	});
	textAndButtonView.add(thumbnail);
	
	var addButton = Ti.UI.createButton({
		title: 'Post!',
		top: 250,
		left: 10,
		width: 300,
		height: 40,
		// backgroundImage: 'images/messageboard/add/addbutton.png',
		// backgroundSelectedImage: 'images/messageboard/add/addbutton_onclick.png'
	});
	textAndButtonView.add(addButton);
	
	var addImageDialog = Titanium.UI.createOptionDialog({
		options: ['Take a photo','Select from library']
	});
	
	addImage.addEventListener('click',function(){
		addImageDialog.show();
	});
	
	var galleryProps = {
		success:function(event){
			var image = event.media;
			if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
				thumbnail.image = image;
			else alert('Sorry, something wrong');
			}
	}
	
	addImageDialog.addEventListener('click',function(e){
		if(e.index === 1){
			Ti.Media.openPhotoGallery(galleryProps);
		}
		else alert('Unavailable');
	});
	
	//ADDING UI COMPONENTS TO THE WINDOW
	self.add(topicTitle);
	self.add(addTopicToolbar);
	self.add(textAndButtonView);
		
	//ADDING EVENT LISTENERS
	addButton.addEventListener('click', function(e) {
		
		if(topicTitle.value === '') {
			return;
		}
		
		var mockupPhoto = 'http://blogs.suntimes.com/ebert/Google-logo.jpeg';
		
		//1. insert to the db topic table
		var newId = Topic.topicModel_add(programId, 0,topicTitle.value,mockupPhoto,topicContent.value,acs.getUserLoggedIn().username, UrbanAirship.getDeviceToken());

		//2. insert into topics table view [first record]
		var topicDetailForNewTableViewRow = {
			title: topicTitle.value,
			photo: mockupPhoto,
			content: topicContent.value,
			id: newId,
			acsObjectId:0,
			hasChild:true,
			color: '#fff',
			commentsCount: 0,
			username: acs.getUserLoggedIn().username,
			updatedAt: moment().format("YYYY-MM-DDTHH:mm:ss")
		};
		
		Ti.App.fireEvent('insertingTopicTableViewRow', {topicDetailForNewTableViewRow:topicDetailForNewTableViewRow});
		
		//3 call TopicACS.topicACS_create(topicTitle.value,programId,newId);
		TopicACS.topicACS_create(topicTitle.value,mockupPhoto,topicContent.value,programId,newId);
		
		//4 use the return object from ACS to update db and row in the table [update the acsObjectId]
		// in the function callback in Mb_MessageboardMainWindow.js
		topicTitle.value = '';		
		self.close();
	
	});
	
	// self.addEventListener('open', function(e) {
		// topicContent.focus();
	// });
// 	
	// self.addEventListener('close', function(e) {
		// topicContent.blur();
	// });	
	
	self._setProgramId = function(_newProgramId) {
		programId = _newProgramId;
	};
	
	return self;
}

module.exports = MessageboardAddWindow;