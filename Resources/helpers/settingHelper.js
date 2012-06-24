exports.setFacebookShare = function(_shareSetting) {
	Ti.App.Properties.setInt('facebookShare',_shareSetting);
}

exports.getFacebookShare = function() {
	if(Ti.App.Properties.hasProperty('facebookShare'))
		return Ti.App.Properties.getInt('facebookShare');
	else {
		Ti.App.Properties.setInt('facebookShare',true);
		return true;
	}
}

exports.setPushComment = function(_pushCommentSetting) {
	Ti.App.Properties.setInt('pushComment',_pushCommentSetting);
}

exports.getPushComment = function() {
	if(Ti.App.Properties.hasProperty('pushComment'))
		return Ti.App.Properties.getInt('pushComment');
	else {
		Ti.App.Properties.setInt('pushComment',true);
		return true;
	}
}

exports.setFriendsCheckin = function(_friendsCheckinSetting) {
	Ti.App.Properties.setInt('friendsCheckin',_friendsCheckinSetting);
}

exports.getFriendsCheckin = function() {
	if(Ti.App.Properties.hasProperty('friendsCheckin'))
		return Ti.App.Properties.getInt('friendsCheckin');
	else {
		Ti.App.Properties.setInt('friendsCheckin',true);
		return true;
	}
}


