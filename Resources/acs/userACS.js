
exports.userACS_fetchAllUser = function(_myusername){
	Cloud.Users.query({
    page: 1,
    per_page: 20,
	where: {username: {"$ne": _myusername}
  }
}, function (e) {
    if (e.success) {
    	var userCollection=[];
    	Ti.API.info('userACS_fetchAllUser Success: Count: ' + e.users.length);
        for (var i = 0; i < e.users.length; i++) {
        	var user = e.users[i];
        	userCollection.push(user);
        }
        Ti.App.fireEvent('userLoaded',{fetchedUsers:userCollection});
    } else {
        alert('userACS_fetchAllUser Error: ' + ((e.error && e.message) || JSON.stringify(e)));
    }
});
};