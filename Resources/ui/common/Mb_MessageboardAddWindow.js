function MessageboardAddWindow(_programId,_programPhoto) {
	//HEADERS
	var Topic = require('model/topic');
	var TopicACS = require('acs/topicACS');
	var FacebookSharing = require('helpers/facebookSharing');
	var programId = _programId;
	//UI STUFF
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/back_button.png',
        width:57,height:34
	});
	
	var self = Titanium.UI.createWindow({
		barImage: 'images/nav_bg_w_pattern.png',
		title: "Message Board",
	 	leftNavButton:backButton
	});
	
	var addTopicToolbar = Ti.UI.createImageView({
		image: 'images/messageboard/add/addtopictoolbar.png',
		top: 0
	});
	
	var textAndButtonView = Ti.UI.createView({
		top: 49,
		heigth: 70,
		backgroundImage: 'images/messageboard/add/textandbuttonviewBG.png'
	});
	
	var titleLabel = Ti.UI.createLabel({
		text: 'Title',
		top: 10,
		left: 10,
		font:{fontWeight:'bold',fontSize:14},
	});
	textAndButtonView.add(titleLabel);
		
	var titleTextFieldInput = Ti.UI.createTextField({
		top: 30,
		height:35,
		left:10,
		width:300,
		editable: true,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	})
	textAndButtonView.add(titleTextFieldInput);
	
	var contentLabel = Ti.UI.createLabel({
		text: 'Content',
		top: 80,
		left: 10,
		font:{fontWeight:'bold',fontSize:14},
	});
	textAndButtonView.add(contentLabel);

	var contentTextAreaInput = Ti.UI.createTextArea({
		value: '',
		top: 100,
		left: 10,
		right: 10,
		width: 300,
		height: 80,
		borderRadius: 5,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
		textAlign: 'left',
    	backgroundColor: 'transparent',
    	backgroundImage: 'images/messageboard/add/textareaBG.png'
	});
	textAndButtonView.add(contentTextAreaInput);
	
	var addImageButton = Ti.UI.createButton({
		title: 'Add Image',
		top: 200,
		width: 120,
		height: 40,
		left: 10
	});
	textAndButtonView.add(addImageButton);
	
	var thumbnailLabel = Ti.UI.createLabel({
		text: 'No Image',
		top: 200,
		width: 120,
		height: 40,
		left: 140,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },		
	});
	textAndButtonView.add(thumbnailLabel);
	
	var thumbnail = Ti.UI.createImageView({
		top: 200,
		width: 40,
		height: 40,
		left: 140		
	});
	textAndButtonView.add(thumbnail);
	
	var postButton = Ti.UI.createButton({
		title: 'Post!',
		top: 250,
		left: 10,
		width: 300,
		height: 40,
	});
	textAndButtonView.add(postButton);
	
	var addImageDialog = Titanium.UI.createOptionDialog({
		options: ['Take a Picture','Choose from Gallery']
	});
	
	addImageButton.addEventListener('click',function(){
		addImageDialog.show();
	});
	
	var uploadedImage = null;
	var filename  = null;
	addImageDialog.addEventListener('click',function(e){
		if(e.index === 1){
			Ti.Media.openPhotoGallery({
				success:function(event){
					uploadedImage = event.media;
					if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO){
						thumbnail.image = uploadedImage;
						thumbnailLabel.hide();
						filename = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory,_programId+'.png');
	 	 	  			filename.write(uploadedImage);		
					}
				}
			});
		}
		else{
			Titanium.Media.showCamera({
				success:function(event){
					uploadedImage = event.media;
					if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO){
						thumbnail.image = uploadedImage;
						thumbnailLabel.hide();
						filename = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory,_programId+'.png');
	 	 	  			filename.write(uploadedImage);	
					}
					else alert("Video is not available ="+event.mediaType);
				},
				cancel:function(){
				},
				error:function(error){
					// create alert
					var a = Titanium.UI.createAlertDialog({title:'Camera'});
					// set message
					if (error.code == Titanium.Media.NO_CAMERA){
						a.setMessage('Please run this test on device');
					}
					else{
						a.setMessage('Unexpected error: ' + error.code);
					}
					// show alert
					a.show();
				},
				saveToPhotoGallery:true,
				mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
			});
		}
	});
	
	
	//ADDING UI COMPONENTS TO THE WINDOW
	self.add(titleTextFieldInput);
	self.add(addTopicToolbar);
	self.add(textAndButtonView);
		
	//ADDING EVENT LISTENERS
	postButton.addEventListener('click', function(e) {
		if(titleTextFieldInput.value === '') {
			return;
		}
		
		//1. insert to the db topic table
		var fileNamePath = null;
		if(filename !== null) {
			fileNamePath = filename.nativePath
		}
		var newId = Topic.topicModel_add(programId, 0,titleTextFieldInput.value,contentTextAreaInput.value,fileNamePath,acs.getUserLoggedIn().id,acs.getUserLoggedIn().username, UrbanAirship.getDeviceToken());

		//2. insert into topics table view [first record]
		var topicDetailForNewTableViewRow = {
			title: titleTextFieldInput.value,
			content: contentTextAreaInput.value,
			photo: fileNamePath,
			id: newId,
			acsObjectId:0,
			hasChild:true,
			color: '#fff',
			commentsCount: 0,
			username: acs.getUserLoggedIn().username,
			updatedAt: moment().format("YYYY-MM-DDTHH:mm:ss")
		};
		
		Ti.App.fireEvent('insertingTopicTableViewRow', {topicDetailForNewTableViewRow:topicDetailForNewTableViewRow});
		
		//3 call TopicACS.topicACS_create(titleTextFieldInput.value,programId,newId);
		TopicACS.topicACS_create(titleTextFieldInput.value,contentTextAreaInput.value,filename,programId,newId);
		
		//4 use the return object from ACS to update db and row in the table [update the acsObjectId]
		// in the function callback in Mb_MessageboardMainWindow.js
		
		//Post appear on Facebook
		FacebookSharing.postAppearOnFaceBook(titleTextFieldInput.value,contentTextAreaInput.value,_programPhoto);
		
		self.close();
		titleTextFieldInput.value = '';	
   		contentTextAreaInput.value = '';
   		thumbnailLabel.show();
   		uploadedImage = null;
   		thumbnail.image = '';	
	});

	self._setProgramId = function(_newProgramId) {
		programId = _newProgramId;
	};
	
	backButton.addEventListener('click', function(){
   		self.close();
   		titleTextFieldInput.value = '';
   		contentTextAreaInput.value = '';
   		thumbnailLabel.show();
   		uploadedImage = null;
   		thumbnail.image = '';
	});
	
	return self;
}

module.exports = MessageboardAddWindow;