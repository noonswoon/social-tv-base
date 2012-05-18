
var level =[];

exports.levelACS_fetchedLevel = function() {
	Ti.API.info('call levelACS_fetchedLevel');
	Cloud.Objects.query({
	classname: 'Level',	
    page: 1,
    per_page: 20
}, function (e) {
    if (e.success) {
    	 Ti.API.info('CALL LEVEL SUCCESS');
        for (var i = 0; i < e.Level.length; i++) {
        	 var curLevel = e.Level[i];
 /*           Ti.API.info('Success:\\' +
            	curLevel.level +' must have ' + curLevel.exp+
            	'exp');*/
               level.push(curLevel);
         }
		Ti.App.fireEvent('levelDbLoaded',{fetchedLevel:level});
		return level;
    } 
    else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};
