function ChatMainWindow() {
	var self = Titanium.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/grain.png',
		title: "Chat",
		barColor: '#6d0a0c'
	});
	
	return self;
}

module.exports = ChatMainWindow;