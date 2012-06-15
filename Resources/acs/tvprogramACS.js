exports.tvprogramACS_fetchAllProgramShowingNow = function() {
	var programs = [];
	var now_full = moment().format('YYYY-MM-DD, HH:mm:ss');
	var currentDate = moment().format('YYYY-MM-DD');
	var start_of_the_day = moment().sod().format('YYYY-MM-DD, HH:mm:ss');
	var end_of_the_day = moment().eod().format('YYYY-MM-DD, HH:mm:ss');
	
	var url = 'https://api.cloud.appcelerator.com/v1/events/query.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr'+
			  	'&per_page=20&where={"start_time":{"$gte":"'+start_of_the_day+'", "$lte":"'+end_of_the_day+'"}}';	
			  			  	
	Ti.API.info('fetchAllProgramShowingNow: '+url);	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	for (var i = 0; i < responseJSON.response.events.length; i++) {
	            var program = responseJSON.response.events[i];  

				var photoUrl = 'defaultProgramPic.png';
				if(program.photo !== undefined) photoUrl = program.photo.urls.original;
	            var curProgram = {
	            	id: program.id,
	            	name: program.name,
	            	photo: photoUrl,
	            	start_time: program.start_time,
	            	recurring_until: program.recurring_until,
	            	channel_id: program.custom_fields.channel_id,
	            	program_id: program.custom_fields.program_id
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