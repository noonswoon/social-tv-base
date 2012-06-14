//fetch user + friends' info
exports.leaderACS_fetchedRank = function(_ids){
	Cloud.Objects.query({
	classname: 'LeaderBoard',	
    page: 1,
    per_page: 100,
    where: {"user_id":{"$in":_ids}},
 //   order: '-totalPoint'
}, function (e) {
    if (e.success) {
    	var leaders = [];
    	Ti.API.info('success: '+e.LeaderBoard.length);
        for (var i = 0; i < e.LeaderBoard.length; i++){
        	 var curRank = e.LeaderBoard[i];
        	 leaders.push(curRank);
         }
		Ti.App.fireEvent('leaderBoardLoaded',{fetchedLeader:leaders});
    } 
    else {
        alert('leaderboardACS-> fetchedRank: Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};

//create only when create user for the first time entering into this application: totalPoint starts at 0 
exports.leaderACS_createUserInfo = function(_user){
	Cloud.Objects.create({
	    classname: 'LeaderBoard',
		fields: {
        	user: _user.id,
        	totalPoint: 0,
        	fb_id: _user.external_accounts.external_id
    	}
	}, function (e) {
	    if (e.success) {
	        var user = e.LeaderBoard[0];
	       Ti.API.info('Success:\\n' +
	            'username: ' + LeaderBoard.user.username + '\\n' +
	            'totalPoint: ' + LeaderBoard.totalPoint + '\\n' +
	            'created_at: ' + LeaderBoard.created_at + '\\n' +
	            'facebookid: ' + LeaderBoard.user.external_accounts.external_id);
			Ti.App.fireEvent("createLeaderBoardUser",{fetchedUser: user});
	    } else {
	        alert('Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};

//update totalPoint
exports.leaderACS_updateUserInfo = function(_id,_point){
Cloud.Objects.update({
    classname: 'LeaderBoard',
    id: _id,
    fields: {
        totalPoint: _point,
    }
}, function (e) {
    if (e.success) {
        var leaderBoard = e.LeaderBoard[0];
        Ti.API.info('Success:\\n' + 'totalPoint: ' + leaderBoard.totalPoint);
            //fireevent update database
    } else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
});
};