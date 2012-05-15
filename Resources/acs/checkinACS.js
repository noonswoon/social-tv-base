var checkin =[];
var userScore =0;

//query checkin
exports.checkinACS_fetchedCheckIn = function(_id) {
	Cloud.Checkins.query({
    page: 1,
    per_page: 20,
    where: {user_id: _id},
    order: '-updated_at'
}, function (e) {
    if (e.success) {
    	 Ti.API.info('checkin SUCCESS');
        for (var i = 0; i < e.checkins.length; i++) {
        	 var curCheckin = e.checkins[i];
            userScore +=curCheckin.custom_fields.score;
           Ti.API.info('checkin Success:\\' +
            	curCheckin.user.id +' has been check in on ' +
            	curCheckin.event.name + ' at ' + curCheckin.updated_at );
				Ti.API.info('userScore = ' + userScore);
			   
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
        Ti.API.info('Success:\\n' +
            'id: ' + checkin.id + '\\n' +
            'user: ' + checkin.user.id +' has been checkin in ' + checkin.event.name + ', got score = ' + checkin.custom_fields.score);
       Ti.API.info('fire createCheckinDB');
        Ti.App.fireEvent('createCheckinDB',{fetchedACheckin:checkin});
    } else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
});
	
};