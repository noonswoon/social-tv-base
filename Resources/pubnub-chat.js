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

var ChatParticipantsScrollView = require('ui/common/Ct_ChatParticipantsScrollView');
var ChatMessageTableViewRow = require('ui/common/Ct_ChatMessageTableViewRow');

//dummy userobject
var userObject = {id:acs.getUserId(),fbId: acs.getUserFbId(),imageUrl: acs.getUserImage()};
var adminUserObject = {id: '', imageUrl: 'http://a0.twimg.com/profile_images/2208934390/Screen_Shot_2012-05-11_at_3.43.35_PM.png'}; //for the greet message
var historyMessages = [];
var lastHistoryLoadedIndex = 0;

Ti.App.Chat = function(setup) {
    
    var curUserInput = "";
    // ----------------------------------
    // LISTEN FOR MESSAGES
    // ----------------------------------
    pubnub.subscribe({
        channel  : setup['chat-room'],
        connect  : function() {
            Ti.API.info("connecting...");
            var newChatRow = new ChatMessageTableViewRow("Welcome to Chatterbox "+setup['chat-room']+" Chat Room. Please help keep our place clean.",adminUserObject,false);
           	chatMessagesTableView.appendRow(newChatRow);
            //textArea.recieveMessage("Entered Chatterbox "+setup['chat-room']+" Chat Room...");
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

    // ----------------------------------
    // SEND MESSAGE
    // ----------------------------------
    function send_a_message(message) {
        if (!message) return;

        pubnub.publish({
            channel  : setup['chat-room'],
            message  : { text : message, senderId: userObject.id, senderFbId: userObject.fbId, time: moment().format('YYYY-MM-DD, HH:mm:ss')},
            callback : function(info) {
                if (!info[0]) setTimeout(function() {
                    send_a_message(message)
                }, 2000 );
            }
        });
    }

	var chat_window = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Group Chat",
		barColor: '#6d0a0c',
		tabBarHidden: true
	});

	var headerView = Ti.UI.createView({
		top: 0,
		left:0,
		height: 90,
		backgroundColor: 'pink'
	});
	
	var headerLabel = Ti.UI.createLabel({
		text: 'Lost the Finale',
		top: 5,
		left: 5,
		width: 'auto',
		height: 25, 
		font: { fontSize: 20, fontFamily: 'Helvetica Neue' }
	});	
	
	var scrollView = Ti.UI.createScrollView({
		backgroundColor: 'white',
		contentWidth:600,
		contentHeight:35,
		top:40,
		height:50,
		width:320,
	});
	
	for(var i=0;i<10;i++){
		var dummyImage = Ti.UI.createImageView({
			image:'dummy.png',
			height:50,
			width:50,
			left:i*55+5,
		});
		scrollView.add(dummyImage);	
	}
	
	var chatMessagesTableView = Ti.UI.createTableView({
		top:90,
		height: 290,
		backgroundColor: 'transparent',
		separatorColor: 'transparent',
	});
	
	var loadHistoryMessagesRow = Ti.UI.createTableViewRow({
		height: 30
	});
	var loadHistoryButton = Ti.UI.createButton({
		width: '90%',
		height: 25,
		title: 'Load Earlier Messages'
	});
	loadHistoryMessagesRow.add(loadHistoryButton);
	
	
	var chatInputView = Ti.UI.createView({
		left: 0,
		bottom: 0,
		height: 40,
		width: '100%',
		zIndex: 2,
		backgroundImage: '/images/grain.png',
	});
	var chatInputTextField   = Ti.UI.createTextArea({
        width       : 247,
        height      : 30,
        left        : 4,
        top	        : 5,
        color       : "#111",
        value       : "",
        border      : 1,
        borderRadius: 3,
        font        : {
            fontSize   : 14,
            fontWeight : 'bold'
        },
        suppressReturn: false
    });
	
    // Send Button
    var sendButton = Ti.UI.createButton({
        title         : 'Send',
        top        : 5,
        right         : 4,
        width         : 60,
        height        : 30,
        borderRadius  : 6,
        shadowColor   : "#001",
        shadowOffset  : { x : 1, y : 1 },
        style         : Ti.UI.iPhone.SystemButtonStyle.PLAIN,
        font          : {
            fontSize   : 16,
            fontWeight : 'bold'
        },
        backgroundGradient : {
            type          : 'linear',
            colors        : [ '#058cf5', '#015fe6' ],
            startPoint    : { x : 0, y : 0 },
            endPoint      : { x : 2, y : 50 },
            backFillStart : false
        }
    });
    
	chatInputView.add(chatInputTextField);
	chatInputView.add(sendButton);
	
	headerView.add(headerLabel);
	headerView.add(scrollView);
	chat_window.add(headerView);
	chat_window.add(chatMessagesTableView);
	chat_window.add(chatInputView);
	///////////////////////////////////////////////////////////////////////////////////////////			
	
	var chatData = [loadHistoryMessagesRow]; 	
	chatMessagesTableView.setData(chatData);
	
	//////////////////////////////////////////////////////////////////////////////////
    this.chat_window = chat_window;
    this.pubnub      = pubnub;
    
    loadHistoryMessagesRow.addEventListener('click', function() {
    	// Request History
		if(historyMessages.length == 0) {
			//load it to the history array
			pubnub.history({
			    // Set channel to 'example'
			    channel : setup['chat-room'],
			    // Set limit of returned
			    limit : 100
			    // Set Callback Function when History Returns
			}, function(messages) {
			    // Show History
			    Ti.API.info(messages);
				for(var i = messages.length -1;i >= 0; i--) {
					messageObj = {
						text: messages[i].text,
						senderId: messages[i].senderId,
						senderFbId: messages[i].senderFbId,
						time: messages[i].time
					}
					historyMessages.push(messageObj);
				}
				// add in the last 10 messages
				var numMessagesToLoad = 10; 
				if(messages.length < 10) numMessagesToLoad = messages.length;
				for(var i = 0; i < numMessagesToLoad -1;i++) {
					var historyUserObj = {id:historyMessages[i].senderId,fbId: historyMessages[i].senderFbId,imageUrl: 'https://graph.facebook.com/'+historyMessages[i].senderFbId+'/picture'};
					var isYourMessage = false;
					if(historyMessages[i].senderFbId === userObject.fbId) isYourMessage = true;
					var newChatRow = new ChatMessageTableViewRow(historyMessages[i].text,historyUserObj,isYourMessage);
           			chatMessagesTableView.insertRowAfter(0,newChatRow);
				}
				lastHistoryLoadedIndex = numMessagesToLoad;
			});
		} else {
			//continue...adding from the last inserted
			
		}
    });
    

	chatInputTextField.addEventListener('focus', function() {
		chatInputView.top = 140;
		chatInputView.height = 60;
		chatInputTextField.height = 50;
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
        chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount -1); //scroll to the latest row
        		
		curUserInput = chatInputTextField.value;
		send_a_message(chatInputTextField.value);
	
		chatInputTextField.value = "";
    	chatInputTextField.blur();
    });
    
    return this;
};

