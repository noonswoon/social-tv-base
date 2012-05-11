
var ProfileHeaderView = function(){
				
///////////////////////////////////////////////
//CALL DATA FROM ACS
		var userID = '4fa17dd70020440df700950c';
		var CheckinACS = require('lib/checkinACS');		
		var CheckinModel = require('model/checkin');	
		
		//UI Stuff
		var columnCheckInCount = Ti.UI.createLabel({
				text: '',
				font: {fontSize: 26, fontStyle: 'bold'},
				color: '#fff',
				top: 30
			});
			
		//var totalScore =0;
		var totalCheckins=0;
		var	profileDataName= 'Titanium Mick';
		var	profileDataImg = 'images/kuma100x100.png';
			
		function checkinDbLoadedCallBack(e){
			alert('checkinDbLoadedCallBack');
			CheckinModel.checkinModel_updateCheckinsFromACS(e.fetchedCheckin);
			alert('DONE:checkinDbLoadedCallBack');
		};
		
		Ti.App.addEventListener('checkinDbLoaded',checkinDbLoadedCallBack);
		Ti.App.addEventListener('checkinsDbUpdated', function(){
		//	totalScore = CheckinModel.checkin_sumScore();
		//	columnCheckInCount.text = totalScore;
			totalCheckins = CheckinModel.checkins_count();
			columnCheckInCount.text = totalCheckins;
		
		});
		
		CheckinACS.checkinACS_fetchedCheckIn(userID);

		//test Data
				
//////////////////////////////////////////////	
	var headerView = Ti.UI.createView({
				backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]}
	});

		var profilePicture = Ti.UI.createImageView({
			image: profileDataImg,
			//top: 10, left: 10,
			width: 90,
			height: 90,
			//borderWidth: 5,
			//borderColor: '#fff',
			backgroundColor: '#E2E5EE'
		});
		var profilePictureContain = Ti.UI.createView({
			backgroundColor: '#fff',
			top: 10, left: 10,
			borderWidth: 1,
			width:100, height:100,
			borderColor: '#E2E5EE',
		});
		
		var profileName = Ti.UI.createLabel({
			text: profileDataName, //name
			top: 5,
			left: 120,
			width: 'auto',
			height: 30,
			font: { fontWeight: 'bold', fontSize: 14}
		})
		//switch: login via ?
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
/*	fbLoginButton.addEventListener('click',function(){

			if (fbLoginButton.backgroundImage = 'images/FBlogin.png'){
				fbLoginButton.backgroundImage = 'images/FBlogin_off.png',
			alert('You have logout from Facebook')
			}
		});
*/		
		
		fbLogin.add(fbLoginButton);

		//number of checkin
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

			
		//number of friends
		var columnFriend = Ti.UI.createView({
			top: 40,
			left: 250,
			width: 60,
			height: 70,
			backgroundColor: '#999',
			opacity: 0.9
		});
			//	img
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
				top: 30
			});
	profilePictureContain.add(profilePicture);
	headerView.add(profilePictureContain);
	headerView.add(profileName);
	headerView.add(fbLogin);
		columnCheckIn.add(columnCheckInImage);
		columnCheckIn.add(columnCheckInCount);
	headerView.add(columnCheckIn);
		columnFriend.add(columnFriendImage);
		columnFriend.add(columnFriendCount);
	headerView.add(columnFriend);		

return headerView;

}

module.exports = ProfileHeaderView;
