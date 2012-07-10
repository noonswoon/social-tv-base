function ChatMainWindow(_programId) {
//	var CheckinACS = require('acs/checkinACS');
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

	var tableView = Ti.UI.createTableView({
		backgroundColor: 'transparent',
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE
	});
	tableView.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#d2d1d0', offset: 0.0}, { color: '#fffefd', offset: 1.0 }]
	};	
	
	var loadCheckinProgram = function(e) {
		var tableViewData = [];
		var ChatTableViewRow = require('ui/common/Ct_ChatTableViewRow');
		Ti.API.info("loadCheckinProgram// "+e.fetchedCheckin);
		var todayCheckins = e.fetchedCheckin;
		for(var i=0;i<todayCheckins.length;i++) {
			var programRow = new ChatTableViewRow(todayCheckins[i]);
			tableViewData.push(programRow);	
		}
		tableView.data = tableViewData;
	}
	
	Ti.App.addEventListener('checkinDbLoaded',loadCheckinProgram);
	
	self.add(tableView);
	return self;
}

module.exports = ChatMainWindow;