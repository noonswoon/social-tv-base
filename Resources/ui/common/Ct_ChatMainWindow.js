function ChatMainWindow(_program) {

    // -------------------------------------------------------------------------
	// INCLUDE PUBNUB CHAT MODULE -- ALL the Chatterbox Chat UI is in pubnub-chat.js
	// -------------------------------------------------------------------------
	Ti.include('./pubnub-chat.js');
	
	// -------------------------------------------------------------------------
	// CREATE PUBNUB CHAT WINDOW
	// -------------------------------------------------------------------------
	//
	// Returns an Object with Titanium Window Inside
	//
	var pubnub_chat_window = Ti.App.Chat({
	    "chat-room" : 'my-random-conversation',//_program.programTitle,
	    "window"    : {
	        title           : 'My Chat Room',        
			barColor: '#6d0a0c',
			backgroundColor:'transparent',
			backgroundImage: '/images/grain.png',
	    }
	});
		

	return pubnub_chat_window.chat_window;
}

module.exports = ChatMainWindow;