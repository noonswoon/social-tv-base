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
	        var reportAlertDialog = Ti.UI.createAlertDialog({
	        	title: 'Thank you',
	        	message: 'For helping us keep Chatterbox clean'
	        });
	        reportAlertDialog.show();
	    } else {
	        Debug.debug_print('userReportACS_reportObject Error: ' + JSON.stringify(e));
	        ErrorHandling.showNetworkError();
	    }
	});
};