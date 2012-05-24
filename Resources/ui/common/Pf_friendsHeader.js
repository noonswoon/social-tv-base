FriendsHeaderView = function(_friend){
	
//CALL DATA
		var CheckinACS = require('acs/checkinACS');		
		var myBadgeACS = require('acs/myBadgeACS');
		var CheckinModel = require('model/checkin');	
		var FriendsMainWindow = require('ui/common/Pf_friendsMainWindow');
		var CacheHelper = require('helpers/cacheHelper');
					
//CHECK IN//////////////////////////////////////////////////////////////////////
		function checkinDbLoadedCallBack(e){			
			CheckinModel.checkinModel_updateCheckinsFromACS(e.fetchedCheckin);
		};
		Ti.App.addEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
		Ti.App.addEventListener('checkinsDbUpdated', function(){
			columnCheckInCount.text = CheckinModel.checkins_count(_friend.friend_id);
		});
		Ti.App.addEventListener('updateHeaderCheckin',function(){ ///confuse ????????
			columnCheckInCount.text=CheckinModel.checkins_count(_friend.friend_id);
		});
		
		// Using cache		
		CacheHelper.fetchACSDataOrCache('userCheckin'+_friend.friend_id, CheckinACS.checkinACS_fetchedCheckIn, _friend.friend_id, 'checkinsDbUpdated');
		
///BADGE ACS////////////////////////////////////////////////////////
	myBadgeACS.myBadgeACS_fetchedBadge(_friend.friend_id);

///////////////////////////////////////////////////////////////////
	var headerView = Ti.UI.createView({
			backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fffefd', offset: 0.0}, { color: '#d2d1d0', offset: 1.0 } ]}
	});
	
		var totalCheckins=0;
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
			text: _friend.first_name,
			top: 5,
			left: 120,
			color: '#3e3e3e',
			width: 'auto',
			height: 30,
			font: { fontWeight: 'bold', fontSize: 15}
		})
		
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
		
		

	profilePictureContain.add(profilePicture);
	columnCheckIn.add(columnCheckInImage);
	columnCheckIn.add(columnCheckInCount);
	columnFriend.add(columnFriendImage);
	columnFriend.add(columnFriendCount);
	headerView.add(profilePictureContain);
	headerView.add(profileName);
	headerView.add(columnCheckIn);
	headerView.add(columnFriend);	

return headerView;
}
module.exports = FriendsHeaderView;
