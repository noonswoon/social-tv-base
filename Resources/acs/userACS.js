var userCollection=[];
exports.userACS_fetchAllUser = function(_myusername){
	Cloud.Users.query({
    page: 1,
    per_page: 10,
	where: {username: {"$ne": _myusername}
  }
}, function (e) {
    if (e.success) {
        alert('Success:\\n' +
            'Count: ' + e.users.length);
        for (var i = 0; i < e.users.length; i++) {
            var user = e.users[i];
            Ti.API.info('id: ' + user.id + '\\n' +
                'username: ' + user.username + '\\n'
                + 'img:' + user.photo);
			userCollection.push(user);
         }
       //  alert('calling userLoaded');
           Ti.App.fireEvent('userLoaded',{fetchedUsers:userCollection});
    } else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
});
};