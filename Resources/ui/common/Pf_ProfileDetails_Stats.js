var ProfileStatsView = function(){
	var PointModel = require('model/point');
	var LevelModel = require('model/level');
	var ProfileDataExp;
	var	ProfileDataLevelUp;
	
	//test data			
	var	ProfileDataName= 'Titanium Mick';
	var	ProfileDataImg = 'images/kuma100x100.png';


	var profileStats = Ti.UI.createView({
		backgroundColor: 'transparent',
		bottom: 10,
	});
	
	//experience point
	var expLabel = Ti.UI.createLabel({
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		textAlign: 'right',
		top: 5,
		height:30,
		right: 10
	});
		
	var myLevelLabel = Ti.UI.createLabel({
		text: '',
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#8ee0ff',
		textAlign: 'left',
		height:30,
		top: 5,
		left: 10			
	});
		
	var expBar = Ti.UI.createProgressBar({
		top:23,
	    width:300,
	    height:20,
	    min:0,
	    style:Titanium.UI.iPhone.ProgressBarStyle.DEFAULT
	});

/////////////////////////////////////////////////////////////////////////////
		//ACS
		Ti.App.addEventListener('createPointDB', createPointDBCallBack);
	
		function createPointDBCallBack(e){
		Ti.API.info('createPointDBCallBack');
		PointModel.points_updateNewPoint(e.fetchedPoint);
		};	
		
		Ti.App.addEventListener('updateNewPoint',function(){
			//TODO: สงสัยว่าน่าจะเกิดการ  call event ซ้ำ recheck again
			//alert('updateNewPoint');
			Ti.App.fireEvent('pointsDbUpdated');
		});
		
		Ti.App.addEventListener('pointsDbUpdated', function(){
			Ti.API.info('pointsDBUpdated');
			totalPoints = PointModel.points_sumPoints();
			ProfileDataExp = totalPoints;
			ProfileDataLevelUp = LevelModel.level_nextLevel(ProfileDataExp);
			expLabel.text=ProfileDataExp + '/' + ProfileDataLevelUp;
			expBar.max= ProfileDataLevelUp;
			myRankScore.text = ProfileDataExp;
			expBar.value = ProfileDataExp;
			myLevelLabel.text = LevelModel.level_checkLevel(ProfileDataExp);

		});
					
///////////////////////////////////////////////////////////////////////////

	var leaderLabel = Ti.UI.createLabel({
		text: 'LEADERBOARD',
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		height:30,
		textAlign: 'left',
		left: 10,
		top:0
	});
		
	var userRankInfo = [];
		for(var i=0;i<5;i++){
			var userRank = Ti.UI.createTableViewRow({
				backgroundColor: '#fff',
				width: 300,
				height: 60,
				selectedBackgroundColor: '#fff'
				});
			var userRankNo = Ti.UI.createLabel({
				text: '#' + (i+1),
				left: 15,
				height:30,
				font: { fontWeight: 'bold', fontSize: 14}
				});
			var userRankPicture = Ti.UI.createImageView({
				image: ProfileDataImg,
				height: 44,
				width: 44
				});
			
			var userRankPictureView = Ti.UI.createView({
				backgroundColor: '#fff',
				borderWidth: 1,
				width:50, height:50,
				left: 50,
				borderColor: '#E2E5EE',
			});	
				
			var userRankName = Ti.UI.createLabel({
				text: ProfileDataName, 
				//top: ,
				left: 110,
				width: 'auto',
				height: 30,
				font: { fontWeight: 'bold', fontSize: 14}
				});
			var userRankScore = Ti.UI.createLabel({
				text: 50-i, 
				top: 10,
				right: 5,
				width: 'auto',
				textAlign: 'right',
				height: 30,
				font: { fontWeight: 'bold', fontSize: 26}
			});
			userRankPictureView.add(userRankPicture);
			userRank.add(userRankNo);
			userRank.add(userRankPictureView);
			userRank.add(userRankName);
			userRank.add(userRankScore);
			userRankInfo[i]= userRank;
		}
	
	var leaderTable = Ti.UI.createTableView({
		top: 30,
		borderRadius: 10,
		scrollable:false,
		width: 300,
		height: 300,
		data: userRankInfo
	});
//////////////////////////////////////////////////
	var myRankInfo = [];
			var myRank = Ti.UI.createTableViewRow({
				width: 300,
				height: 60,
				selectedBackgroundColor: 'transparent'
				});
			var myRankNo = Ti.UI.createLabel({
				text: '#' + 1,
				left: 15,
				height:30,
				font: { fontWeight: 'bold', fontSize: 14}
				});
			var myRankPicture = Ti.UI.createImageView({
				image: ProfileDataImg,
				height: 44,
				width: 44
				});
				
			var myRankPictureView = Ti.UI.createView({
				backgroundColor: '#fff',
				borderWidth: 1,
				width:50, height:50,
				left: 50,
				borderColor: '#E2E5EE',
			});	
				
			var myRankName = Ti.UI.createLabel({
				text: ProfileDataName, 
				left: 110,
				width: 'auto',
				height: 30,
				font: { fontWeight: 'bold', fontSize: 14}
				});
			var myRankScore = Ti.UI.createLabel({
				text: '',
				top: 10,
				right: 5,
				width: 'auto',
				textAlign: 'right',
				height: 30,
				font: { fontWeight: 'bold', fontSize: 26}
			});
			myRankPictureView.add(myRankPicture);			
			myRank.add(myRankNo);
			myRank.add(myRankPictureView);
			myRank.add(myRankName);
			myRank.add(myRankScore);
			myRankInfo[0] = myRank;
		
//////////////////////////////////////////////////	
	
	var myRankTable = Ti.UI.createTableView({
		top: 340,
		borderRadius: 10,
		scrollable:false,
		width: 300,
		height: 59,
		backgroundColor: '#FFC48C',
		data: myRankInfo
	});
	

	var expSec = Ti.UI.createView({
		top: 5
	});
	var leaderSec = Ti.UI.createView({
			top:50
	});
		
		
		expSec.add(expLabel);
		expSec.add(myLevelLabel);
		expSec.add(expBar);
		expBar.show();
		profileStats.add(expSec);
		leaderSec.add(leaderLabel);
		leaderSec.add(leaderTable);
		leaderSec.add(myRankTable);
		profileStats.add(leaderSec);

	return profileStats;
}

module.exports = ProfileStatsView;