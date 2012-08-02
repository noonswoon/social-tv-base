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
	
	var backgroundViewForMessage = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		top: 5
	});
	
	var chatLabelWidth = chatMessageLabel.toImage().width;
	
	backgroundViewForMessage.add(chatMessageLabel);
	
	//0-30
	//30-100
	//>100
	
	if(_isASender) {
		userPic.right = 10;
		chatMessageLabel.color = 'white',
		backgroundViewForMessage.right = 60;
		if(chatLabelWidth <= 30){
			backgroundViewForMessage.backgroundImage = 'images/chat/blue0_quote.png';
		}
		else if(chatLabelWidth <= 100){
			backgroundViewForMessage.backgroundImage = 'images/chat/blue30_quote.png';
		}
		else{
			backgroundViewForMessage.backgroundImage = 'images/chat/blue_quote.png';
		}

	}
	else {
		userPic.left = 10;
		chatMessageLabel.color = 'black',
		backgroundViewForMessage.left = 60;
		if(chatLabelWidth <= 30){
			backgroundViewForMessage.backgroundImage = 'images/chat/gray0_quote.png';
		}
		else if(chatLabelWidth <= 100){
			backgroundViewForMessage.backgroundImage = 'images/chat/gray30_quote.png';
		}
		else{
			backgroundViewForMessage.backgroundImage = 'images/chat/gray_quote.png';
		}

	}
	
	self.add(userPic);
	self.add(backgroundViewForMessage);
	
	return self;
}
module.exports = ChatMessageTableViewRow;
