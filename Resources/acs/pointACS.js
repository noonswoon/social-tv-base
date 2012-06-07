
//fetched point! //i dont use this LOL
exports.pointACS_fetchedPoint = function(_id) {
	Cloud.Objects.query({
	classname: 'Points',	
    page: 1,
    per_page: 100,
    where: {user_id: _id},
    order: '-updated_at'
}, function (e) {
    if (e.success) {
    	var point =[];

        for (var i = 0; i < e.Points.length; i++) {
        	 var curPoint = e.Points[i];
               point.push(curPoint);
         }
		Ti.App.fireEvent('pointsDbLoaded',{fetchedPoint:point});
    } 
    else {
        alert('pointACS_fetchedPoint Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};

//create point when any get-point activity happens:)
exports.pointACS_createPoint = function(_point,_objId,_earnedby){
	Cloud.Objects.create({
	    classname: 'Points',
	    fields: {
	    	user: _point.user_id,
	        point: _point.point,
	        earned_by: _earnedby,
	        object: _objId
	    }
	}, function (e) {
	    if (e.success) {
	        var curPoint = e.Points[0];
	        Ti.API.info('pointsCreated Success');
	    } else {
	        alert('pointACS_createPoint Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};
