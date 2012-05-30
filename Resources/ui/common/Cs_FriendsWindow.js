FriendsWindow = function(){
	
	var friendsACS = require('acs/friendsACS');
	var friend = require('model/friend');
	var tvprogram = require('model/tvprogram');
	var FriendsWindowTableViewRow = require('ui/common/Cs_FriendsWindowTableViewRow');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
	
	var friendsTableView = Ti.UI.createTableView();

	
	//Get all friends from DB
	//with mock user_id
	
	var user_id = '4fa17dd70020440df700950c';
	var friendsList = [];

	allMyFriends = friend.friendModel_fetchFriend(user_id);
	for(var i = 0; i<allMyFriends.length;i++){
		var friends = allMyFriends[i].friend_id;
		friendsList.push(friends);
	}
	
	//Get All TVProgram id
	var programsList = [];
	
	allTVPrograms = tvprogram.TVProgramModel_fetchPrograms();
	for(var i = 0; i<allTVPrograms.length;i++){
		var programs = allTVPrograms[i].id;
		programsList.push(programs);
	}
	
	//Send allTVProgramID and allFriends to data from ACS then pull data
	friendsACS.friendsCheckins(friendsList,programsList);
	
	//EventListener
	Ti.App.addEventListener('friendsLoaded',function(e){
		var friendsCheckins = e.fetchedOurFriendsCheckins;
		var programsCheckins = e.fetchedOurProgramsCheckins;

		var viewRowsData = []; 		
		for (var i=0;i<programsCheckins.length;i++) {
			for(var j=0;j<friendsCheckins.length;j++){
			 	var programs = programsCheckins[i];
				var friends = friendsCheckins[i];
				var row = new FriendsWindowTableViewRow(programs,friends);
				viewRowsData.push(row);
			}
		}
		friendsTableView.setData(viewRowsData);
	});
	
	self.add(friendsTableView);
	return self;
}
module.exports = FriendsWindow;
