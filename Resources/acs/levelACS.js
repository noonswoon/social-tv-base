
exports.levelACS_fetchedLevel = function() {
	//Ti.API.info('call levelACS_fetchedLevel');
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
		Ti.App.fireEvent('levelDbLoaded',{fetchedLevel:level});
		return level;
    } 
    else {
        alert('LevelACS Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};
