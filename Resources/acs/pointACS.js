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
	        //Ti.API.info('pointsCreated Success');
	    } else {
	        Debug.debug_print('pointACS_createPoint Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	         alert('ERROR: '+'pointACS_createPoint');    
	        ErrorHandling.showNetworkError();
	    }
	});
};
