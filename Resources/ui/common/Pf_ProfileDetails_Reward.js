var ProfileRewardView = function(){
	var rewardView = Ti.UI.createView();

	var detail = Ti.UI.createLabel({
		text: L('Coming Soon...'),
		color: '#fff'
	});
	rewardView.add(detail);
	return rewardView;
}

module.exports = ProfileRewardView;