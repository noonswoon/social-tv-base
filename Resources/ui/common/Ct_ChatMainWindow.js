function ChatMainWindow(_programId) {

    // -------------------------------------------------------------------------
	// INCLUDE PUBNUB CHAT MODULE -- ALL the Chatterbox Chat UI is in pubnub-chat.js
	// -------------------------------------------------------------------------
	 Ti.include('./pubnub-chat.js');
	 
	 //Google Analytics
	 Titanium.App.Analytics.trackPageview('/Chat');
	
	// -------------------------------------------------------------------------
	// CREATE PUBNUB CHAT WINDOW
	// -------------------------------------------------------------------------
	//
	// Returns an Object with Titanium Window Inside
	//
	var pubnub_chat_window = Ti.App.Chat({
	    "chat-room" : _programId,
	    "window"    : {
			backgroundColor:'transparent'
	    },
	    "programId" : _programId
	});
		

	return pubnub_chat_window.chat_window;
}

module.exports = ChatMainWindow;