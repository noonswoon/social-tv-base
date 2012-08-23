//this function give only total results for checkins
exports.checkinACS_fetchedUserTotalCheckIns = function(_id) {
	Cloud.Checkins.query({
	    where: {"user_id": _id},
        page: 1,
        per_page: 1,
        response_json_depth: 1
    }, function (e) {
        if (e.success) {
            var totalResults = e.meta.total_results;
            Ti.App.fireEvent('UserTotalCheckInsFromACS'+_id, {result: totalResults});
        } else {
            Debug.debug_print('checkinACS_fetchedUserTotalCheckIns error: '+JSON.stringify(e));
        }
    });
};

//fetch checkin data only for today to keep in database
exports.checkinACS_fetchedUserCheckIn = function(_paramsArray) {
	var userId = _paramsArray[0];
	var startOfDayLocal = moment().sod().format('YYYY-MM-DDTHH:mm:ss');
	var acsConvertedStartOfDay = convertLocalTimeToACSTime(startOfDayLocal);
	var dm = moment(acsConvertedStartOfDay, "YYYY-MM-DDTHH:mm:ss");
	var acsConvertedStartOfDayFormatted = dm.format('YYYY-MM-DD, HH:mm:ss');
	
	Cloud.Checkins.query({
	    page: 1,
	    per_page: 100,
	    where: {user_id: userId, updated_at: {"$gte": acsConvertedStartOfDayFormatted}},  
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
			Ti.App.fireEvent('checkinLoadedComplete',{fetchedCheckin:checkin});
	    } 
	    else {
	        Debug.debug_print('checkinACS_fetchedUserCheckIn Error: ' + JSON.stringify(e));
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
	Cloud.Checkins.query({
	    where: {"event_id": _eventId},
        page: 1,
        per_page: 1,
        response_json_depth: 1
    }, function (e) {
        if (e.success) {
            var totalResults = e.meta.total_results;
            Ti.App.fireEvent("doneGettingNumCheckinsOfProgramId",{targetedProgramId: _eventId, numCheckins:totalResults, channelId:_channelId});
        } else {
            Debug.debug_print('checkinACS_getTotalNumCheckinOfProgram error');
        }
    });
}

exports.checkinACS_timeIndexGetTotalNumCheckinOfProgram = function(_eventId,_channelId,_timeIndex) {	
	Cloud.Checkins.query({
	    where: {"event_id": _eventId},
        page: 1,
        per_page: 1,
        response_json_depth: 1
    }, function (e) {
        if (e.success) {
            var totalResults = e.meta.total_results;
            Ti.App.fireEvent("timeIndexDoneGettingNumCheckinsOfProgramId",{targetedProgramId: _eventId, numCheckins:totalResults, channelId:_channelId, timeIndex:_timeIndex});
        } else {
        	Debug.debug_print('checkinACS_timeIndexGetTotalNumCheckinOfProgram error');
        }
    });
}