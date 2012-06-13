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
var totalHistoryMessages = 0;

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
       		// Ti.API.info("Lost connection...");
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

	var backButton = Ti.UI.createButton({
        backgroundImage:'images/Backbutton.png',
        width:57,height:34
	});

	var chat_window = Ti.UI.createWindow({
		title: "Group Chat",
		barImage: 'images/NavBG.png',
		backgroundImage: 'images/bg.png',
		tabBarHidden: true,
		leftNavButton:backButton
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
		text: 'Lost the Finale',
		left: 10,
		width: 'auto',
		font: { fontSize: 18, fontFamily: 'Helvetica Neue', fontWeight: 'bold' }
	});	
	
	var watchLabel = Ti.UI.createLabel({
		color: '#8c8c8c',
		width: 70,
		height: 50,
		right: 45,
		textAlign: 'right',
		text: 'WATCH',
		font:{fontSize: 11}
	});

	var selectProgramButton = Ti.UI.createButton({
		width: 30,
		height: 30,
		right: 10,
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		image: 'images/icon/dropdownButton.png',
  		borderRadius: 10,
  		borderColor: '#a4a4a4',
  		borderWidth: 1
	});
	
	//Opacity window when picker is shown
	opacityView = Ti.UI.createView({
		opacity : 0.6,
		top : 0,
		height : 180,
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


	var toolbar =  Titanium.UI.createToolbar({
		top:0,
		zIndex: 3,
		items:[cancel,spacer,done]
	});

	var picker = Titanium.UI.createPicker({
		top:43
	});
	picker.selectionIndicator=true;

	var picker_data = [
		Titanium.UI.createPickerRow({title:'John'}),
		Titanium.UI.createPickerRow({title:'Alex'}),
		Titanium.UI.createPickerRow({title:'Marie'}),
		Titanium.UI.createPickerRow({title:'Eva'}),
		Titanium.UI.createPickerRow({title:'James'})
	];

	picker.add(picker_data);

	picker_view.add(toolbar);
	picker_view.add(picker);

	var slide_in =  Titanium.UI.createAnimation({bottom:0});
	var slide_out =  Titanium.UI.createAnimation({bottom:-251});

	selectProgramButton.addEventListener('click',function() {
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
	});
	//////

	var userView = Ti.UI.createView({
		top: 40,
		left:0,
		height: 47,
	});
	
	var scrollView = Ti.UI.createScrollView({
		backgroundImage: 'images/chat/users_onlineBG.png',
		contentWidth:500,
		contentHeight:35,
		top:0,
		height:47,
		width:320
	});
	
	
	for(var i=0;i<10;i++){
		var userDisplayBorder = Ti.UI.createView({
			backgroundImage: 'images/chat/users_display.png',
			width: 36,
			height: 37,
			top:3,
			left:i*40+10
		});
		
		var starTag = Ti.UI.createImageView({
			width: 13,
			height: 11,
			image: 'images/chat/star_tag.png',
			top: 0,
			right: 0,
			zIndex: 2
		});
					
		var dummyImage = Ti.UI.createImageView({
			image:'images/chat/dummy.png',
			top: 2,
			left: 2,
			height:30,
			width:30
		});
		userDisplayBorder.add(dummyImage);	
		userDisplayBorder.add(starTag);
		scrollView.add(userDisplayBorder);
	}
	
	var addFriendView = Ti.UI.createView({
		top: 0,
		width: 65,
		height: 43,
		right: 0,
		backgroundImage: 'images/chat/addfriendBG.png'
	});
	
	var addFriend = Ti.UI.createButton({
		width: 32,
		height: 32,
		right: 8,
		backgroundImage: 'images/chat/addfriend.png'
	});
	addFriendView.add(addFriend);

	var chatMessagesTableView = Ti.UI.createTableView({
		top:90,
		height: 290,
		backgroundColor: 'transparent',
		separatorColor: 'transparent',
	});
	
	var loadHistoryMessagesRow = Ti.UI.createTableViewRow({
		top: 120,
		height: 30,
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
        backgroundImage: 'images/chat/chattextfieldBG.png',
        // suppressReturn: false
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
	selectProgramToolbar.add(watchLabel);
	selectProgramToolbar.add(selectProgramButton);
	userView.add(scrollView);
	userView.add(addFriendView);
	chat_window.add(selectProgramToolbar);
	chat_window.add(userView);
	chat_window.add(chatMessagesTableView);
	chat_window.add(chatInputView);
	chat_window.add(picker_view);
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
				totalHistoryMessages = messages.length;
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
				if(messages.length < 10) {
					numMessagesToLoad = messages.length;
				}
				for(var i = 0; i < numMessagesToLoad -1;i++) {
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
        chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount -1); //scroll to the latest row
        		
		curUserInput = chatInputTextField.value;
		send_a_message(chatInputTextField.value);
	
		chatInputTextField.value = "";
    	chatInputTextField.blur();
    });
    
    return this;
};

