
exports.userACS_fetchCurrentUser = function(_id){
	Cloud.Users.show({
    	user_id: _id
	}, function (e) {
    if (e.success) {
    	var user = e.users[0];
    	Ti.API.info('current profile user: ' + user.first_name + ' ' + user.last_name);
    	//return user;
       Ti.App.fireEvent('userLoaded',{fetchedUser: user});
    } else {
        alert('userACS_fetchCurrentUser Error: ' + ((e.error && e.message) || JSON.stringify(e)));
    }
});
};