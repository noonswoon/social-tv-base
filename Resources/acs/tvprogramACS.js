exports.tvprogramACS_fetchAllProgram = function(id) {
	var programs = [];
	var now_full = moment().format('YYYY-MM-DD, HH:mm:ss:Z');
	var url = 'https://api.cloud.appcelerator.com/v1/events/query.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr'+
			  	'&where={"start_time":{"$lte":"'+now_full+'"}}';

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
	            	checkin: program.custom_fields.checkin
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
	// data = {per_page: 1};
	// dataSerialize = JSON.stringify(data);
	// //url = url + '&per_page=1';// +dataSerialize;
	// //alert(url);
	// Ti.API.info(url);
	xhr.open("GET", url);
	xhr.send();
 // request is actually sent with this statement
}