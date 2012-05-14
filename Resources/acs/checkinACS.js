var checkin =[];
var userScore =0;


exports.checkinACS_fetchedCheckInOfProgram = function(_eventId) {
	Cloud.Checkins.query({
    page: 1,
    per_page: 20,
    where: {event_id: _eventId},
    order: '-updated_at'
    
}, function (e) {
    if (e.success) {
        //for (var i = 0; i < e.checkins.length; i++) {
        	 // var curCheckin = e.checkins[i];
			var totalCheckinOfEvent = e.checkins.length;
       //  }
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
    per_page: 20,
    where: {user_id: _id,},
    order: '-updated_at',

}, function (e) {
    if (e.success) {
        for (var i = 0; i < e.checkins.length; i++) {
        	 var curCheckin = e.checkins[i];
            userScore +=curCheckin.custom_fields.score;
            Ti.API.info('checkin Success:\\' +
            	curCheckin.user.username +' has been check in on ' +
            	curCheckin.event.name + ' at ' + curCheckin.updated_at +
            	'. Your current score is ' + userScore);
               //alert('userScore = ' + userScore);
            
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

