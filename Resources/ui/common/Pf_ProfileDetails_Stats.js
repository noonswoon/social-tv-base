
var ProfileStatsView = function(){

//test data			
			var	ProfileDataName= 'Titanium Mick';
			var	ProfileDataImg = 'images/kuma100x100.png';
			var	ProfileDataExp = 30;
			var	ProfileDataLevelUp = 100;
			var	ProfileDataBadgeLevel = 'Super Fan';

	var profileStats = Ti.UI.createView({
		backgroundColor: 'transparent',
		bottom: 10,
	});
			//experience point
		var expLabel = Ti.UI.createLabel({
			text: ProfileDataExp + '/' + ProfileDataLevelUp,
			font: {fontSize: 14, fontWeight: 'bold'},
			color: '#fff',
			textAlign: 'right',
			top: 5,
			height:30,
			right: 10
		});
		
		var expBadge = Ti.UI.createLabel({
			text: ProfileDataBadgeLevel,
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
		    max: ProfileDataLevelUp,
		    value: ProfileDataExp/ProfileDataLevelUp,
		    style:Titanium.UI.iPhone.ProgressBarStyle.DEFAULT});

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
			height: 50,
			width: 50,
			border: 1,
			borderColor: '#999',
			left: 50
			});
		var userRankName = Ti.UI.createLabel({
			text: ProfileDataName, 
			top: 0,
			left: 110,
			width: 'auto',
			height: 30,
			font: { fontWeight: 'bold', fontSize: 14}
			});
		var userRankScore = Ti.UI.createLabel({
			text: ProfileDataExp-i, 
			top: 10,
			right: 5,
			width: 'auto',
			height: 30,
			font: { fontWeight: 'bold', fontSize: 26}
		});
		userRank.add(userRankNo);
		userRank.add(userRankPicture);
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

		
		var expSec = Ti.UI.createView({
			top: 5
		});
		var leaderSec = Ti.UI.createView({
			top:50
		});
		
			expSec.add(expLabel);
			expSec.add(expBadge);
			expSec.add(expBar);
				expBar.show();
		profileStats.add(expSec);
			leaderSec.add(leaderLabel);
			leaderSec.add(leaderTable);
		profileStats.add(leaderSec);


	return profileStats;
	}

module.exports = ProfileStatsView;