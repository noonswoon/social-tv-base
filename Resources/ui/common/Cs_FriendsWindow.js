FriendsWindow = function(_parent){
	
	var FriendsACS = require('acs/friendsACS');
	var friend = require('model/friend');
	var tvprogram = require('model/tvprogram');
	var FriendsWindowTableViewRow = require('ui/common/Cs_FriendsWindowTableViewRow');
	var ProgramWithFriends = require('helpers/ProgramWithFriends');
	var CheckinMainWindow = require('ui/common/Cs_CheckinMainWindow');
	
	//Google Analytics
	Titanium.App.Analytics.trackPageview('/Friends');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
	
	var friendsTableView = Ti.UI.createTableView({
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
		backgroundColor: 'transparent',
	});
	
	friendsTableView.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#d2d1d0', offset: 0.0}, { color: '#fffefd', offset: 1.0 }]
	};	

	//Get all friends from DB
	//with mock user_id	
	var user_id = acs.getUserId();
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
	
	var friendsCheckinsUpdate = function() {
		//Send allTVProgramID and allFriends to data from ACS then pull data
		FriendsACS.friendsCheckins(friendsList,programsList);
	}
	friendsCheckinsUpdate();
	
	Ti.App.addEventListener('friendsDbUpdated',friendsCheckinsUpdate);
	
	var createAddMoreFriendsRow = function(){
		var viewRowData = [];
		var row = Ti.UI.createTableViewRow({
			selectedBackgroundColor: 'transparent',
			height: 150
		});
		var addMoreFriendLabel = Ti.UI.createLabel({
			color: '#333',
			textAlign: 'center',
			text: 'Your friends haven\'t checkin to any programs. Invite some more and enjoy the new TV experiences!',
			font: {fontSize: 15},
			width: 250,
			top: 50
		});
		var goToProfileButton = Ti.UI.createImageView({
			image: 'images/button/button_addFriends.png',
			top: 120,
		});
		goToProfileButton.addEventListener('click',function() {
			var AddFriendMainWindow = require('ui/common/Pf_AddFriendMainWindow');
			var addFriendMainWindow = new AddFriendMainWindow(_parent);
			_parent.containingTab.open(addFriendMainWindow);	
		});
		
		row.add(addMoreFriendLabel);
		row.add(goToProfileButton);
		viewRowData.push(row);
		friendsTableView.setData(viewRowData);
	}
	
	var createFriendCheckinRow = function(checkinsOfFriends,totalFriendCheckins) {		
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
			for(var i=0;i<results.length;i++) {
				var program = results[i];
				var number_checkins = 0;
					for(var j=0;j<allTVPrograms.length;j++){
						if(program.programId === allTVPrograms[j].id) {
							number_checkins = allTVPrograms[j].number_checkins;
							break;
						}
					}

				var row = new FriendsWindowTableViewRow(program,number_checkins);
				viewRowData.push(row);
			}
		friendsTableView.setData(viewRowData);		
	}
	//EventListener
	Ti.App.addEventListener('friendsCheckInLoaded',function(e){
		var checkinsOfFriends;
		if(e.fetchedTotalFriendCheckins==0) {
			checkinsOfFriends = 0;
			createAddMoreFriendsRow();
		}
		else {
			checkinsOfFriends = e.fetchedAllFriendsCheckins;
			var totalFriendCheckins = e.fetchedTotalFriendCheckins;
			createFriendCheckinRow(checkinsOfFriends,totalFriendCheckins);
		};
	});
	
	friendsTableView.addEventListener('click',function(e){
 		checkinmainwin = new CheckinMainWindow({
			eventId: e.row.tvprogram.programId,
			programTitle: e.row.tvprogram.programName,
			programSubname: e.row.tvprogram.programSubname,
			programImage: e.row.tvprogram.programImage,
			programChannel: e.row.tvprogram.programChannel,
			programNumCheckin: e.row.checkin
		}, _parent.containingTab);	
		_parent.containingTab.open(checkinmainwin);
	})
	
	self.add(friendsTableView);
	return self;
}
module.exports = FriendsWindow;
