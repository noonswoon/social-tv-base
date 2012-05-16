exports.userReportACS_reportObject = function(_objectId,_objectType,_objectContent){
	Cloud.Objects.create({
	    classname: 'UserReports',
	    fields: {
	    	object_id: _objectId,
	        object_type: _objectType,
	        object_content: _objectContent
	    }
	}, function (e) {
	    if (e.success) {
	        alert("Thank you for helping us keep Chatterbox clean");
	    } else {
	        alert('Report Error: ' + ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};