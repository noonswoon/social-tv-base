var ProfileRewardView = function(){
	var rewardView = Ti.UI.createView({
	});
/*	
	var detail = Ti.UI.createLabel({
		text: 'Coming Soon...',
		color: '#fff'
	});
	
	rewardView.add(detail);
*/

//DUMB SCREEN FOR CHECK IN -> CHECK BADGE//////////////////////////////
	var Checkin = require('ui/common/checkin_checkBadge');
	var checkin = new Checkin();
	
	rewardView.add(checkin);
//////////////////////////////////////////////////////////////////////	
	
return rewardView;
}

module.exports = ProfileRewardView;