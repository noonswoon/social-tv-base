exports.tvprogramACS_fetchAllProgramShowingNow = function() {
	var programs = [];
	var now_full = moment().format('YYYY-MM-DD, HH:mm:ss');
	var currentDate = moment().format('YYYY-MM-DD');
	var start_of_the_day = moment().sod().format('YYYY-MM-DD, HH:mm:ss');
	
	var url = 'https://api.cloud.appcelerator.com/v1/events/query.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr'+
			  	'&per_page=20&where={"start_time":{"$gte":"'+start_of_the_day+'", "$lte":"'+now_full+'"}}';
	// var url = 'https://api.cloud.appcelerator.com/v1/events/query.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr'+
			  	// '&per_page=20&where={"start_time":{"$lte":"'+now_full+'"},"recurring_until":{"$gte":"'+now_full+'"}}';
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	for (var i = 0; i < responseJSON.response.events.length; i++) {
	            var program = responseJSON.response.events[i];  

	            var curProgram = {
	            	id: program.id,
	            	name: program.name,
	            	photo: 'program.photo.urls.original',
	            	start_time: program.start_time,
	            	recurring_until: program.recurring_until,
	            	channel_id: program.custom_fields.channel_id
	            }
				programs.push(curProgram);
			}
	        Ti.App.fireEvent("tvprogramsLoaded",{fetchedPrograms:programs});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('event error');
	    },
	    timeout:10000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
 // request is actually sent with this statement
}

exports.tvprogramACS_fetchAllProgram = function() {
	var programs = [];
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	for (var i = 0; i < responseJSON.response.events.length; i++) {
	            var program = responseJSON.response.events[i];  

	            var curProgram = {
	            	id: program.id,
	            	name: program.name,
	            	photo: 'dummy.png',//'program.photo.urls.original',
	            	start_time: program.start_time,
	            	recurring_until: program.recurring_until,
	            	channel_id: program.custom_fields.channel_id
	            }
				programs.push(curProgram);
			}
	        Ti.App.fireEvent("tvprogramsLoadedAllTime",{fetchedPrograms:programs});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('event error');
	    },
	    timeout:10000  /* in milliseconds */
	});
	xhr.open("GET",'https://api.cloud.appcelerator.com/v1/events/query.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr'+
			  	'&per_page=20');
	xhr.send();
 // request is actually sent with this statement
}