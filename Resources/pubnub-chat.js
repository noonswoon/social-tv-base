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

    var currentChatRoom = _chatParams['programId'];
   	var currentProgramId = _chatParams['programId'];
    
	var programData = TVProgram.TVProgramModel_fetchProgramsWithProgramId(currentProgramId);
	var currentChatRoomName = programData[0].name;
	
	//dummy userobject
	var userObject = {id:acs.getUserId(),fbId: acs.getUserFbId(),imageUrl: acs.getUserImage()};
	var adminUserObject = {id: '', imageUrl: DEFAULT_CTB_IMAGE_URL}; //for the greet message
	var historyMessages = [];
	var lastHistoryLoadedIndex = 0;
	var totalHistoryMessages = 0;
	var hasNotSent = true;
	var hasNotReceived = true;
	
	var chatMessagesTableView = Ti.UI.createTableView({
		top:0,
		height:377,
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
	            var welcomeChatRow = new ChatMessageTableViewRow(L("Welcome to")+" "+currentChatRoomName+" "+L("Chat Room. Please keep our place clean."),adminUserObject,false);
    			chatMessagesTableView.setData([loadHistoryMessagesRow,welcomeChatRow]);
    			
    			//load history messages and add in 5 latest chats    
    			//load the last 5 messages
				pubnub.history({
					channel : currentChatRoom,
					limit : 100
				}, function(messages) {
					// Show History
					//Ti.API.info('first loaded history: '+messages);
					totalHistoryMessages = messages.length;
					//building historyMessages array
					
					for(var i = messages.length -1;i >= 0; i--) {
						messageObj = {text: messages[i].text, senderId: messages[i].senderId, senderFbId: messages[i].senderFbId, time: messages[i].time };
						historyMessages.push(messageObj);
					}
					
					// add in the last 5 messages
					var numMessagesToLoad = 5; 
					if(messages.length < 5) {
						numMessagesToLoad = messages.length;
					}
					for(var i = 0; i < numMessagesToLoad;i++) {
						var historyUserObj = {id:historyMessages[i].senderId,fbId: historyMessages[i].senderFbId,imageUrl: 'https://graph.facebook.com/'+historyMessages[i].senderFbId+'/picture?type=square'};
						var isYourMessage = false;
						if(historyMessages[i].senderFbId === userObject.fbId) isYourMessage = true;
						var newChatRow = new ChatMessageTableViewRow(historyMessages[i].text,historyUserObj,isYourMessage);
			          	chatMessagesTableView.insertRowAfter(0,newChatRow);
					}
					lastHistoryLoadedIndex = numMessagesToLoad - 1;
				
					//scroll to the last one
					setTimeout(function() {
						chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1); //fixing stuff here scroll to the latest row
					}, 1000);
				});      
	        },
	        callback : function(message) {
	        	//since pubnub is a broadcaster, sender will receive his own message as well
	        	//prevent from having the user sees his own message when it got broadcasted
	        	if(userObject.id !== message.senderId) {
					Ti.Media.vibrate(); //i love things that shake!
					if(hasNotReceived) {
						Ti.Analytics.featureEvent('chat.receive', {receiverId: userObject.id});
						Titanium.App.Analytics.trackPageview('/chat.receive');
	            		hasNotReceived = false; //already received
	   	 	        }
	            	var senderObj = {id: message.senderId, fbId: message.senderFbId, imageUrl: 'https://graph.facebook.com/'+message.senderFbId+'/picture',time:message.time }
	           		var newChatRow = new ChatMessageTableViewRow(message.text,senderObj,false);
	           		chatMessagesTableView.appendRow(newChatRow);
	           	   	setTimeout(function() {
			   			chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1); //add some delay-fixing stuff here scroll to the latest row
					}, 1000);
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
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/back_button.png',
        width:57,height:34
	});

	var chat_window = Ti.UI.createWindow({
		title: currentChatRoomName,
		barImage: 'images/nav_bg_w_pattern.png',
		backgroundImage: 'images/bg.png',
		barColor:'#489ec3',
		leftNavButton: backButton,
		tabBarHidden: true
	});
	
	backButton.addEventListener('click', function(){
		//unsubscribe here...
		Ti.API.info('unsubscribe from channel: '+currentChatRoom);
		pubnub.unsubscribe({ channel : currentChatRoom });
		historyMessages = [];
		lastHistoryLoadedIndex = 0;
		totalHistoryMessages = 0;
   		chat_window.close();
	});

	var loadHistoryMessagesRow = Ti.UI.createTableViewRow({
		top: 7,
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
		height: 40,
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
    var sendButton = Ti.UI.createImageView({
		width: 60,
		height: 31,
		right: 10,
		image: 'images/chat/send.png'
    });
    
	chatInputView.add(chatInputTextField);
	chatInputView.add(sendButton);
	
	chat_window.add(chatMessagesTableView);
	chat_window.add(chatInputView);
	///////////////////////////////////////////////////////////////////////////////////////////			
	
	var chatData = [loadHistoryMessagesRow]; 	
	chatMessagesTableView.setData(chatData);
	
	//////////////////////////////////////////////////////////////////////////////////
    this.chat_window = chat_window;
    this.pubnub      = pubnub;
    
    loadHistoryButton.addEventListener('click', function() {
    	//already load history when the page opens
		var nextHistoryLoadedIndex = lastHistoryLoadedIndex + 1; 	
		if(nextHistoryLoadedIndex >= historyMessages.length) {
			alert(L("No more chat history"));
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
    });

	//animate up
	var animateNegativeUp_chatView = Ti.UI.createAnimation({
		top: -230,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});
	
	var animateDown_chatView = Ti.UI.createAnimation({
		top: 0,
		duration: 350,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});

	var animateUp_inputView = Ti.UI.createAnimation({
		top: 140,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});
	
	var animateDown_inputView = Ti.UI.createAnimation({
		top: 375,
		duration: 350,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});


	chatInputTextField.addEventListener('focus', function() {
		chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1);
		chatMessagesTableView.animate(animateNegativeUp_chatView);
	//	chatInputView.top = 140;
		chatInputView.animate(animateUp_inputView);
		chatInputView.height = 60;
		chatInputTextField.height = 40;
	});
	
	chatInputTextField.addEventListener('blur', function() {
		chatMessagesTableView.animate(animateDown_chatView);
	//	chatInputView.top = 375;
		chatInputView.animate(animateDown_inputView);
		chatInputView.height = 40;
		chatInputTextField.height = 30;
	});
	
    sendButton.addEventListener('click', function() {
		if(chatInputTextField.value === "")
			return;
		
		if(hasNotSent) {
			Ti.Analytics.featureEvent('chat.send', {userId: userObject.id});
			Titanium.App.Analytics.trackPageview('/chat.send');
			hasNotSent = false;
		}
		
		var newChatRow = new ChatMessageTableViewRow(chatInputTextField.value,userObject,true);
        chatMessagesTableView.appendRow(newChatRow);
        		
		send_a_message(chatInputTextField.value);
	
		chatInputTextField.value = "";
    	chatInputTextField.blur();
    	setTimeout(function() {
			   	chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1); //fixing stuff here scroll to the latest row
		}, 500);
    });
	
	subscribe_chat_room();
			
    return this;
};

