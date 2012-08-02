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
	    } else {
	        Debug.debug_print('pointACS_createPoint Error: ' + JSON.stringify(e));
	        ErrorHandling.showNetworkError();
	    }
	});
};
