// ----------------------------------
// INIT PUBNUB
// ----------------------------------
var pubnub = require('pubnub').init({
    publish_key   : 'pub-5d5a8d08-52e1-4011-b632-da2a91d6a2b9',
    subscribe_key : 'sub-de622063-9eb3-11e1-8dea-0b2d0bf49bb9',
    ssl           : false,
    origin        : 'pubsub.pubnub.com'
});

//Integrating with SMSView module
Titanium.SMSView = require('ti.smsview');

Ti.App.Chat = function(setup) {
    
    var curUserInput = "";
    // ----------------------------------
    // LISTEN FOR MESSAGES
    // ----------------------------------
    pubnub.subscribe({
        channel  : setup['chat-room'],
        connect  : function() {
            textArea.recieveMessage("Entered Chatterbox "+setup['chat-room']+" Chat Room...");
        },
        callback : function(message) {
        	Ti.API.info('message from sender: '+curUserInput);
        	//since pubnub is a broadcaster, sender will receive his own message as well
        	//prevent from having the user sees his own message when it got broadcasted
        	if(message.text !== curUserInput) {
            	textArea.recieveMessage(message.text);
           }
        },
        error : function() {
        	Ti.API.info('Lost connection...');
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

	var buttonBar = Ti.UI.createButtonBar({
		labels:['Recieve','Empty','Get All','Disable','Enable'],
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	});
	
	var headerView = Ti.UI.createView();
	headerView.add(buttonBar);
	
	var chat_window = Ti.UI.createWindow({
		titleControl:buttonBar,
		orientationModes:[1,2,3,4]
	});
	
	var textArea = Ti.SMSView.createView({
		//maxLines:6,				// <--- Defaults to 4
		//minLines:2,				// <--- Defaults to 1
		backgroundColor: '#dae1eb',	// <--- Defaults to #dae1eb
		//assets: 'images/chat',			// <--- Defauls to nothing, smsview.bundle can be placed in the Resources dir
		// sendColor: 'Green',		// <--- Defaults to "Green"
		// recieveColor: 'White',	// <--- Defaults to "White"
		// selectedColor: 'Blue',	// <--- Defaults to "Blue"
		// editable: true,			// <--- Defautls to true, do no change it
		// animated: false,			// <--- Defaults to true
		// buttonTitle: 'Something',	// <--- Defaults to "Send"
		// font: { fontSize: 12 ... },	// <--- Defaults to... can't remember
		// autocorrect: false,		// <--- Defaults to true
		// textAlignment: 'left',	// <--- Defaulst to left
		// textColor: 'blue',		// <--- Defaults to "black"
		returnType: Ti.SMSView.RETURNKEY_DONE, // <---- Defaults to Ti.SMSView.RETURNKEY_DEFAULT
		camButton: false,				// <--- Defaults to false
		hasTab:true				// <--- Defaults to false			
	});

	chat_window.add(textArea);
	
	buttonBar.addEventListener('click', function(e){
		switch(e.index){
			case 0:	textArea.recieveMessage('Hello World!'); break;
			case 1: textArea.empty(); break;
			case 2: Ti.API.info(textArea.getAllMessages()); break;
			
			// the camera button dissable property:
				// case 3: textArea.camButtonDisabled = true; break;
				// case 4: textArea.setCamButtonDisabled(false); break; 			
			case 3: textArea.camButtonDisabled = true; break;
			case 4: textArea.setCamButtonDisabled(false); break;
		}
	});
	
	textArea.addEventListener('click', function(e){
		if(e.scrollView){
			textArea.blur();
		}
	});
	
	textArea.addEventListener('buttonClicked', function(e){
		// fires when clicked on the send button
	    curUserInput = e.value;
	    textArea.addLabel(new Date()+"");
	    textArea.sendMessage(e.value);
	    send_a_message(e.value);
	});

    this.chat_window = chat_window;
    this.pubnub      = pubnub;

    return this;
};

