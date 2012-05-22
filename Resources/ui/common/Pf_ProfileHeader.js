
var ProfileHeaderView = function(_parentWindow){
				
//CALL DATA
		var userID = '4fa17dd70020440df700950c';
		var CheckinACS = require('acs/checkinACS');		
		var PointACS = require('acs/pointACS');
		var LevelACS = require('acs/levelACS');	
		var myBadgeACS = require('acs/myBadgeACS');
		var CheckinModel = require('model/checkin');
		var PointModel = require('model/point');	
		var LevelModel = require('model/level');
		var FriendsMainWindow = require('ui/common/Pf_friendsMainWindow');
		var CacheHelper = require('helpers/cacheHelper');
					
//CHECK IN//////////////////////////////////////////////////////////////////////
		function checkinDbLoadedCallBack(e){			
			CheckinModel.checkinModel_updateCheckinsFromACS(e.fetchedCheckin);
		};
		Ti.App.addEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
		Ti.App.addEventListener('checkinsDbUpdated', function(){
			columnCheckInCount.text = CheckinModel.checkins_count(userID);
		});
		Ti.App.addEventListener('updateHeaderCheckin',function(){
			columnCheckInCount.text=CheckinModel.checkins_count(userID);
		});
		
		// Using cache		
		CacheHelper.fetchACSDataOrCache('userCheckin'+userID, CheckinACS.checkinACS_fetchedCheckIn, userID, 'checkinsDbUpdated');
	
		
/////POINT ACS/////////////////////////////////////////////	
	PointACS.pointACS_fetchedPoint(userID);
	function pointDbLoadedCallBack(e){
			PointModel.pointModel_updatePointsFromACS(e.fetchedPoint);
	};
		
		Ti.App.addEventListener('pointsDbLoaded',pointDbLoadedCallBack);	
	
///LEVEL ACS///////////////////////////////////////////////////////
		LevelACS.levelACS_fetchedLevel();
		function levelDbLoadedCallBack(e){					
		LevelModel.levelModel_updateLevelFromACS(e.fetchedLevel);};
		Ti.App.addEventListener('levelDbLoaded',levelDbLoadedCallBack);

///BADGE ACS////////////////////////////////////////////////////////
	myBadgeACS.myBadgeACS_fetchedBadge(userID);

///////////////////////////////////////////////////////////////////
	var headerView = Ti.UI.createView({
			backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fffefd', offset: 0.0}, { color: '#d2d1d0', offset: 1.0 } ]}
	});
	
		var totalCheckins=0;
		var	profileDataName= 'Titanium Mick';
		var	profileDataImg = 'images/kuma100x100.png';
	
		var columnCheckInCount = Ti.UI.createLabel({
			text: '',
			height:30,
			font: {fontSize: 26, fontStyle: 'bold'},
			color: '#fff',
			top: 30
		});

		var profilePicture = Ti.UI.createImageView({
			image: profileDataImg,
			width: 90,
			height: 90,
			backgroundColor: 'transparent'
		});
		var profilePictureContain = Ti.UI.createView({
			backgroundColor: '#fff',
			top: 10, left: 10,
			borderWidth: 1,
			width:100, height:100,
			borderColor: '#b1b1b1'
		});
		
		var profileName = Ti.UI.createLabel({
			text: profileDataName,
			top: 5,
			left: 120,
			color: '#3e3e3e',
			width: 'auto',
			height: 30,
			font: { fontWeight: 'bold', fontSize: 15}
		})
		//Facebook login
		var socialNet = Ti.UI.createView({
			top: 40,
			left: 120,
			width: 60,
			height: 70,

		});
		
		fbButton = Ti.UI.createImageView({
			image: 'images/icon/facebook-icon_24x24.png',
			borderRadius: 7,
			bottom:0,
			left: 4
		});
		twButton = Ti.UI.createImageView({
			image: 'images/icon/twitter-icon_24x24.png',
			borderRadius: 7,
			bottom: 0,
			right: 4			
		});
/*		tvBorder = Ti.UI.createImageView({
			image: 'images/icon/tvBorder.png',
			bottom: 2,
			opacity: 0.2			
		});		
*/
		//checkin count
		var columnCheckIn = Ti.UI.createView({
			top: 40,
			left: 250,
			width: 60,
			height: 70,
			backgroundColor: '#d74e55',
			borderRadius: 10,
		});
			//img
			var columnCheckInImage = Ti.UI.createImageView({
				image: 'images/icon/checkin.png',
				top: 10
			});
			//count
		var columnCheckInCount = Ti.UI.createLabel({
			text: '',
			font: {fontSize: 20, fontStyle: 'bold'},
			shadowColor: '#999',
			color: '#fff',
			height: 30,
			bottom:10
		});
				
		//number of friends
		var columnFriend = Ti.UI.createView({
			top: 40,
			left: 185,
			width: 60,
			height: 70,
			backgroundColor: '#a7c63d',
			borderRadius: 10,
		});
		
		
		//img
		var columnFriendImage = Ti.UI.createImageView({
			image: 'images/icon/112-group.png',
			//opacity: 0.6,
			top: 10
		});
		// count
		var columnFriendCount = Ti.UI.createLabel({
			text: '27',
			font: {fontSize: 20, fontStyle: 'bold'},
			color: '#fff',
			shadowColor: '#999',
			height: 30,
			bottom: 10
		});

		columnFriendCount.addEventListener('click',function(){
			_parentWindow.containingTab.open(new FriendsMainWindow(_parentWindow));
		});	
		
	profilePictureContain.add(profilePicture);
//	socialNet.add(tvBorder);
	socialNet.add(fbButton);
	socialNet.add(twButton);
	columnCheckIn.add(columnCheckInImage);
	columnCheckIn.add(columnCheckInCount);
	columnFriend.add(columnFriendImage);
	columnFriend.add(columnFriendCount);
	headerView.add(profilePictureContain);
	headerView.add(profileName);
	headerView.add(socialNet);
	headerView.add(columnCheckIn);
	headerView.add(columnFriend);	

return headerView;

}

module.exports = ProfileHeaderView;
