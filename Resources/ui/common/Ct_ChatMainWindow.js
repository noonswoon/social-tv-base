function ChatMainWindow(_programId) {

	var TVProgram = require('model/tvprogram');
	var CheckinGuidelineView = require('ui/common/Am_CheckinGuideline');
	var checkinguidelineview = null;
		
    // INCLUDE PUBNUB CHAT MODULE -- ALL the Chatterbox Chat UI is in pubnub-chat.js
	Ti.include('./pubnub-chat.js'); 
	Titanium.App.Analytics.trackPageview('/Chat'); //Google Analytics
	 
	var currentProgramId = _programId;
	
	var self = Titanium.UI.createWindow({
		barImage: 'images/nav_bg_w_pattern.png',
		title: L('Group Chat')
	});	
	
	var programsTableView = Ti.UI.createTableView({
		backgroundColor: 'transparent',
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE
	});
		
	programsTableView.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#d2d1d0', offset: 0.0}, { color: '#fffefd', offset: 1.0 }]
	};	
	
	self._updatePageContent = function(_newProgramId /* unused variable but for consistency sake */) {
		programsTableView.data = []; //reset programsTableView data
		
		//pull data from tvprogram where mycurentcheckinprograms are
		var currentCheckinPrograms = UserCheckinTracking.getCurrentCheckinPrograms();
		var todayCheckinPrograms = TVProgram.TVProgramModel_getPrograms(currentCheckinPrograms);
		var programsTableViewData = [];
		var ChatTableViewRow = require('ui/common/Ct_ChatTableViewRow');
		for(var i = 0; i < todayCheckinPrograms.length; i++) {
			var programRow = new ChatTableViewRow(todayCheckinPrograms[i]);
			programsTableViewData.push(programRow);					
		}
		programsTableView.data = programsTableViewData;
		self.add(programsTableView);
	};
	
	if(currentProgramId === '') { //have not checkedin to any program yet
		checkinguidelineview = new CheckinGuidelineView('chat');
		self.add(checkinguidelineview);
		currentProgramId = 'CTB_PUBLIC';
	} else {
		self._updatePageContent();
	}
	
	self._addGuidelineView = function() {
		if(checkinguidelineview === null)
			checkinguidelineview = new CheckinGuidelineView('chat');
		self.add(checkinguidelineview);
	};
	
	self._removeGuidelineView = function() {
		if(checkinguidelineview !== null) {
			self.remove(checkinguidelineview);
			checkinguidelineview = null;
		}		
	};	
	
	programsTableView.addEventListener('click',function(e){
		var pubnub_chat_window = Ti.App.Chat({
		    "chat-room" : e.row.program_id,
		    "window"    : {backgroundColor:'transparent'},
		    "programId" : e.row.program_id
		});
		self.containingTab.open(pubnub_chat_window.chat_window);
	});

	return self;
}

module.exports = ChatMainWindow;