
var ProfileHeaderView = function(){
				
//CALL DATA FROM ACS
		var userID = '4fa17dd70020440df700950c';
		var CheckinACS = require('acs/checkinACS');		
		var PointACS = require('acs/pointACS');
		var LevelACS = require('acs/levelACS');	
		var myBadgeACS = require('acs/myBadgeACS');
		var CheckinModel = require('model/checkin');
		var PointModel = require('model/point');	
		var LevelModel = require('model/level');	
		var CacheHelper = require('helpers/cacheHelper');
			
		
//CHECK IN//////////////////////////////////////////////////////////////////////
		function checkinDbLoadedCallBack(e){
			Ti.API.info('checkinDbLoadedCallBack');					
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
			Ti.API.info('pointDbLoadedCallBack');
			PointModel.pointModel_updatePointsFromACS(e.fetchedPoint);
			Ti.API.info('DONE:pointDbLoadedCallBack');
	};
		
		Ti.App.addEventListener('pointsDbLoaded',pointDbLoadedCallBack);	
	
///LEVEL ACS///////////////////////////////////////////////////////
		LevelACS.levelACS_fetchedLevel();
		function levelDbLoadedCallBack(e){
		Ti.API.info('levelDbLoadedCallBack');					
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
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]}
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
			borderColor: '#E2E5EE',
		});
		
		var profileName = Ti.UI.createLabel({
			text: profileDataName,
			top: 5,
			left: 120,
			width: 'auto',
			height: 30,
			font: { fontWeight: 'bold', fontSize: 14}
		})
		//Facebook login
		var fbLogin = Ti.UI.createView({
			top: 40,
			left: 120,
			width: 60,
			height: 70,

		});
		
		var fbLoginButton = Ti.UI.createButton({
			width: 60,
			height: 70,
			opacity: 0.8,
			borderRadius: 5,
			backgroundImage: 'images/FBlogin_off.png',
		});

		var fbValue = false;
		
		fbLoginButton.addEventListener('click',function(){
			if(fbValue===false){
			fbLoginButton.backgroundImage = 'images/FBlogin.png';
			fbValue = true;
			alert('You have login to Facebook ' + fbValue);
			}
			else if (fbValue===true)
			{
				fbLoginButton.backgroundImage = 'images/FBlogin_off.png';
				fbValue = false;
			alert('You have logout from Facebook '+ fbValue);
			}
		});	

		//checkin count
		var columnCheckIn = Ti.UI.createView({
			top: 40,
			left: 185,
			width: 60,
			height: 70,
			backgroundColor: '#999',
			opacity: 0.9
		});
			//img
			var columnCheckInImage = Ti.UI.createImageView({
				image: 'images/Location-Large.png',
				opacity: 0.6,
				width: 30,
				height: 30,
				top: 3
			});
			//count
		var columnCheckInCount = Ti.UI.createLabel({
			text: '',
			font: {fontSize: 26, fontStyle: 'bold'},
			color: '#fff',
			height: 30,
			top: 30
		});
				
		//number of friends
		var columnFriend = Ti.UI.createView({
			top: 40,
			left: 250,
			width: 60,
			height: 70,
			backgroundColor: '#999',
			opacity: 0.9
		});
			//img
			var columnFriendImage = Ti.UI.createImageView({
				image: 'images/User.png',
				opacity: 0.6,
				width: 30,
				height: 30,
				top: 3
			});
			// count
			var columnFriendCount = Ti.UI.createLabel({
				text: '27',
				font: {fontSize: 26, fontStyle: 'bold'},
				color: '#fff',
				height: 30,
				top: 30
			});
			
	profilePictureContain.add(profilePicture);
	fbLogin.add(fbLoginButton);
	columnCheckIn.add(columnCheckInImage);
	columnCheckIn.add(columnCheckInCount);
	columnFriend.add(columnFriendImage);
	columnFriend.add(columnFriendCount);
	headerView.add(profilePictureContain);
	headerView.add(profileName);
	headerView.add(fbLogin);
	headerView.add(columnCheckIn);
	headerView.add(columnFriend);	

return headerView;

}

module.exports = ProfileHeaderView;
