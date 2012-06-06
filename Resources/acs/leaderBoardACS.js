//fetch user + friends' info
exports.leaderACS_fetchedRank = function(_id){
	Cloud.Objects.query({
	classname: 'LeaderBoard',	
    page: 1,
    per_page: 100,
    where: {"user_id":{"$in":_id}},
 //   order: '-totalPoint'
}, function (e) {
    if (e.success) {
    	var leaders = [];
    	Ti.API.info('success: '+e.LeaderBoard.length);
        for (var i = 0; i < e.LeaderBoard.length; i++){
        	 var curRank = e.LeaderBoard[i];
        	 leaders.push(curRank);
         }
		Ti.App.fireEvent('leaderDBLoaded',{fetchedLeader:leaders});
    } 
    else {
        alert('leaderboardACS-> fetchedRank: Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};

//creare new user info for first time logging in
exports.leaderACS_createUserInfo = function(_id){
	Cloud.Objects.create({
	    classname: 'LeaderBoard',
		fields: {
        	user: _id,
        	totalPoint: 0,
    	}
	}, function (e) {
	    if (e.success) {
	        var user = e.LeaderBoard[0];
	       Ti.API.info('Success:\\n' +
	            'username: ' + LeaderBoard.user.username + '\\n' +
	            'totalPoint: ' + LeaderBoard.totalPoint + '\\n' +
	            'created_at: ' + LeaderBoard.created_at);
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
    	//update +++
        totalPoint: _point,
    }
}, function (e) {
    if (e.success) {
        var leaderBoard = e.LeaderBoard[0];
        alert('Success:\\n' +
            'totalPoint: ' + leaderBoard.totalPoint);
            //fireevent update database
    } else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
});
};