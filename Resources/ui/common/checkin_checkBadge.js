var checkinBadgeView = function(){
	//hard data
	var userID = acs.getUserId();
	var eventID = '4fa8dbe60020442a2b0099f8';
	var CheckinACS = require('acs/checkinACS');
	var CheckinModel = require('model/checkin');
	var PointACS = require('acs/pointACS');	
	var PointModel = require('model/point');
	var BadgeCondition = require('helpers/badgeCondition');
	var checkinPoint = 10;

	var checkinView = Ti.UI.createView({
		backgroundColor: '#858D65'
	});
	var checkinLabel = Ti.UI.createLabel({
		color: '#E7E697',
		text: 'Lets check in',
		top: 30
	});
	var checkinButton = Ti.UI.createButton({
		title: 'check in!',
		top: 60,
		width: 250,
		height: 30
	});
	var checkinCount = Ti.UI.createLabel({
		color: '#BFE983',
		text: 'checkin_count',
		top: 100
	});
	
	checkinButton.addEventListener('click',function(){
		//alert('Checking in..');
		CheckinACS.checkinACS_createCheckin(eventID);
	});
	
	Ti.App.addEventListener('createCheckinDB', createCheckinDBCallBack);
	
	function createCheckinDBCallBack(e){
		Ti.API.info('createCheckinDBCallBack');
		CheckinModel.checkin_create(e.fetchedACheckin);
	};	
		
	Ti.App.addEventListener('oneCheckinUpdated', function(_checkinID){
	Ti.API.info('Your checkin has been update to your database: '+ CheckinModel.checkins_count(userID));
	
	PointACS.pointACS_createPoint(userID,checkinPoint,'checkin',_checkinID.id);
	
	checkinCount.text = CheckinModel.checkins_count(userID);
	BadgeCondition.badgeCondition_check();
	Ti.App.fireEvent('updateHeaderCheckin');
	});	
	
	checkinView.add(checkinCount);
	checkinView.add(checkinLabel);
	checkinView.add(checkinButton);	
return checkinView;
}

module.exports = checkinBadgeView;