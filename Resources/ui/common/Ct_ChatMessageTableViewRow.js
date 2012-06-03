ChatMessageTableViewRow = function(_chatMessage, _chatOwner, _isASender) {
	var self = Ti.UI.createTableViewRow({
		className: 'ChatMessageRow',
		height: 'auto',
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});
	
	var userPic = Ti.UI.createImageView({
		top:5,
		width: 30,
		height: 30,
		borderRadius: 15,
		image: _chatOwner.imageUrl
	});
	
	var chatMessageLabel = Ti.UI.createLabel({
		top:5,
		left: 5,
		right: 5,
		bottom: 5,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE, //but cap at length x-->check with the content
		text: _chatMessage,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
	});
	
	var backgroundViewForMessage = Ti.UI.createLabel({
		height: Ti.UI.SIZE,
		backgroundColor: 'green',
		top: 5,
		borderRadius: 3,
		borderWidth: 1,
		borderColor: 'gray'	
	});
	
	backgroundViewForMessage.add(chatMessageLabel);
	
	if(_isASender) {
		userPic.right = 5;
		backgroundViewForMessage.right = 45;
		backgroundViewForMessage.backgroundColor = 'green';
	}
	else {
		userPic.left = 5;
		backgroundViewForMessage.left = 45;
		backgroundViewForMessage.backgroundColor = 'orange';
	}
	
	self.add(userPic);
	self.add(backgroundViewForMessage);
	
	userPic.addEventListener('click', function() {
		alert('going to profile of user id: '+_chatOwner.id);
	});
	
	return self;
}
module.exports = ChatMessageTableViewRow;
