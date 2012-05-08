var ProfileStatsView = function(){
	var profileStats = Ti.UI.createView({
		});
		
		var expBar = Ti.UI.createProgressBar({
			top:10,
		    width:250,
		    height:'auto',
		    min:0,
		    max:10,
		    value:5,
		    color:'#fff',
		    message:'Downloading 0 of 10',
		    font:{fontSize:14, fontWeight:'bold'},
		    style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN,});
		    
		var label = Ti.UI.createButton({
			title: 'stats',
			width: 250,
			height: 400
		});
		profileStats.add(label);
		profileStats.add(expBar);
		expBar.show();

/*	profileDetail.details = Ti.UI.createView({
		height: 190,
		width: 312,
		borderRadius: 5,
		scrollable: true,
		backgroundColor: '#999'});

profileDetail.add(profileDetail.details);	
*/


	return profileStats;
	}

module.exports = ProfileStatsView;