var ProfileStatsView = function(){
	var PointModel = require('model/point');
	var LevelModel = require('model/level');
	var friendModel = require('model/friend');
	
	var leaderBoardData = [];
	var userRankInfo = [];
	var	ProfileDataLevelUp;
	
	var user_id = acs.getUserId();

	var profileStats = Ti.UI.createView({
		backgroundColor: 'transparent',
		bottom: 10,
		height: 'auto',
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
		text: 'First Login? Nice to meet you:)',
		font: {fontSize: 16, fontWeight: 'bold'},
		color: '#53b4df',
		textAlign: 'left',
		height:30,
		top: 0,
		left: 10,
		shadowColor: '#333'		
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
    
/////////////////////////////////////////////////////////////////////////////
	//sort from max totalPoint	
	function totalPointSort(a,b) {
		return b.totalPoint - a.totalPoint;
	}


	Ti.App.addEventListener('LeaderDbUpdated',function(){
		Ti.API.info('Leaderboard updated into database /model/point');
		//UPDATE DATA IN EXP SECTION
		totalPoints = PointModel.pointModel_fetchMyPoint(user_id);
		ProfileDataLevelUp = LevelModel.level_nextLevel(totalPoints);
		expLabel.text= totalPoints + '/' + ProfileDataLevelUp;
		expBar.max = ProfileDataLevelUp;
		expBar_light.max = ProfileDataLevelUp;
		expBar.value = totalPoints;
		if(expBar.value === 0){
   			expBar.thumbImage = 'images/empty_thumb.png';
   		};
		myLevelLabel.text = LevelModel.level_checkLevel(totalPoints);
		expBar_light.value = (totalPoints+10);
		leaderBoardData = PointModel.pointModel_fetchRank();
    	leaderBoardData.sort(totalPointSort);
    	createLeaderBoardView();
	});

	var leaderLabel = Ti.UI.createLabel({
		text: 'LEADERBOARD',
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		height:30,
		textAlign: 'left',
		left: 10,
		top:0
	});

	var createLeaderBoardView = function(){
		var myIndex = 0;
		userRankInfo =[];
		for(i=0; i<leaderBoardData.length; i++){
			if(leaderBoardData[i].user_id===user_id){
				myIndex=i;
				break;
			}
		};	
		Ti.API.info('myIndex: ' + myIndex);

		for(var i=0; i<leaderBoardData.length; i++){
			if(leaderBoardData[i].totalPoint <= 0) break; //not including people who get 0
			
			var userRank = Ti.UI.createTableViewRow({
				backgroundColor: '#fff',
				//width: 290,
				height: 45,
				selectedBackgroundColor: '#fff',
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
				image: acs.getUserImageNormal(),
				height: 36,
				width: 36,
				borderRadius: 5,
				left: 40
				});
			
			var userRankName = Ti.UI.createLabel({
				text: leaderBoardData[i].name,
				left: 90,
				width: 150,
				height: 30,
				font: { fontWeight: 'bold', fontSize: 14},
				color: '#666'
				});

			var userRankScore = Ti.UI.createLabel({
				text: leaderBoardData[i].totalPoint, 
				//top: 10,
				right: 5,
				width: 'auto',
				textAlign: 'right',
				height: 30,
				font: { fontWeight: 'bold', fontSize: 26},
				color: '#666'
			});
		
			if(i===myIndex){
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
		Ti.API.info('hey dog');
		leaderTable.height = (userRankInfo.length)*45;
		leaderTable.data = userRankInfo;
		leaderTable.bottom = 10;
		profileStats.height = expSec.height + leaderSec.height;
	};
	
	var leaderTable = Ti.UI.createTableView({
		top: 30,
		borderRadius: 10,
		scrollable:true,
		disableBounce: true,
		width: 290,
		height: 'auto',
	});		

	var expSec = Ti.UI.createView({
		top: 5
	});
	var leaderSec = Ti.UI.createView({
			top:50
	});
		
		expSec.add(expLabel);
		expSec.add(myLevelLabel);
		expSec.add(expBar_light);
		expSec.add(expBar);
		profileStats.add(expSec);
		leaderSec.add(leaderLabel);
		leaderSec.add(leaderTable);
		profileStats.add(leaderSec);

		if(leaderBoardData.length===0){
			leaderSec.visible = false;
		};

	return profileStats;
}

module.exports = ProfileStatsView;