exports.tvprogramACS_fetchProgramsShowingNow = function() {
	var programs = [];
	var now_full = moment().format('YYYY-MM-DD,HH:mm:ss');
	
	var url = 'https://api.cloud.appcelerator.com/v1/events/query/occurrences.json?key='+ACS_API_KEY+
			  	'&per_page=100&response_json_depth=3&where={"start_time":{"$lte":"'+now_full+'"},"end_time":{"$gte":"'+now_full+'"}}';	
	//Ti.API.info('fetch showing now: '+url);
	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	//Ti.API.info('responseJSON: '+JSON.stringify(responseJSON));
	      	var programEvents = responseJSON.response.event_occurrences; 
	      	//Ti.API.info('programEvents.length: '+programEvents.length);
	      	for (var i = 0; i < programEvents.length; i++) {
	            var program = programEvents[i];  

				var photoUrl = 'defaultProgramPic.png';
				var subname = '';
				var channelId = 'CTB_CNL';
				var programId = 'CTB_PUBLIC';
				var programType = 'ETC';
				
				//safeguarding code
				if(program.event != undefined && program.event.photo !== undefined && program.event.photo.urls !== undefined)
					photoUrl = program.event.photo.urls.thumb_100;
					
	            if(program.event != undefined && program.event.custom_fields !== undefined) {
	            	if(program.event.custom_fields.subname !== undefined) {
	            		subname = program.event.custom_fields.subname;	
	            	}
	            	if(program.event.custom_fields.channel_id !== undefined) {
	            		channelId = program.event.custom_fields.channel_id;	
	            	}
	            	if(program.event.custom_fields.program_id !== undefined) {
	            		programId = program.event.custom_fields.program_id;
	            	}
	            	if(program.event.custom_fields.program_type !== undefined) {
	            		programType = program.event.custom_fields.program_type;	
	            	}
	            }
	            
	            var curProgram = {
	            	id: program.event.id,
	            	name: program.event.name,
	            	subname: subname,
	            	photo: photoUrl,
	            	start_time: program.start_time,
	            	recurring_until: program.end_time,
	            	channel_id: channelId,
	            	program_id: programId,
	            	program_type: programType
	            }
	            programs.push(curProgram);
			}
			Ti.App.fireEvent("tvprogramsLoadedComplete",{fetchedPrograms:programs});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Debug.debug_print('tvprogramACS_fetchProgramsShowingNow error: '+e.error);
	        ErrorHandling.showNetworkError();
	    },
	    timeout:10000  // in milliseconds 
	});
	xhr.open("GET", url);
	xhr.send();
}

exports.tvprogramACS_fetchProgramsShowingAt = function(_timeIndex) {
	var programs = [];
	
	var nowYMD = moment().format('YYYY-MM-DD');
	var now_full = moment().format('YYYY-MM-DD,HH:mm:ss');
	
	var timeIndexStr = _timeIndex + "";
	if(_timeIndex < 10) timeIndexStr = "0"+timeIndexStr;
	timeIndexStr = nowYMD + ',' + timeIndexStr+':00:00';
	var whereCondition = '{"start_time":{"$lte":"'+timeIndexStr+'"}, "end_time": {"$gte":"'+timeIndexStr+'"}}';
	
	var url = 'https://api.cloud.appcelerator.com/v1/events/query/occurrences.json?key='+ACS_API_KEY+
			  	'&per_page=100&response_json_depth=3&where='+whereCondition;	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	//Ti.API.info('responseJSON: '+JSON.stringify(responseJSON));
	      	var programEvents = responseJSON.response.event_occurrences; 
	      	//Ti.API.info('programEvents.length: '+programEvents.length);
	      	for (var i = 0; i < programEvents.length; i++) {
	            var program = programEvents[i];  

				var photoUrl = 'defaultProgramPic.png';
				var subname = '';
				var channelId = 'CTB_CNL';
				var programId = 'CTB_PUBLIC';
				var programType = 'ETC';
				
				//safeguarding code
				if(program.event != undefined && program.event.photo !== undefined && program.event.photo.urls !== undefined)
					photoUrl = program.event.photo.urls.thumb_100;
					
	            if(program.event != undefined && program.event.custom_fields !== undefined) {
	            	if(program.event.custom_fields.subname !== undefined) {
	            		subname = program.event.custom_fields.subname;	
	            	}
	            	if(program.event.custom_fields.channel_id !== undefined) {
	            		channelId = program.event.custom_fields.channel_id;	
	            	}
	            	if(program.event.custom_fields.program_id !== undefined) {
	            		programId = program.event.custom_fields.program_id;
	            	}
	            	if(program.event.custom_fields.program_type !== undefined) {
	            		programType = program.event.custom_fields.program_type;	
	            	}
	            }
	            
	            var curProgram = {
	            	id: program.event.id,
	            	name: program.event.name,
	            	subname: subname,
	            	photo: photoUrl,
	            	start_time: program.start_time,
	            	recurring_until: program.end_time,
	            	channel_id: channelId,
	            	program_id: programId,
	            	program_type: programType
	            }
	            Ti.API.info('programFrom timeIndex: '+_timeIndex+'; Obj: '+JSON.stringify(curProgram));
	            programs.push(curProgram);
			}
			Ti.App.fireEvent("tvprogramsAtTimeIndexLoaded",{fetchedPrograms:programs, timeIndex:_timeIndex});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Debug.debug_print('tvprogramsAtTimeIndexLoaded error: '+e.error);
	        ErrorHandling.showNetworkError();
	    },
	    timeout:10000  // in milliseconds 
	});
	xhr.open("GET", url);
	xhr.send();
}

exports.tvprogramACS_fetchProgramsFromChannel = function(_channelId) {
	var programs = [];
	var startOfTheDay = moment().sod().format('YYYY-MM-DD,HH:mm:ss');
	var endOfTheDay = moment().eod().format('YYYY-MM-DD,HH:mm:ss');
	
	var url = 'https://api.cloud.appcelerator.com/v1/events/query/occurrences.json?key='+ACS_API_KEY+
			  	'&per_page=100&response_json_depth=2&where={"start_time":{"$gte":"'+startOfTheDay+'", "$lte":"'+endOfTheDay+'"},"channel_id":"'+_channelId+'"}';	
	Ti.API.info('fetch showing From Channel: '+url);
/*	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	for (var i = 0; i < responseJSON.response.events.length; i++) {
	            var program = responseJSON.response.events[i];  

				var photoUrl = 'defaultProgramPic.png';
				var subname = '';
				var channelId = 'CTB_CNL';
				var programId = 'CTB_PUBLIC';
				var programType = 'ETC';
				
				//safeguarding code
				if(program.photo !== undefined && program.photo.urls !== undefined)
					photoUrl = program.photo.urls.thumb_100;
					
	            if(program.custom_fields !== undefined) {
	            	if(program.custom_fields.subname !== undefined) {
	            		subname = program.custom_fields.subname;	
	            	}
	            	if(program.custom_fields.channel_id !== undefined) {
	            		channelId = program.custom_fields.channel_id;	
	            	}
	            	if(program.custom_fields.program_id !== undefined) {
	            		programId = program.custom_fields.program_id;
	            	}
	            	if(program.custom_fields.program_type !== undefined) {
	            		programType = program.custom_fields.program_type;	
	            	}
	            }
	            
	            var curProgram = {
	            	id: program.id,
	            	name: program.name,
	            	subname: subname,
	            	photo: photoUrl,
	            	start_time: program.start_time,
	            	recurring_until: program.recurring_until,
	            	channel_id: channelId,
	            	program_id: programId,
	            	program_type: programType
	            }
				programs.push(curProgram);
			}
			//Ti.App.fireEvent("tvprogramsLoadedComplete",{fetchedPrograms:programs});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Debug.debug_print('tvprogramACS_fetchProgramsFromChannel error: '+e.error);
	        ErrorHandling.showNetworkError();
	    },
	    timeout:10000  // in milliseconds 
	});
	xhr.open("GET", url);
	xhr.send();
	*/
}

exports.tvprogramACS_fetchAllProgramShowingToday = function() {
	var programs = [];
	var start_of_the_day = moment().sod().format('YYYY-MM-DD,HH:mm:ss');
	var end_of_the_day = moment().eod().format('YYYY-MM-DD,HH:mm:ss');
	
	var url = 'https://api.cloud.appcelerator.com/v1/events/query.json?key='+ACS_API_KEY+
			  	'&per_page=100&response_json_depth=2&where={"start_time":{"$gte":"'+start_of_the_day+'","$lte":"'+end_of_the_day+'"}}';	
	Ti.API.info('tvprogram fetch url: '+url);
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	for (var i = 0; i < responseJSON.response.events.length; i++) {
	            var program = responseJSON.response.events[i];  

				var photoUrl = 'defaultProgramPic.png';
				var subname = '';
				var channelId = 'CTB_CNL';
				var programId = 'CTB_PUBLIC';
				var programType = 'ETC';
				
				//safeguarding code
				if(program.photo !== undefined && program.photo.urls !== undefined)
					photoUrl = program.photo.urls.thumb_100;
					
	            if(program.custom_fields !== undefined) {
	            	if(program.custom_fields.subname !== undefined) {
	            		subname = program.custom_fields.subname;	
	            	}
	            	if(program.custom_fields.channel_id !== undefined) {
	            		channelId = program.custom_fields.channel_id;	
	            	}
	            	if(program.custom_fields.program_id !== undefined) {
	            		programId = program.custom_fields.program_id;
	            	}
	            	if(program.custom_fields.program_type !== undefined) {
	            		programType = program.custom_fields.program_type;	
	            	}
	            }
	            
	            var curProgram = {
	            	id: program.id,
	            	name: program.name,
	            	subname: subname,
	            	photo: photoUrl,
	            	start_time: program.start_time,
	            	recurring_until: program.recurring_until,
	            	channel_id: channelId,
	            	program_id: programId,
	            	program_type: programType
	            }
				programs.push(curProgram);
			}
			Ti.App.fireEvent("tvprogramsLoadedComplete",{fetchedPrograms:programs});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Debug.debug_print('tvprogramACS_fetchAllProgramShowingToday error: '+e.error);
	        ErrorHandling.showNetworkError();
	    },
	    timeout:10000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
}