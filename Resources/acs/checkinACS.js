var checkin =[];

exports.checkinACS_fetchedCheckInOfProgram = function(_eventId) {
	Cloud.Checkins.query({
    page: 1,
    per_page: 500,
    where: {event_id: _eventId},
    order: '-updated_at'
    
}, function (e) {
    if (e.success) {
			var totalCheckinOfEvent = e.checkins.length;
		Ti.App.fireEvent('doneGettingNumCheckinsOfProgramId',{targetedProgramId: _eventId, numCheckins:totalCheckinOfEvent});
    } 
    else {
        Ti.API.info('checkin Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
	});
};


exports.checkinACS_fetchedCheckIn = function(_id) {
	Cloud.Checkins.query({
    page: 1,
    per_page: 500,
    where: {user_id: _id,},
    order: '-updated_at',

}, function (e) {
    if (e.success) {
    	 Ti.API.info('checkin SUCCESS');
        for (var i = 0; i < e.checkins.length; i++) {
        	 var curCheckin = e.checkins[i]; 
               checkin.push(curCheckin);
         }
		Ti.App.fireEvent('checkinDbLoaded',{fetchedCheckin:checkin});
    } 
    else {
        Ti.API.info('checkin Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};

//create checkin
exports.checkinACS_createCheckin = function(_eventID){
	Cloud.Checkins.create({
    event_id: _eventID,
    custom_fields: {score: 10},
	}, function (e) {
	    if (e.success) {
	        var checkin = e.checkins[0];
	        Ti.App.fireEvent('createCheckinDB',{fetchedACheckin:checkin});
	    } else {
	        alert('Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};