
var ProfileHeaderView = function(){
//test Data
			var	ProfileDataName= 'Titanium Mick';
			var	ProfileDataImg = 'images/kuma100x100.png';
			var	ProfileDataExp = 30;	
	
	var headerView = Ti.UI.createView({
				backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]}
	});

		var profilePicture = Ti.UI.createImageView({
			image: ProfileDataImg,
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
			text: ProfileDataName, //name
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
				image: 'images/KS_nav_ui.png',
				width: 30,
				height: 30,
				top: 3
			});
			//count
			var columnCheckInCount = Ti.UI.createLabel({
				text: '59',
				font: {fontSize: 26, fontStyle: 'bold'},
				color: '#fff',
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
			//	img
			var columnFriendImage = Ti.UI.createImageView({
				image: 'images/KS_nav_views.png',
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
