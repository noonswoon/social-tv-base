var leaders = [];

exports.leaderACS_fetchedRank = function(_id){
	Cloud.Objects.query({
	classname: 'LeaderBoard',	
    page: 1,
    per_page: 100,
    where: {"user_id":{"$in":_id}},
 //   order: '-totalPoint'
}, function (e) {
    if (e.success) {
    	alert('success: '+e.LeaderBoard.length);
        for (var i = 0; i < e.LeaderBoard.length; i++){
        	 var curRank = e.LeaderBoard[i];
        	 leaders.push(curRank);
        	 alert(curRank.user.id + curRank.totalPoint);
         }
		Ti.App.fireEvent('leaderDBLoaded',{fetchedLeader:leaders});
    } 
    else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};
