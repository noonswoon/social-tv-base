function ChatMainWindow(_program) {

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
	    "chat-room" : _program.programId,
	    "window"    : {
			backgroundColor:'transparent'
	    },
	    "programId" : _program.programId,
	    "programName": _program.programName
	});
		

	return pubnub_chat_window.chat_window;
}

module.exports = ChatMainWindow;