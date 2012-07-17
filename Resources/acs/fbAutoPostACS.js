exports.fbAutoPostACS_AutoPostValue = function() {
	Cloud.Objects.query({
		classname: 'IsFacebookAutoPost',	
	    page: 1,
	    per_page: 1
	}, function (e) {
	    if (e.success) {
	    	//var FbAutoPost = e.IsFacebookAutoPost[0].isAutoPost;
	    	var settingHelpers = require('helpers/settingHelper');
	    	settingHelpers.setFacebookAutoPost(e.IsFacebookAutoPost[0].isAutoPost);
	    } else {
	        Ti.API.info('Error: Cannot fetch from the server. ' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});	
};