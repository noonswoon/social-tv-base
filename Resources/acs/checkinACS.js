

exports.checkinACS_fetchedCheckInOfProgram = function(_eventId) {
	Cloud.Checkins.query({
    page: 1,
    per_page: 500,
    where: {event_id: _eventId},
    order: '-updated_at'

}, function (e) {
    if (e.success) {
    var checkin =[];	
		var totalCheckinOfEvent = e.checkins.length;
		Ti.App.fireEvent('doneGettingNumCheckinsOfProgramId',{targetedProgramId: _eventId, numCheckins:totalCheckinOfEvent});
    } 
    else {
        Ti.API.info('checkin Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
	});
};



//this function give only total results for checkins
exports.checkinACS_fetchedUserTotalCheckIns = function(_id) {
	var id = _id;
	var url = 'https://api.cloud.appcelerator.com/v1/checkins/query.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr&where={"user_id":"'+id+'"}';	
	Ti.API.info(url)
	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	var total_results = Number(responseJSON.meta.total_results);
	       Ti.App.fireEvent('UserTotalCheckInsFromACS'+_id, {result: total_results});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        Ti.API.info('checkinACS_fetchedUserTotalCheckIns error: '+JSON.stringify(e));
	    },
	    timeout:10000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();

};
//fetch checkin data only for today to keep in database
exports.checkinACS_fetchedUserCheckIn = function(_id) {
	var start_of_the_day = moment().sod().format('YYYY-MM-DD, HH:mm:ss');
	Cloud.Checkins.query({
    page: 1,
    per_page: 100,
    where: {user_id: _id, updated_at: {"$gte": start_of_the_day}},
    //update- at : today only // greater than start of the day : moment-> save in database 
    order: '-updated_at'

}, function (e) {
    if (e.success) {
        var checkin =[];
        Ti.API.info("checkinACS_fetchedUserCheckIn/You have check in today: " + e.checkins.length);
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

exports.checkinACS_createCheckin = function(checkinData,local_id){
	Cloud.Checkins.create({
    event_id: checkinData.event_id,
    user_id: checkinData.user_id,
    custom_fields: {score: checkinData.score, local_id: local_id},
	}, function (e) {
	    if (e.success) {
	        var checkin = e.checkins[0];
	        Ti.App.fireEvent('update1checkin',{fetchedACheckin:checkin}); //fetched back with local id:)
	    } else {
	        Ti.API.info('checkinACS_createCheckin Error: ' +
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
	        Ti.API.info('checkinACS_getTotalNumCheckinOfProgram error');
	    },
	    timeout:10000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
}
