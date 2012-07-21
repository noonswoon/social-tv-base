//fetch user + friends' info
exports.leaderACS_fetchedRank = function(_ids){
	Cloud.Objects.query({
		classname: 'LeaderBoard',	
	    page: 1,
	    per_page: 100,
	    where: {"user_id":{"$in":_ids}},
	    //order: '-totalPoint',
	    response_json_depth: 2
	}, function (e) {
	    if (e.success) {
	    	var leaders = [];
	    	for (var i = 0; i < e.LeaderBoard.length; i++){
	        	 var curRank = e.LeaderBoard[i];
	        	 leaders.push(curRank);
	         }
			Ti.App.fireEvent('leaderBoardLoaded',{fetchedLeader:leaders});
	    } else {
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
        	totalPoint: 5,
        	fb_id: _user.external_accounts.external_id
    	}
	}, function (e) {
	    if (e.success) {
	        var user = e.LeaderBoard[0];
	      Ti.API.info('Success:\\n' +
	            'username: ' + e.LeaderBoard[0].user.username + '\\n' +
	            'totalPoint: ' + e.LeaderBoard[0].totalPoint + '\\n' +
	            'created_at: ' + e.LeaderBoard[0].created_at + '\\n' +
	            'facebookid: ' + e.LeaderBoard[0].user.external_accounts.external_id);
			Ti.App.fireEvent("createLeaderBoardUser",{fetchedUser: user});
	    } else {
	        alert('leaderboardACS 45 Error:\\n' +
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
//	        Ti.API.info('Success: ' + 'totalPoint: ' + leaderBoard.totalPoint);
	    } else {
	        Debug.debug_print('leaderboardACS 65 Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};