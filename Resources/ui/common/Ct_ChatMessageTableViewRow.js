ChatMessageTableViewRow = function(_chatMessage, _chatOwner, _isASender) {
	var self = Ti.UI.createTableViewRow({
		className: 'ChatMessageRow',
		height: 'auto',
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		bottom: 10
	});
	
	var userPic = Ti.UI.createImageView({
		width: 40,
		height: 40,
		borderColor: 'white',
		borderWidth: 2,
		borderRadius: 20,
		image: _chatOwner.imageUrl
	});
	
	var chatMessageLabel = Ti.UI.createLabel({
		top:5,
		left: 15,
		right: 10,
		bottom: 15,
		textAlign: 'left',
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE, //but cap at length x-->check with the content
		text: _chatMessage,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' }
	});
	
	var backgroundViewForMessage = Ti.UI.createLabel({
		height: Ti.UI.SIZE,
		top: 5
	});
	
	backgroundViewForMessage.add(chatMessageLabel);
	
	if(_isASender) {
		userPic.right = 10;
		backgroundViewForMessage.right = 60;
		backgroundViewForMessage.left = 10;
		backgroundViewForMessage.backgroundImage = 'images/chat/left_quote.png';
	}
	else {
		userPic.left = 10;
		chatMessageLabel.color = 'white',
		backgroundViewForMessage.left = 60;
		backgroundViewForMessage.right = 10;
		backgroundViewForMessage.backgroundImage = 'images/chat/right_quote.png';
	}
	
	self.add(userPic);
	self.add(backgroundViewForMessage);
	
	userPic.addEventListener('click', function() {
		alert('going to profile of user id: '+_chatOwner.id);
	});
	
	return self;
}
module.exports = ChatMessageTableViewRow;
