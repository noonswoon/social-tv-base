
exports.levelACS_fetchedLevel = function() {
	Cloud.Objects.query({
		classname: 'Level',	
	    page: 1,
	    per_page: 20
	}, function (e) {
	    if (e.success) {
	    	var level =[];
	        for (var i = 0; i < e.Level.length; i++) {
	        	 var curLevel = e.Level[i];
	               level.push(curLevel);
	         }
			Ti.App.fireEvent('levelLoaded',{fetchedLevel:level});
			return level;
	    } 
	    else {
	        Debug.debug_print('LevelACS-> fetchedLevel Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	        ErrorHandling.showNetworkError();
	   	}
	});
};
