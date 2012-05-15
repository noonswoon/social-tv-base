GuideChannelWindow = function(){
	
	var row = Ti.UI.createTableViewRow({
		height: 100,
		backgroundGradient: {
    		type: 'linear',
        		startPoint: { x: '0%', y: '0%' },
        		endPoint: { x: '0%', y: '100%' },
        		colors: [ { color: '#fff', offset: 0.0}, { color: '#D1CBCD', offset: 1.0 } ]
    		} 
	});
	
	return row;
	
}
module.exports = GuideChannelWindow;
