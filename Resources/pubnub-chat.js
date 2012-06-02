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
var userObject = {id:'aaaa',imageUrl: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-snc4/41563_202852_9270_q.jpg'}
	
Ti.App.Chat = function(setup) {
    
    var curUserInput = "";
    // ----------------------------------
    // LISTEN FOR MESSAGES
    // ----------------------------------
    pubnub.subscribe({
        channel  : setup['chat-room'],
        connect  : function() {
            Ti.API.info("connecting...");
            //textArea.recieveMessage("Entered Chatterbox "+setup['chat-room']+" Chat Room...");
        },
        callback : function(message) {
        	//since pubnub is a broadcaster, sender will receive his own message as well
        	//prevent from having the user sees his own message when it got broadcasted
        	if(message.text !== curUserInput) {
            	//textArea.recieveMessage(message.text);
           		var newChatRow = new ChatMessageTableViewRow(message.text,userObject,false);
           		chatMessagesTableView.insertRowBefore(0,newChatRow);
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
            message  : { text : message, color : 'pink' },
            callback : function(info) {
                if (!info[0]) setTimeout(function() {
                    send_a_message(message)
                }, 2000 );
            }
        });
    }

    // ----------------------------------
    // CREATE BASE UI TAB AND ROOT WINDOW
    // ----------------------------------    

	// var buttonBar = Ti.UI.createButtonBar({
		// labels:['Recieve','Empty','Get All','Disable','Enable'],
		// style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	// });
	
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
	
	var chatData = []; 
	var chatTableViewRow1 = new ChatMessageTableViewRow('Hello world, how are you doing there?',userObject,false);
	var chatTableViewRow2 = new ChatMessageTableViewRow('Hello world, testing comment testing comment testing comment :)',userObject,true);
	var chatTableViewRow3 = new ChatMessageTableViewRow('Hellaluya..I love my life. And Chatterbox will hit the roof',userObject,false);
	
	chatData.push(chatTableViewRow1);
	chatData.push(chatTableViewRow2);
	chatData.push(chatTableViewRow3);
	
	chatMessagesTableView.setData(chatData);
	
	//////////////////////////////////////////////////////////////////////////////////
    this.chat_window = chat_window;
    this.my_color    = 'pink';
    this.pubnub      = pubnub;

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
        chatMessagesTableView.insertRowBefore(0,newChatRow);
        		
		curUserInput = chatInputTextField.value;
		send_a_message(chatInputTextField.value);
	
		chatInputTextField.value = "";
    	chatInputTextField.blur();
    });
    
    return this;
};

