var loggingInView;
var loggingInIndicator;
var loggingInLabel;

function showPreloader(customWin,loadingText) {
	loggingInView = Ti.UI.createView({
		borderRadius : 10,
		opacity : 0.8,
		top : 90,
		left : 50,
		right : 50,
		height : 115,
		zIndex : 7777,
		backgroundColor: '#000'
	});

	loggingInIndicator = Titanium.UI.createActivityIndicator({
		height : 50,
		top : 20,
		color : '#fff',
		zIndex : 9999,
		style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
	});

	loggingInLabel = Ti.UI.createLabel({
		text : loadingText,
		textAlign : 'center',
		color : '#fff',
		zIndex : 9999,
		font : {
			fontSize : 18,
			fontWeight : 'bold'
		},
		top : 65
	});

	loggingInView.add(loggingInIndicator);
	loggingInView.add(loggingInLabel);
	loggingInIndicator.show();

	customWin.add(loggingInView);
}

function hidePreloader(customWin) {
	customWin.remove(loggingInView);
}