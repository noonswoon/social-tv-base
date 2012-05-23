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
		//ACS
		Ti.App.addEventListener('createPointDB', createPointDBCallBack);
	
		function createPointDBCallBack(e){
		PointModel.points_updateNewPoint(e.fetchedPoint);
		};	
		
		Ti.App.addEventListener('updateNewPoint',function(){

			//TODO: สงสัยว่าน่าจะเกิดการ  call event ซ้ำ recheck again
			//alert('updateNewPoint');

<<<<<<< HEAD

=======
>>>>>>> ProfileUI-23052012(2)
			Ti.App.fireEvent('pointsDbUpdated');
		});
		
		Ti.App.addEventListener('pointsDbUpdated', function(){
			totalPoints = PointModel.points_sumPoints();
			ProfileDataExp = totalPoints;
			ProfileDataLevelUp = LevelModel.level_nextLevel(ProfileDataExp);
			expLabel.text=ProfileDataExp + '/' + ProfileDataLevelUp;
			expBar.max= ProfileDataLevelUp;
			expBar_light.max= ProfileDataLevelUp;
			myRankScore.text = ProfileDataExp;
			expBar.value = ProfileDataExp;
			myLevelLabel.text = LevelModel.level_checkLevel(ProfileDataExp);
			expBar_light.value = ProfileDataExp+1000;
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
				height: 50,
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
				image: ProfileDataImg,
				height: 36,
				width: 36
				});
			
			var userRankPictureView = Ti.UI.createView({
				backgroundColor: '#fff',
				borderWidth: 1,
				width:40, height:40,
				left: 40,
				borderColor: '#E2E5EE',
			});	
				
			var userRankName = Ti.UI.createLabel({
				text: ProfileDataName, 
				left: 90,
				width: 'auto',
				height: 30,
				font: { fontWeight: 'bold', fontSize: 14},
				color: '#666'
				});
			var userRankScore = Ti.UI.createLabel({
				text: 50-i, 
				top: 10,
				right: 5,
				width: 'auto',
				textAlign: 'right',
				height: 30,
				font: { fontWeight: 'bold', fontSize: 26},
				color: '#666'
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
		height: 250,
		data: userRankInfo
	});
//////////////////////////////////////////////////
	var myRankInfo = [];
			var myRank = Ti.UI.createTableViewRow({
				width: 300,
				height: 50,
				selectedBackgroundColor: 'transparent'
				});
			var myRankNo = Ti.UI.createLabel({
				text: '#' + 1,
				left: 15,
				height:30,
				font: {fontSize: 16}
				});
			var myRankPicture = Ti.UI.createImageView({
				image: ProfileDataImg,
				height: 36,
				width: 36
				});
				
			var myRankPictureView = Ti.UI.createView({
				backgroundColor: '#fff',
				borderWidth: 1,
				width:40, height:40,
				left: 40,
				borderColor: '#E2E5EE',
			});	
				
			var myRankName = Ti.UI.createLabel({
				text: ProfileDataName, 
				left: 90,
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
		top: leaderTable.top+leaderTable.height+10,
		borderRadius: 10,
		scrollable:false,
		width: 300,
		height: 50,
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
		expSec.add(expBar_light);
		expSec.add(expBar);
		profileStats.add(expSec);
		leaderSec.add(leaderLabel);
		leaderSec.add(leaderTable);
		leaderSec.add(myRankTable);
		profileStats.add(leaderSec);

	return profileStats;
}

module.exports = ProfileStatsView;