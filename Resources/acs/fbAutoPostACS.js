exports.fbAutoPostACS_AutoPostValue = function() {
	Cloud.Objects.query({
		classname: 'IsFacebookAutoPost',	
	    page: 1,
	    per_page: 1,
	    response_json_depth: 1
	}, function (e) {
	    if (e.success) {
	    	//var FbAutoPost = e.IsFacebookAutoPost[0].isAutoPost;
	    	var settingHelpers = require('helpers/settingHelper');
	    	settingHelpers.setFacebookAutoPost(e.IsFacebookAutoPost[0].isAutoPost);
	    } else {
	        Debug.debug_print('Error: Cannot fetch from the server. ' +
	            ((e.error && e.message) || JSON.stringify(e)));
	       	ErrorHandling.showNetworkError();
	    }
	});	
};