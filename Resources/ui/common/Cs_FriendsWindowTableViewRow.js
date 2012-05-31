FriendsWindowTableViewRow = function(tabledata){	
 
	var friendData = [];
	for(var i=0;i<tabledata.friends.length;i++){
		friendData.push(tabledata.friends[i].username);
	}	
	
	
	
	var row = Ti.UI.createTableViewRow({
		backgroundGradient: {type: 'linear',startPoint: { x: '0%', y: '0%' },endPoint: { x: '0%', y: '100%' },colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 }]},
    	height: 100
	});

	var programLabel = Ti.UI.createLabel({
		text: tabledata.programName,
		textAlign: 'left',
		color: '#333',
		left: 145,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 5
	});
	row.add(programLabel);
	
	var dummyFriendsStr = "";
	for(var i=0;i<friendData.length;i++) {
		dummyFriendsStr += friendData[i]+',';
	}
	var friendsLabel = Ti.UI.createLabel({
		text: dummyFriendsStr,
		textAlign: 'left',
		color: '#333',
		left: 145,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 5
	});
	row.add(friendsLabel);
	
	var friendsScrollView = Ti.UI.createScrollView({
		contentWidth:1215,
		contentHeight:35,
		bottom:0,
		height:35,
		width:320,
		backgroundGradient: {type: 'linear',startPoint: { x: '0%', y: '0%' },endPoint: { x: '0%', y: '100%' },colors: [ { color: '#fffefd', offset: 0.0}, { color: '#d2d1d0', offset: 1.0 } ]}
	});
	row.add(friendsScrollView);
	friendsScrollView.add(friendsLabel);

	return row;
}
module.exports = FriendsWindowTableViewRow;
