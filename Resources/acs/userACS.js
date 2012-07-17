
exports.userACS_fetchCurrentUser = function(_id){
	Cloud.Users.show({
    	user_id: _id
	}, function (e) {
    if (e.success) {
    	var user = e.users[0];
    	Ti.API.info('fetch profile user: ' + user.first_name + ' ' + user.last_name);
       Ti.App.fireEvent('userLoaded'+_id,{fetchedUser: user});
    } else {
        Ti.API.info('userACS_fetchCurrentUser Error: ' + ((e.error && e.message) || JSON.stringify(e)));
    }
});
};

//i is for table row in friendsMainWindow
exports.userACS_fetchUserFbId = function(_id){
	Cloud.Users.show({
    	user_id: _id
	}, function (e) {
    if (e.success) {
		var fbId = 0;
		var numExternalAccounts = e.users[0].external_accounts.length;		
		for(var j=0;j < numExternalAccounts; j++) {
			var curExternalAccount = e.users[0].external_accounts[j];
			if(curExternalAccount.external_type === "facebook") {
				fbId = curExternalAccount.external_id;
				break;
			}
		}
    } else {
        Ti.API.info('userACS_fetchUserFbId Error: ' + ((e.error && e.message) || JSON.stringify(e)));
    }
});
};

exports.userACS_updatedUser = function(_firstname,_lastname){
	Cloud.Users.update({
    first_name: _firstname,
    last_name: _lastname
}, function (e) {
    if(e.success){
        var user = e.users[0];
       	// alert('Success:\\n' +'id: ' + user.id + '\\n' +'first name: ' + user.first_name + '\\n' +'last name: ' + user.last_name);
   		Ti.App.fireEvent('updateComplete',{firstName:user.first_name,lastName:user.last_name});
    } 
    else{
      	  Ti.API.info('Error:\\n' +((e.error && e.message) || JSON.stringify(e)));
    	}
	});
}
