// ----------------------------------
// INIT PUBNUB
// ----------------------------------
var pubnub = require('pubnub').init({
    publish_key   : 'pub-5d5a8d08-52e1-4011-b632-da2a91d6a2b9',
    subscribe_key : 'sub-de622063-9eb3-11e1-8dea-0b2d0bf49bb9',
    ssl           : false,
    origin        : 'pubsub.pubnub.com'
});

var ChatParticipantsScrollView = require('ui/common/Ct_ChatParticipantsScrollView');

Ti.App.Chat = function(setup) {
    
    var curUserInput = "";
    // ----------------------------------
    // LISTEN FOR MESSAGES
    // ----------------------------------
    pubnub.subscribe({
        channel  : setup['chat-room'],
        connect  : function() {
            //textArea.recieveMessage("Entered Chatterbox "+setup['chat-room']+" Chat Room...");
        },
        callback : function(message) {
        	Ti.API.info('message from sender: '+curUserInput);
        	//since pubnub is a broadcaster, sender will receive his own message as well
        	//prevent from having the user sees his own message when it got broadcasted
        	if(message.text !== curUserInput) {
            	//textArea.recieveMessage(message.text);
           }
        },
        error : function() {
        	//Ti.API.info('Lost connection...');
        }
    });

    // ----------------------------------
    // SEND MESSAGE
    // ----------------------------------
    function send_a_message(message) {
        if (!message) return;

        pubnub.publish({
            channel  : setup['chat-room'],
            message  : { text : message, color : this.my_color },
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
	var chatAvatar = Ti.UI.createImageView({
		top:5,
		left: 5,
		width: 28,
		borderRadius: 14,
		image: 'dummy.png'
		
	})
	var chatContent = Ti.UI.createLabel({
		top:5,
		left: 35, //other people comments
		height: 'auto',
		width: 'auto', //but cap at length x-->check with the content
		text: 'Hello world, testing comment',
		backgroundColor: 'orange'
	})
	
	var chatTableViewRow = Ti.UI.createTableViewRow({
		height: 'auto'
	});
	chatTableViewRow.add(chatAvatar);
	chatTableViewRow.add(chatContent);
	chatData.push(chatTableViewRow);
	
	var chat2Avatar = Ti.UI.createImageView({
		top:5,
		right: 5,
		width: 28,
		borderRadius: 14,
		image: 'dummy.png'
		
	})
	var chat2Content = Ti.UI.createLabel({
		top:5,
		right: 35, //other people comments
		height: 'auto',
		width: 240, //but cap at length x-->check with the content
		text: 'Hello world, testing comment  testing comment testing comment testing comment',
		backgroundColor: 'green'
	})
	
	var chatTableViewRow2 = Ti.UI.createTableViewRow({
		height: 'auto'
	});
	
	chatTableViewRow2.add(chat2Avatar);
	chatTableViewRow2.add(chat2Content);
	chatData.push(chatTableViewRow2);
	
	chatMessagesTableView.setData(chatData);
	
	//////////////////////////////////////////////////////////////////////////////////
    this.chat_window = chat_window;
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
		alert("posting: "+chatInputTextField.value);
		chatInputTextField.value = "";
    	chatInputTextField.blur();
    });
    
    return this;
};

