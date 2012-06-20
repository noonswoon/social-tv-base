FriendsWindow = function(){
	
	var FriendsACS = require('acs/friendsACS');
	var friend = require('model/friend');
	var tvprogram = require('model/tvprogram');
	var FriendsWindowTableViewRow = require('ui/common/Cs_FriendsWindowTableViewRow');
	var ProgramWithFriends = require('helpers/ProgramWithFriends');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
	
	var friendsTableView = Ti.UI.createTableView();

	//Get all friends from DB
	//with mock user_id	
	var user_id = acs.getUserId();
	var friendsList = [];

	allMyFriends = friend.friendModel_fetchFriend(user_id);
	Ti.API.info('allMyFriends.length = '+allMyFriends);
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
	FriendsACS.friendsCheckins(friendsList,programsList);
	
	//EventListener
	Ti.App.addEventListener('friendsCheckInLoaded',function(e){
		var checkinsOfFriends;
		if(e.fetchedAllFriendsCheckins=== undefined) checkinsOfFriends = 0;
		else checkinsOfFriends = e.fetchedAllFriendsCheckins;
		var totalFriendCheckins = e.fetchedTotalFriendCheckins;
		var results = [];
		
		for(var i=0;i<checkinsOfFriends.length;i++){
			var programObj = checkinsOfFriends[i].program;
			var friendObj = checkinsOfFriends[i].friend; //check here if it is just an id or a whole user object
	
			var isExisted = false;
			var indexFound = -1;
			for(var j=0;j < results.length;j++) {
				if(programObj.id === results[j].programId) {
					indexFound = j;
					isExisted = true;
					break;
				}
			}
			if(!isExisted) {
				//create a new ProgramWithFriends
				var newProgramWithFriends = new ProgramWithFriends(programObj); 
				newProgramWithFriends.friends.push(friendObj);
				results.push(newProgramWithFriends);
			} else {
				results[indexFound].friends.push(friendObj);
			}
		}
		
		//loop results array, and each element of result array, create tableviewrow to add to table view
		var viewRowData = [];
			for(var i=0;i<results.length;i++){
				var program = results[i];
					var row = new FriendsWindowTableViewRow(program,totalFriendCheckins);
					viewRowData.push(row);
			}
		friendsTableView.setData(viewRowData);
	});
	
	self.add(friendsTableView);
	return self;
}
module.exports = FriendsWindow;
