var point =[];

exports.pointACS_fetchedPoint = function(_id) {
	Cloud.Objects.query({
	classname: 'Points',	
    page: 1,
    per_page: 500,
    where: {user_id: _id},
    order: '-updated_at'
}, function (e) {
    if (e.success) {
        for (var i = 0; i < e.Points.length; i++) {
        	 var curPoint = e.Points[i];
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
	        Ti.API.info('pointsCreated Success:');
	        Ti.App.fireEvent('createPointDB',{fetchedPoint:curPoint});
	    } else {
	        alert('Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};

