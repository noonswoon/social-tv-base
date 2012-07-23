
//this function give only total results for checkins
exports.checkinACS_fetchedUserTotalCheckIns = function(_id) {
	var id = _id;
	var url = 'https://api.cloud.appcelerator.com/v1/checkins/query.json?key='+ACS_API_KEY+'&per_page=1&response_json_depth=1&where={"user_id":"'+id+'"}';	

	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	    	responseJSON = JSON.parse(this.responseText);
	    	var total_results = Number(responseJSON.meta.total_results);
	    	Ti.App.fireEvent('UserTotalCheckInsFromACS'+_id, {result: total_results});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Debug.debug_print('checkinACS_fetchedUserTotalCheckIns error: '+JSON.stringify(e));
	        ErrorHandling.showNetworkError();
	    },
	    timeout:10000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();

};

//fetch checkin data only for today to keep in database
exports.checkinACS_fetchedUserCheckIn = function(_id) {
	var startOfDayLocal = moment().sod().format('YYYY-MM-DDTHH:mm:ss');
	var acsConvertedStartOfDay = convertLocalTimeToACSTime(startOfDayLocal);
	var dm = moment(acsConvertedStartOfDay, "YYYY-MM-DDTHH:mm:ss");
	var acsConvertedStartOfDayFormatted = dm.format('YYYY-MM-DD, HH:mm:ss');
	
	Cloud.Checkins.query({
	    page: 1,
	    per_page: 100,
	    where: {user_id: _id, updated_at: {"$gte": acsConvertedStartOfDayFormatted}},  
	    //TODO: will have issue here if we want to go back in time to test but there is 
	    //some checkin in the future. It will result in pulling the future checkin data
	    //and end up cannot find program data in the db since we only pull tvdata for only today
	    //so don't be confused!
	    //update- at : today only // greater than start of the day : moment-> save in database 
	    order: '-updated_at',
	    response_json_depth: 2
	}, function (e) {
	    if (e.success) {
	        var checkin =[];
	        for (var i = 0; i < e.checkins.length; i++) {
	        	 var curCheckin = e.checkins[i];
	        	 //Ti.API.info('fetchedCheckin, id: '+curCheckin.id+', name: '+curCheckin.event.name + ', starttime: '+curCheckin.event.start_time+', recurringTime: '+curCheckin.event.recurring_until);
	        	 checkin.push(curCheckin);
	         }
			Ti.App.fireEvent('checkinDbLoaded',{fetchedCheckin:checkin});
	    } 
	    else {
	        Debug.debug_print('checkin Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	        ErrorHandling.showNetworkError();
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
			Debug.debug_print('checkinACS_createCheckin Error: ' + JSON.stringify(e));
			ErrorHandling.showNetworkError();
		}
	});
};

exports.checkinACS_getTotalNumCheckinOfProgram = function(_eventId,_channelId) {
	var programs = [];
	var eventId = _eventId;
	var url = 'https://api.cloud.appcelerator.com/v1/checkins/query.json?key='+ACS_API_KEY+'&response_json_depth=1&where={"event_id":"'+eventId+'"}&per_page=1';	

	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	var total_results = responseJSON.meta.total_results;
	        Ti.App.fireEvent("doneGettingNumCheckinsOfProgramId",{targetedProgramId: eventId, numCheckins:total_results, channelId:_channelId});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        Debug.debug_print('checkinACS_getTotalNumCheckinOfProgram error');
	        ErrorHandling.showNetworkError();
	    },
	    timeout:10000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
}
