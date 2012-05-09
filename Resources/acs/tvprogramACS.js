exports.tvprogramACS_fetchAllProgram = function() {
	var programs = [];
	var url = "https://api.cloud.appcelerator.com/v1/events/query.json?key=8bKXN3OKNtoE1mBMR4Geo4kIY4bm9xqr";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	      	responseJSON = JSON.parse(this.responseText);
	      	
	      	for (var i = 0; i < responseJSON.response.length; i++) {
	            var program = responseJSON.response.events[i];
	            var curProgram = {
	            	id: program.id,
	            	title: "MickeyMouse show" //program.title,
	            }
				programs.push(curProgram);
			}
	        Ti.App.fireEvent("programsLoadedComplete",{fetchedPrograms:programs});
	    },onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('event error');
	    },
	    timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();  // request is actually sent with this statement
}