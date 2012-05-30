FriendsWindowTableViewRow = function(_programs,_friends){
	
	var row = Ti.UI.createTableViewRow({
		backgroundGradient: {
       		type: 'linear',
       		startPoint: { x: '0%', y: '0%' },
       		endPoint: { x: '0%', y: '100%' },
       		colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]
    	} 
	});

	var programLabel = Ti.UI.createLabel({
		text: _programs.name,
		textAlign: 'left',
		color: '#333',
		left: 145,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 5
	});
	row.add(programLabel);
	
	var friendsLabel = Ti.UI.createLabel({
		text: _friends.username,
		textAlign: 'left',
		color: '#333',
		left: 145,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 20
	});
	row.add(friendsLabel);


	return row;
}
module.exports = FriendsWindowTableViewRow;
