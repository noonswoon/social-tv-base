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
	            var welcomeChatRow = new ChatMessageTableViewRow("Welcome to "+currentChatRoomName+" Chat Room. Please keep our place clean.",adminUserObject,false);
    			chatMessagesTableView.setData([loadHistoryMessagesRow,welcomeChatRow]);	            
	        },
	        callback : function(message) {
	        	//since pubnub is a broadcaster, sender will receive his own message as well
	        	//prevent from having the user sees his own message when it got broadcasted
	        	if(userObject.id !== message.senderId) {
					Ti.Media.vibrate(); //i love things that shake!
	            	var senderObj = {id: message.senderId, fbId: message.senderFbId, imageUrl: 'https://graph.facebook.com/'+message.senderFbId+'/picture',time:message.time }
	           		var newChatRow = new ChatMessageTableViewRow(message.text,senderObj,false);
	           		chatMessagesTableView.appendRow(newChatRow);
	           	   	setTimeout(function() {
			   			chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1); //fixing stuff here scroll to the latest row
					}, 2000);
	           		//chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount -1); //scroll to the latest row
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

//animate up
	var animateNegativeUp = Ti.UI.createAnimation({
		top: -230,
		duration: 200,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});
	
	var animateDown = Ti.UI.createAnimation({
		top: 0,
		duration: 200,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});

	chatInputTextField.addEventListener('focus', function() {
		chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1);
		chatMessagesTableView.animate(animateNegativeUp);
		chatInputView.top = 140;
		chatInputView.height = 60;
		chatInputTextField.height = 40;
	});
	
	chatInputTextField.addEventListener('blur', function() {
		chatMessagesTableView.animate(animateDown);
		chatInputView.top = 375;
		chatInputView.height = 40;
		chatInputTextField.height = 30;
	});
	
    sendButton.addEventListener('click', function() {
		if(chatInputTextField.value === "")
			return;

		var newChatRow = new ChatMessageTableViewRow(chatInputTextField.value,userObject,true);
        chatMessagesTableView.appendRow(newChatRow);
        		
		send_a_message(chatInputTextField.value);
	
		chatInputTextField.value = "";
    	chatInputTextField.blur();
    	setTimeout(function() {
			   	chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1); //fixing stuff here scroll to the latest row
		}, 2000);
    });
    
    return this;
};

