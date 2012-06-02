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
    per_page: 5,
    where: {user_id: _id},
    order: '-updated_at'

}, function (e) {
    if (e.success) {
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

exports.checkinACS_createCheckin = function(_eventID){
	Cloud.Checkins.create({
    event_id: _eventID,
    custom_fields: {score: 10},
	}, function (e) {
	    if (e.success) {
	        var checkin = e.checkins[0];
	        var programId = e.checkins[0].event.custom_fields.program_id;
	        Ti.App.fireEvent('createCheckinDB',{fetchedACheckin:checkin});
	    } else {
	        alert('Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};

exports.checkinACS_getTotalNumCheckinOfProgram = function(_eventId) {
	var programs = [];
	
	var eventId = _eventId;
	var url = 'https://api.cloud.appcelerator.com/v1/checkins/query.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr&where={"event_id":"'+eventId+'"}&per_page=1';	
	
	Ti.API.info(url)
	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	var total_results = responseJSON.meta.total_results;
	        Ti.App.fireEvent("doneGettingNumCheckinsOfProgramId",{targetedProgramId: eventId, numCheckins:total_results});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('event error');
	    },
	    timeout:10000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
}