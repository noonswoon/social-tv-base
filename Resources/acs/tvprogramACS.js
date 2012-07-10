exports.tvprogramACS_fetchAllProgramShowingNow = function() {
	var programs = [];
	var now_full = moment().format('YYYY-MM-DD, HH:mm:ss');
	var currentDate = moment().format('YYYY-MM-DD');
	var start_of_the_day = moment().sod().format('YYYY-MM-DD,HH:mm:ss');
	var end_of_the_day = moment().eod().format('YYYY-MM-DD,HH:mm:ss');
	
	var url = 'https://api.cloud.appcelerator.com/v1/events/query.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr'+
			  	'&per_page=20&where={"start_time":{"$gte":"'+start_of_the_day+'","$lte":"'+end_of_the_day+'"}}';	
			  			  	
	//Ti.API.info('fetchAllProgramShowingNow: '+url);	
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
				if(program.photo !== undefined) photoUrl = program.photo.urls.original;
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
			Ti.App.fireEvent("tvprogramsLoaded",{fetchedPrograms:programs});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        alert('tvprogramACS_fetchAllProgramShowingNow error: '+e.error);
	    },
	    timeout:10000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
}