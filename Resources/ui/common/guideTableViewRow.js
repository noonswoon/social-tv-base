GuideTableViewRow = function(){
	
	var channel = [];
	
	var row = Ti.UI.createTableViewRow({
		height: 100,
		backgroundGradient: {
        	type: 'linear',
        	startPoint: { x: '0%', y: '0%' },
        	endPoint: { x: '0%', y: '100%' },
        	colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]
    	} 
	});
	
	var channelName = Ti.UI.createLabel({
		text: '_curTVProgram.name',
		textAlign: 'left',
		left: 140,
		font:{fontWeight:'bold',fontSize:18},
		top: 10
	});
	row.add(channelName);
	
	return row;
	
}
module.exports = GuideTableViewRow;
