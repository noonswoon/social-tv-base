var point =[];
var userScore = 0;

exports.pointACS_fetchedPoint = function(_id) {
	Ti.API.info('call pointACS_fetchedPoint');
	Cloud.Objects.query({
	classname: 'Points',	
    page: 1,
    per_page: 500,
    where: {user_id: _id},
    order: '-updated_at'
}, function (e) {
    if (e.success) {
    	 Ti.API.info('CALL POINTS SUCCESS');
        for (var i = 0; i < e.Points.length; i++) {
        	 var curPoint = e.Points[i];
        	    Ti.API.info('curPoint = e.Points[i]');
            userScore +=curPoint.point;
            Ti.API.info('Success:\\' +
            	curPoint.user.username +' got ' + curPoint.point+
            	' points from ' +
            	curPoint.earned_by + ' at ' + curPoint.updated_at 
            	+'. Your current score is ' + userScore
            	);
               point.push(curPoint);
         }
		Ti.App.fireEvent('pointsDbLoaded',{fetchedPoint:point});
    } 
    else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};

exports.pointACS_createPoint = function(_userID,_point,_earnedby,_objID){
	Cloud.Objects.create({
	    classname: 'Points',
	    fields: {
	    	user: _userID,
	        point: _point,
	        earned_by: _earnedby,
	        object: _objID
	    }
	}, function (e) {
	    if (e.success) {
	        var curPoint = e.Points[0];
	        alert('Success:\\n' +
	            'id: ' + curPoint.user.id + '\\n' +
	            'point: ' + curPoint.point + '\\n' +
	            'earned_by: ' + curPoint.earned_by +
	             'checkinID: ' + curPoint.object);
	        Ti.App.fireEvent('createPointDB',{fetchedPoint:curPoint});
	    } else {
	        alert('Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};

