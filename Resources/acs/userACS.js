
exports.userACS_fetchCurrentUser = function(_id){
	Cloud.Users.show({
    	user_id: _id
	}, function (e) {
    if (e.success) {
    	var user = e.users[0];
    	Ti.API.info('fetch profile user: ' + user.first_name + ' ' + user.last_name);
       Ti.App.fireEvent('userLoaded'+_id,{fetchedUser: user});
    } else {
    	alert('error id: '+_id);
        alert('userACS_fetchCurrentUser Error: ' + ((e.error && e.message) || JSON.stringify(e)));
    }
});
};

//i is for table row in friendsMainWindow
exports.userACS_fetchUserFbId = function(_id,i){
	Cloud.Users.show({
    	user_id: _id
	}, function (e) {
    if (e.success) {
    	var fb_id = e.users[0].external_accounts[0].external_id;
       Ti.App.fireEvent('fbIdreturn'+_id,{fb_id: fb_id, i: i});
    } else {
        alert('userACS_fetchUserFbId Error: ' + ((e.error && e.message) || JSON.stringify(e)));
    }
});
};