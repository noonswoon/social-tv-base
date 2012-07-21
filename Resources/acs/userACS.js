
exports.userACS_fetchCurrentUser = function(_id){
	Cloud.Users.show({
    	user_id: _id,
    	response_json_depth: 1
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
exports.userACS_extractUserFbId = function(_userObj){
	var fbId = "0";
	var numExternalAccounts = _userObj.external_accounts.length;		
	for(var i=0;i < numExternalAccounts; i++) {
		if( _userObj.external_accounts[i].external_type === "facebook") {
			fbId =  _userObj.external_accounts[i].external_id;
			break;
		}
	}
	return fbId; 
};

exports.userACS_updatedUser = function(_firstname,_lastname){
	Cloud.Users.update({
    first_name: _firstname,
    last_name: _lastname,
    response_json_depth: 1
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
