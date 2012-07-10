// ----------------------------------
// INCLUDE PUBNUB
// ----------------------------------
	Ti.include('./pubnub.js');
	
	// ----------------------------------
	// INIT PUBNUB
	// ----------------------------------
	var pubnub = Ti.PubNub.init({
	    publish_key   : 'pub-5d5a8d08-52e1-4011-b632-da2a91d6a2b9',
	    subscribe_key : 'sub-de622063-9eb3-11e1-8dea-0b2d0bf49bb9',
	    ssl           : false,
	    origin        : 'pubsub.pubnub.com'
	});
	
Ti.App.Chat = function(_chatParams) {    
    
   	var TVProgram = require('model/tvprogram');
	var ChatParticipantsScrollView = require('ui/common/Ct_ChatParticipantsScrollView');
	var ChatMessageTableViewRow = require('ui/common/Ct_ChatMessageTableViewRow');
		
	var curUserInput = "";
    var currentChatRoom = _chatParams['programId'];
   	var currentProgramId = _chatParams['programId'];
    
	var programData = {}; 
	if(currentProgramId !== 'CTB_PUBLIC')
		programData = TVProgram.TVProgramModel_fetchProgramsWithProgramId(_programId);
	else programData = { program_id: 'CTB_PUBLIC', 
		name:'Public Room', 
		subname:'',
		photo: 'http://a0.twimg.com/profile_images/2208934390/Screen_Shot_2012-05-11_at_3.43.35_PM.png',
		number_checkins: '-', 
		program_type: 'etc'
	};
	var currentChatRoomName = programData.name;
	
	var hasLoadedPicker = false;
	
	//dummy userobject
	var userObject = {id:acs.getUserId(),fbId: acs.getUserFbId(),imageUrl: acs.getUserImage()};
	var adminUserObject = {id: '', imageUrl: 'http://a0.twimg.com/profile_images/2208934390/Screen_Shot_2012-05-11_at_3.43.35_PM.png'}; //for the greet message
	var historyMessages = [];
	var lastHistoryLoadedIndex = 0;
	var totalHistoryMessages = 0;
	var pickerSelectedIndex = 0;
	
	var chatMessagesTableView = Ti.UI.createTableView({
		top:45,
		height: 'auto',
		backgroundColor: 'transparent',
		separatorColor: 'transparent',
		scrollable: true
	});
	
    // ----------------------------------
    // LISTEN FOR MESSAGES
    // ----------------------------------
    var subscribe_chat_room = function() {
		//clear data
    	pubnub.subscribe({
	        channel  : currentChatRoom,
	        connect  : function() {
	            Ti.API.info("connecting...");
				//reset stuff
	            var welcomeChatRow = new ChatMessageTableViewRow("Welcome to "+currentChatRoomName+" Chat Room. Please keep our place clean.",adminUserObject,false);
    			chatMessagesTableView.setData([loadHistoryMessagesRow,welcomeChatRow]);	            
	        },
	        callback : function(message) {
	        	//since pubnub is a broadcaster, sender will receive his own message as well
	        	//prevent from having the user sees his own message when it got broadcasted
	        	if(message.text !== curUserInput) {
	            	var senderObj = {id: message.senderId, fbId: message.senderFbId, imageUrl: 'https://graph.facebook.com/'+message.senderFbId+'/picture',time:message.time }
	           		var newChatRow = new ChatMessageTableViewRow(message.text,senderObj,false);
	           		chatMessagesTableView.appendRow(newChatRow);
	           		chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount -1); //scroll to the latest row
	           	}
	        },
	        error : function() {
	       		Ti.API.info("Lost connection...");
	        }
	    });
    };

    // ----------------------------------
    // SEND MESSAGE
    // ----------------------------------
    var send_a_message = function(message) {
        if (!message) return;

        pubnub.publish({
            channel  : currentChatRoom,
            message  : { text : message, senderId: userObject.id, senderFbId: userObject.fbId, time: moment().format('YYYY-MM-DD, HH:mm:ss')},
            callback : function(info) {
                if (!info[0]) setTimeout(function() {
                    send_a_message(message)
                }, 2000 );
            }
        });
    };
	subscribe_chat_room();
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/Backbutton.png',
        width:57,height:34
	});
	
	var callPicker = Ti.UI.createButton({
		width: 39,
		height: 32,
		backgroundImage: 'images/messageboard/optionbutton.png'
	});

	var chat_window = Ti.UI.createWindow({
		title: "Group Chat",
		barImage: 'images/NavBG.png',
		backgroundImage: 'images/bg.png',
		tabBarHidden: true,
		leftNavButton: backButton,
		rightNavButton: callPicker
	});
	
	backButton.addEventListener('click', function(){
   		chat_window.close();
	});
	
	var selectProgramToolbar = Ti.UI.createView({
		top: 0,
		height: 40,
		backgroundImage: 'images/chat/selectprogramtoolbarBG.png'
	});

	var selectProgramLabel = Ti.UI.createLabel({
		text: currentChatRoomName,
		left: 10,
		width: 'auto',
		font: { fontSize: 18, fontFamily: 'Helvetica Neue', fontWeight: 'bold' }
	});	
	
	//Opacity window when picker is shown
	var opacityView = Ti.UI.createView({
		opacity : 0.6,
		top : 0,
		height : 165,
		zIndex : 7777,
		backgroundColor: '#000'
	});
	
	//Picker
	var picker_view = Titanium.UI.createView({
		height:251,
		bottom:-251,
		zIndex: 2
	});

	var cancel =  Titanium.UI.createButton({
		title:'Cancel',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});

	var done =  Titanium.UI.createButton({
		title:'Done',
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
	});

	var spacer =  Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});


	var toolbar =  Titanium.UI.iOS.createToolbar({
		top:0,
		zIndex: 3,
		items:[cancel,spacer,done]
	});

	var picker = Titanium.UI.createPicker({
		top:43
	});
	picker.selectionIndicator=true;
	picker_view.add(toolbar);

	var slide_in =  Titanium.UI.createAnimation({bottom:0});
	var slide_out =  Titanium.UI.createAnimation({bottom:-251});

	callPicker.addEventListener('click',function() {
		if(!hasLoadedPicker) {
			var dataForPicker = [];
			var preSelectedRow = 0;
			for(var i=0;i<myCurrentCheckinPrograms.length;i++){
				var programId = myCurrentCheckinPrograms[i];
				if(myCurrentSelectedProgram === programId) 
					preSelectedRow = i;
				if(programId === 'CTB_PUBLIC') {
					dataForPicker.push({title:'Public', progId:'CTB_PUBLIC'});
				} else {
					Ti.API.info('[209]programId: '+programId);
					var programInfo = TVProgram.TVProgramModel_fetchProgramsWithProgramId(programId);
					var programName = programInfo[0].name;
					var program_id = programInfo[0].program_id;
					dataForPicker.push({title:programName, progId:program_id});
				}
			}
			picker.setSelectedRow(0,preSelectedRow,false);
			picker.add(dataForPicker);
			picker_view.add(picker);
			hasLoadedPicker = true;
		}
		picker_view.animate(slide_in);
		chat_window.add(opacityView);
	});

	cancel.addEventListener('click',function() {
		picker_view.animate(slide_out);
		chat_window.remove(opacityView);
	});

	done.addEventListener('click',function() {
		picker_view.animate(slide_out);
		chat_window.remove(opacityView);
		
		//only unsubscribe if it the channel changes
		var selectedProgramId = 0; 
		var isRoomChanged = false;
		if(pickerSelectedIndex === 0 && currentProgramId !== 'CTB_PUBLIC') { //changing to public channel
			pubnub.unsubscribe({channel: currentChatRoom});
			currentProgramId = 'CTB_PUBLIC';
			currentChatRoom = currentProgramId;
			currentChatRoomName = 'Public Chat';
			selectProgramLabel.text = currentChatRoomName;
			isRoomChanged = true;
		} else {
			selectedProgramId = picker.getSelectedRow(0).progId; 
		}
		
		if(pickerSelectedIndex !== 0 && selectedProgramId !== currentProgramId ){
			pubnub.unsubscribe({channel: currentChatRoom});
			currentProgramId = selectedProgramId;
			currentChatRoom = currentProgramId;
			var selectedProgram = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
			currentChatRoomName = selectedProgram[0].name;
			selectProgramLabel.text = currentChatRoomName;
			
			//change the room
			myCurrentSelectedProgram = currentProgramId;
			isRoomChanged = true;
		}
		
		if(isRoomChanged) {
			myCurrentSelectedProgram = currentProgramId;
			lastHistoryLoadedIndex = 0;
			historyMessages = [];
			loadHistoryButton.enabled = true;
			//subscribe to new channel
			subscribe_chat_room();
		}
	});

	picker.addEventListener('change',function(e) {
		pickerSelectedIndex = e.rowIndex;
	});
	
	var checkinToProgramCallback = function(e) {
		if(hasLoadedPicker) { //only add a new one if it already loaded, if it isn't, the loading will take care of itself
			var checkinProgramId = e.checkinProgramId; 
			var checkinProgramName = e.checkinProgramName;
			var newPickerRow = Ti.UI.createPickerRow({title:checkinProgramName, progId:checkinProgramId});
			picker.add(newPickerRow);
		}
	};
	Ti.App.addEventListener('checkinToProgram',checkinToProgramCallback);
	//////

	var loadHistoryMessagesRow = Ti.UI.createTableViewRow({
		top: 10,
		height: 30,
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	var loadHistoryButton = Ti.UI.createButton({
		width: 150,
		height: 26,
		backgroundImage: 'images/chat/loadearliermessage.png'
	});
	loadHistoryMessagesRow.add(loadHistoryButton);
	
	var chatInputView = Ti.UI.createView({
		bottom: 0,
		height: 51,
		width: '100%',
		zIndex: 2,
		backgroundImage: 'images/chat/footerBG.png'
	});
	
	var chatInputTextField   = Ti.UI.createTextArea({
        width: 237,
        height: 30,
        left: 10,
        color: "#111",
        value: "",
        font: {fontSize:14},
        textAlign: 'left',
        backgroundColor: 'transparent',
        backgroundImage: 'images/chat/chattextfieldBG.png'
    });
	
    // Send Button
    var sendButton = Ti.UI.createButton({
		width: 60,
		height: 31,
		right: 10,
		backgroundImage: 'images/chat/send.png'
    });
    
	chatInputView.add(chatInputTextField);
	chatInputView.add(sendButton);
	
	selectProgramToolbar.add(selectProgramLabel);
	chat_window.add(selectProgramToolbar);
	chat_window.add(chatMessagesTableView);
	chat_window.add(chatInputView);
	chat_window.add(picker_view);
	///////////////////////////////////////////////////////////////////////////////////////////			
	
	var chatData = [loadHistoryMessagesRow]; 	
	chatMessagesTableView.setData(chatData);
	
	//////////////////////////////////////////////////////////////////////////////////
    this.chat_window = chat_window;
    this.pubnub      = pubnub;
    
    loadHistoryButton.addEventListener('click', function() {
		if(historyMessages.length == 0) {
			pubnub.history({
			    channel : currentChatRoom,
			    limit : 100
			}, function(messages) {
			    // Show History
			    Ti.API.info('first loaded history: '+messages);
				totalHistoryMessages = messages.length;
				//building historyMessages array
				for(var i = messages.length -1;i >= 0; i--) {
					messageObj = {text: messages[i].text, senderId: messages[i].senderId, senderFbId: messages[i].senderFbId, time: messages[i].time };
					historyMessages.push(messageObj);
				}
				// add in the last 10 messages
				var numMessagesToLoad = 10; 
				if(messages.length < 10) {
					numMessagesToLoad = messages.length;
				}
				for(var i = 0; i < numMessagesToLoad;i++) {
					var historyUserObj = {id:historyMessages[i].senderId,fbId: historyMessages[i].senderFbId,imageUrl: 'https://graph.facebook.com/'+historyMessages[i].senderFbId+'/picture'};
					var isYourMessage = false;
					if(historyMessages[i].senderFbId === userObject.fbId) isYourMessage = true;
					var newChatRow = new ChatMessageTableViewRow(historyMessages[i].text,historyUserObj,isYourMessage);
           			chatMessagesTableView.insertRowAfter(0,newChatRow);
				}
				lastHistoryLoadedIndex = numMessagesToLoad - 1;
			});
		} else {
			//continue...adding from the last inserted
			var nextHistoryLoadedIndex = lastHistoryLoadedIndex + 1; 	
			if(nextHistoryLoadedIndex >= historyMessages.length) {
				alert("No more chat history");
				loadHistoryButton.enabled = false;
			} else {
				var historyIndexToLoadTo = nextHistoryLoadedIndex + 9; 
				if(historyIndexToLoadTo >= historyMessages.length)
					historyIndexToLoadTo = historyMessages.length - 1;
				lastHistoryLoadedIndex = historyIndexToLoadTo; 
				
				for(var i = nextHistoryLoadedIndex; i <= historyIndexToLoadTo;i++) {
					var historyUserObj = {id:historyMessages[i].senderId,fbId: historyMessages[i].senderFbId,imageUrl: 'https://graph.facebook.com/'+historyMessages[i].senderFbId+'/picture'};
					var isYourMessage = false;
					if(historyMessages[i].senderFbId === userObject.fbId) isYourMessage = true;
					var newChatRow = new ChatMessageTableViewRow(historyMessages[i].text,historyUserObj,isYourMessage);
	          		chatMessagesTableView.insertRowAfter(0,newChatRow);
				}
			}				
		}
    });

	chatInputTextField.addEventListener('focus', function() {
		chatInputView.top = 140;
		chatInputView.height = 60;
		chatInputTextField.height = 40;
	});
	
	chatInputTextField.addEventListener('blur', function() {
		chatInputView.top = 375;
		chatInputView.height = 40;
		chatInputTextField.height = 30;
	});
	
    sendButton.addEventListener('click', function() {
		if(chatInputTextField.value === "") return;
		var newChatRow = new ChatMessageTableViewRow(chatInputTextField.value,userObject,true);
        chatMessagesTableView.appendRow(newChatRow);
        		
		curUserInput = chatInputTextField.value;
		send_a_message(chatInputTextField.value);
	
		chatInputTextField.value = "";
    	chatInputTextField.blur();
    	chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1); //fixing stuff here scroll to the latest row
    });
    
    // chat_window.addEventListener('close', function() {
    	// alert('removing checkinToProgramCallback listener--bug here');
    	// Ti.App.removeEventListener('checkinToProgram',checkinToProgramCallback);
    // });
    
    return this;
};

