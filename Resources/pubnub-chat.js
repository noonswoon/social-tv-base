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
		barColor: '#6d0a0c'
	});

	var header = Ti.UI.createView({
		top: 0,
		left:0,
		height: 40,
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
	
	header.add(headerLabel);
	chat_window.add(header);

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
	chat_window.add(scrollView);
	
	var chatMessagesTableView = Ti.UI.createTableView({
		top:90,
		height: 250,
		backgroundColor: 'orange'
	});
	
	chat_window.add(chatMessagesTableView);
//	var chatParticipantsScrollView = new ChatParticipantsScrollView();
//	chat_window.add(chatParticipationScrollView);
	
	// textArea.addEventListener('buttonClicked', function(e){
		// // fires when clicked on the send button
	    // curUserInput = e.value;
	    // textArea.addLabel(new Date()+"");
	    // textArea.sendMessage(e.value);
	    // send_a_message(e.value);
	// });

    this.chat_window = chat_window;
    this.pubnub      = pubnub;

    return this;
};

