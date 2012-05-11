var point =[];
var userScore = 0;

exports.pointACS_fetchedPoint = function(_id) {
	alert('call pointACS_fetchedPoint');
	Cloud.Objects.query({
	classname: 'Points',	
    page: 1,
    per_page: 20,
    where: {user_id: _id},
    order: '-updated_at'
}, function (e) {
    if (e.success) {
    	alert('CALL POINTS SUCCESS');
        for (var i = 0; i < e.Points.length; i++) {
        	 var curPoint = e.Points[i];
        	    alert('curPoint = e.Points[i]');
            userScore +=curPoint.point;
            alert('Success:\\' +
            	curPoint.user.username +' got ' + curPoint.point+
            	' points from ' +
            	curPoint.earned_by + ' at ' + curPoint.updated_at 
            	+'. Your current score is ' + userScore
            	);
				//alert('userScore = ' + userScore);
               point.push(curPoint);
         }
	//	Ti.App.fireEvent('checkinDbLoaded',{fetchedCheckin:checkin});
    } 
    else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};
