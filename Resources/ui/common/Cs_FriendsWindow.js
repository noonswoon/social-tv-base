FriendsWindow = function(_parent){
	
	var FriendsACS = require('acs/friendsACS');
	var TVProgramModel = require('model/tvprogram');
	var CheckinModel = require('model/checkin');
	
	var FriendsWindowTableViewRow = require('ui/common/Cs_FriendsWindowTableViewRow');
	var ProgramWithFriends = require('helpers/ProgramWithFriends');
	var CheckinMainWindow = require('ui/common/Cs_CheckinMainWindow');
	
	var myUserId = acs.getUserId();
	
	//Google Analytics
	Titanium.App.Analytics.trackPageview('/Friends');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'transparent'
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
	
	var createAddMoreFriendsRow = function(){
		var viewRowData = [];
		var row = Ti.UI.createTableViewRow({
			selectedBackgroundColor: 'transparent',
			height: 150
		});
		var addMoreFriendLabel = Ti.UI.createLabel({
			color: '#333',
			textAlign: 'center',
			text: 'Your friends haven\'t checkin to any programs. Invite friends and start the new TV experiences!',
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
	
	var createFriendCheckinRow = function(checkinsOfFriends) {		
		var programsThatFriendsCheckin = [];
		
		//build up data for the program that friends checkin
		//the inner forloop iterate through what already added to the programsThatFriendsCheckin array
		for(var i = 0; i < checkinsOfFriends.length; i++){
			var curFriendCheckin = checkinsOfFriends[i];
			var isExisted = false;
			var indexFound = -1;
			for(var j = 0; j < programsThatFriendsCheckin.length; j++) {
				if(curFriendCheckin.event_id === programsThatFriendsCheckin[j].eventId) {
					indexFound = j;
					isExisted = true;
					break;
				}
			}
			if(!isExisted) {
				//create a new ProgramWithFriends
				var newProgramWithFriends = new ProgramWithFriends(curFriendCheckin); 
				newProgramWithFriends.friends.push(curFriendCheckin.user_id); //friends array is an array of string that represents user_id of friends
				programsThatFriendsCheckin.push(newProgramWithFriends);
			} else { //add friend's user_id to the existing element
				programsThatFriendsCheckin[indexFound].friends.push(curFriendCheckin.user_id);
			}
		}
		
		//loop programsThatFriendsCheckin array, and each element of result array, create tableviewrow to add to table view
		var viewRowData = [];
		for(var i = 0; i < programsThatFriendsCheckin.length; i++) {
			var row = new FriendsWindowTableViewRow(programsThatFriendsCheckin[i]);
			viewRowData.push(row);
		}
		friendsTableView.setData(viewRowData);	
	}
		
	friendsTableView.addEventListener('click',function(e){
		Ti.API.info('click on row: '+JSON.stringify(e));
 		checkinmainwin = new CheckinMainWindow({
			eventId: e.row.tvprogram.eventId,
			programTitle: e.row.tvprogram.programName,
			programSubname: e.row.tvprogram.programSubname,
			programImage: e.row.tvprogram.programImage,
			programChannel: e.row.tvprogram.programChannelId,
			programNumCheckin: e.row.tvprogram.numberCheckins,
			programStarttime: e.row.tvprogram.programStartTime,
			programEndtime: e.row.tvprogram.programEndTime
		}, _parent.containingTab);	
		_parent.containingTab.open(checkinmainwin);
	});
	
	//1. get checkins of friends
	var friendsCheckins = CheckinModel.checkin_fetchFriendsCheckins(myUserId);
	if(friendsCheckins.length === 0) {
		createAddMoreFriendsRow();
	} else {
		createFriendCheckinRow(friendsCheckins);
	}
	
	self.add(friendsTableView);
	
	return self;
}
module.exports = FriendsWindow;
