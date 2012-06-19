var ProfileStatsView = function(_parentWindow, _userProfile, _status){
	var LeaderACS = require('acs/leaderBoardACS');
	var PointModel = require('model/point');
	var LevelModel = require('model/level');
	var FriendModel = require('model/friend');
	
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	var curId = _userProfile.id;
		
	var profileStats = Ti.UI.createView({
		backgroundColor: 'transparent',
		bottom: 10,
		height: 'auto',
	});
	
	var expSec = Ti.UI.createView({
		top: 5
	});
	
	var leaderSec = Ti.UI.createView({
			top:50
	});
	
	//experience point
	var expLabel = Ti.UI.createLabel({
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		textAlign: 'right',
		top: 0,
		height:30,
		right: 10
	});
		
	var myLevelLabel = Ti.UI.createLabel({
		text: '',
		font: {fontSize: 16, fontWeight: 'bold'},
		color: '#53b4df',
		textAlign: 'left',
		height:30,
		top: 0,
		left: 10,
	});
		
    var expBar = Ti.UI.createSlider({
		top:25,
		width:300,
		min:0,
		thumbImage: 'images/slider/thumb_bar.png',
		leftTrackImage:'images/slider/slider_bar.png',
		rightTrackImage:'images/slider/slider_emptybar.png',
		touchEnabled: false,
		backgroundColor: 'transparent',
    });
    
	var expBar_light = Ti.UI.createSlider({
		top:25,
		width:300,
		min:0,
		thumbImage: 'images/slider/thumb_nextbar.png',
		leftTrackImage:'images/slider/slider_nextbar.png',
		rightTrackImage:'images/slider/slider_lightbar.png',
		touchEnabled: false,
    });
    
	//sort from max totalPoint	
	function totalPointSort(a,b) {
		return b.totalPoint - a.totalPoint;
	}

	var updateExpBar = function() {
		var totalPoints = PointModel.pointModel_fetchMyPoint(curId);
		var profileDataLevelUp = LevelModel.level_nextLevel(totalPoints);
		expLabel.text = totalPoints + '/' + profileDataLevelUp;
		expBar.max = profileDataLevelUp;
		expBar_light.max = profileDataLevelUp;
		expBar.value = totalPoints;
		
		if(expBar.value === 0) expBar.thumbImage = 'images/empty_thumb.png';
		else expBar.thumbImage = 'images/slider/thumb_bar.png';
		
		myLevelLabel.text = LevelModel.level_checkLevel(totalPoints);
		expBar_light.value = (totalPoints+5);
	}

	var leaderLabel = Ti.UI.createLabel({
		text:'LEADERBOARD',
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		height:30,
		textAlign: 'left',
		left: 10,
		top:0
	});

	var leaderTable = Ti.UI.createTableView({
		top: 30,
		borderRadius: 10,
		scrollable:false,
		disableBounce: true,
		width: 290,
		height: 'auto',
	});
		
	var createLeaderBoardView = function(leaderBoardData) {
		Ti.API.info('createLeaderBoardView');
		var myIndex = 0;
		userRankInfo = [];
		for(i=0; i<leaderBoardData.length; i++) {
			if(leaderBoardData[i].user_id===curId) {
				myIndex=i;
				break;
			}
		};
		for(var i=0; i<leaderBoardData.length; i++) {
			if(leaderBoardData[i].totalPoint <= 0) break; //not including people who get 0
			
			var userRank = Ti.UI.createTableViewRow({
				backgroundColor: '#fff',
				height: 45,
				selectedBackgroundColor: '#d2eaff',
				color: '#666'
			});
				
			var userRankNo = Ti.UI.createLabel({
				text: '#' + (i+1),
				left: 15,
				height:30,
				font: { fontWeight: 'bold', fontSize: 14},
				color: '#666'
			});
			
			var userRankPicture = Ti.UI.createImageView({
				height: 36,
				width: 36,
				borderRadius: 5,
				left: 40
			});
			
			userRank.user_id = leaderBoardData[i].user_id;
							
			if(leaderBoardData[i].fb_id) {
				userRankPicture.image = acs.getUserImageNormalOfFbId(leaderBoardData[i].fb_id);
			}
			else userRankPicture.image = "images/kuma100x100.png";
			
			var userRankName = Ti.UI.createLabel({
				text: leaderBoardData[i].name,
				left: 90,
				width: 150,
				height: 20,
				font: {fontWeight: 'bold', fontSize: 14},
				color: '#666'
			});

			var userRankScore = Ti.UI.createLabel({
				text: leaderBoardData[i].totalPoint, 
				//top: 10,
				right: 5,
				width: 'auto',
				textAlign: 'right',
				height: 30,
				font: {fontWeight: 'bold', fontSize: 26},
				color: '#666'
			});
		
			if(i===myIndex) {
				userRank.selectedBackgroundColor = '#fff';
				userRankNo.color = '#000';
				userRankName.color = '#000';
				userRankScore.color = '#000';
			};			
			
			userRank.add(userRankNo);
			userRank.add(userRankPicture);
			userRank.add(userRankName);
			userRank.add(userRankScore);
			userRankInfo.push(userRank);
		}

		leaderTable.height = (userRankInfo.length)*45;
		leaderTable.data = userRankInfo;
		leaderTable.bottom = 10;
		profileStats.height = expSec.height + leaderSec.height;
		
		leaderTable.addEventListener('click',function(e) {
			if(e.rowData.user_id!==curId) {
				_parentWindow.containingTab.open(new ProfileMainWindow(e.rowData.user_id,"friend"));
			}
		});
	} //end of function: createLeaderBoardView
	
	function friendDbLoadedCallBack(e){
		FriendModel.friendModel_updateFriendsFromACS(e.fetchedFriends);
	}
	
	function leaderBoardLoadedCallBack(e) {
		PointModel.pointModel_updateLeadersFromACS(e.fetchedLeader);
	}
	
	Ti.App.addEventListener('friendsLoaded',friendDbLoadedCallBack);
	Ti.App.addEventListener('leaderBoardLoaded',leaderBoardLoadedCallBack);

	Ti.App.addEventListener('friendsDbUpdated',function() {	
		var rankList = [];
		rankList[0] = _userProfile.id;
		var myFriends = FriendModel.friendModel_fetchFriend(rankList[0]);
		for(var i = 0; i< myFriends.length;i++) {
			var curUser = myFriends[i].friend_id;
			rankList.push(curUser);
		};
		LeaderACS.leaderACS_fetchedRank(rankList);
	});
		 
	Ti.App.addEventListener('leaderDbUpdated',function() {
		var leaderBoardData = PointModel.pointModel_fetchRank();
    	leaderBoardData.sort(totalPointSort);
    	createLeaderBoardView(leaderBoardData);
    	updateExpBar();
	});
	
	updateExpBar();

	expSec.add(expLabel);
	expSec.add(myLevelLabel);
	expSec.add(expBar_light);
	expSec.add(expBar);
	profileStats.add(expSec);
	
	if(_status==="me") {
		leaderSec.add(leaderLabel);
		leaderSec.add(leaderTable);
		profileStats.add(leaderSec);
    }

	return profileStats;
}

module.exports = ProfileStatsView;