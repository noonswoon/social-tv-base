exports.showNetworkError = function(){
	var networkErrorDialog = Titanium.UI.createAlertDialog({
			title:'Network Error',
			message:'Please try again'
	});
	networkErrorDialog.show();
}

