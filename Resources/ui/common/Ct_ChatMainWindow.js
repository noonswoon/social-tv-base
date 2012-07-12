function ChatMainWindow(_programId) {
	var CheckinGuidelineWindow = require('ui/common/Am_CheckinGuideline');
	var checkinguidelinewin = null;
		
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
	var currentProgramId = _programId;
	
//	var pubnub_chat_window = Ti.App.Chat({
//	    "chat-room" : _programId,
//	    "window"    : {
//			backgroundColor:'transparent'
//	    },
//	    "programId" : _programId
//	});
		

//	return pubnub_chat_window.chat_window;
	
	var self = Titanium.UI.createWindow({
		barImage: 'images/nav_bg_w_pattern.png',
		title: 'Group Chat',
		backgroundColor: 'red'
	});		
	
	return self;
}

module.exports = ChatMainWindow;