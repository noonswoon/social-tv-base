exports.showNetworkError = function(){
	var networkErrorDialog = Titanium.UI.createAlertDialog({
			title:L('Network Error'),
			message:L('Please try again')
	});
	networkErrorDialog.show();
};

