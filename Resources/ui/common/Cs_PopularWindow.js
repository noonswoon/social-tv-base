function PopularWindow(_parent) {
	var BadgesACS = require('acs/badgesACS');
	var BadgeShowPermissionACS = require('acs/badgeShowPermissionACS');
	var CheckinACS = require('acs/checkinACS');
	var FriendsACS = require('acs/friendsACS');
	var LevelACS = require('acs/levelACS');	
	var TVProgramACS = require('acs/tvprogramACS');
	var UserACS = require('acs/userACS');

	var CheckinModel = require('model/checkin');
	var FriendModel = require('model/friend');
	var TVProgramModel = require('model/tvprogram');
	var UserModel = require('model/user')
	
	var CacheHelper = require('helpers/cacheHelper');
	
	var PopularWindowTableViewRow = require('ui/common/Cs_PopularWindowTableViewRow');
	var TimeSelectionScrollView = require('ui/common/Cs_PopularWindowTimeSelectionScrollView');
			
	var areAllProgramsTitlesLoaded = false;
	var areBadgeShowPermissionReady = false;
	var areFriendCheckinsReady = false;
	var numProgramsToLoadCheckins = -1;
	var numProgramsToLoadCheckinsTimeIndex = -1;
	var usingPull2Refresh = false;
	
	//Google Analytics
	Titanium.App.Analytics.trackPageview('/Popular');
	
	var self = Ti.UI.createWindow({
		backgroundColor: 'orange'
	});
	
	function sortByNumberCheckins(a,b) {
		return b.number_checkins - a.number_checkins;	//if a has bigger checkins value, a should come before b
	}
	
	function isEverythingReady() {
		if(areAllProgramsTitlesLoaded && areBadgeShowPermissionReady && (numProgramsToLoadCheckins === 0) && areFriendCheckinsReady) {
			Ti.API.info('Everything\'s ready');
			hidePreloader(self);
			Ti.App.fireEvent("showDiscoveryPage");

			//not frequently update// load after fetching tvprogram completed -- do caching too
			var myUserId = acs.getUserId();
			FriendsACS.showFriendsRequest();	 //no database for showFriendsRequest
			CacheHelper.fetchACSDataOrCache('badgesACS', BadgesACS.fetchedBadges, [], 'badgesDbLoaded', CACHE_TIMEOUT_LONG);
			CacheHelper.fetchACSDataOrCache('levelACS', LevelACS.levelACS_fetchedLevel, [], 'levelDbUpdated', CACHE_TIMEOUT_LONG);
			CacheHelper.fetchACSDataOrCache('checkinACS_fetchedUserCheckIn', CheckinACS.checkinACS_fetchedUserCheckIn, [myUserId], 'checkinDbLoaded', CACHE_TIMEOUT_SHORT);		
		} //else Ti.API.info('thing is NOT ready yet..missing');
	}
	
	Ti.App.addEventListener('tvprogramsTitlesLoaded',function() {
		areAllProgramsTitlesLoaded = true;
		isEverythingReady();
	});
	
	Ti.App.addEventListener('badgeShowPermissionLoaded',function() {
		areBadgeShowPermissionReady = true;
		isEverythingReady();
	});
	
	var timeSelectionScrollView = new TimeSelectionScrollView();
	var timeSelectionView = Ti.UI.createView({
		height: 43,
		top:0,
		backgroundColor: 'transparent'
	});	
	timeSelectionView.add(timeSelectionScrollView);
	
	var programListTable = Ti.UI.createTableView({
		top: 42,
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
		backgroundColor: 'transparent',
	});
	
	programListTable.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#d2d1d0', offset: 0.0}, { color: '#fffefd', offset: 1.0 }]
	};	
	
	function tvprogramLoadedCompleteCallback(e) {
		programListTable.data = [];	
		var allPrograms = e.fetchedPrograms;
		TVProgramModel.TVProgramModel_insertAllPrograms(allPrograms);
		//should be insert program at the moment -- and no deletion
		
		Ti.App.fireEvent("tvprogramsTitlesLoaded");
	}
	Ti.App.addEventListener('tvprogramsLoadedComplete',tvprogramLoadedCompleteCallback);
	
	function fetchProgramsAllCheckins() {
		var currentTVPrograms = TVProgramModel.TVProgramModel_fetchPrograms(); 
		numProgramsToLoadCheckins = currentTVPrograms.length; //set variable to count down num checkins
		for(var i=0;i<currentTVPrograms.length;i++){
			var curTVProgramId = currentTVPrograms[i].id;
			var curChannelId = currentTVPrograms[i].channel_id;
			CheckinACS.checkinACS_getTotalNumCheckinOfProgram(curTVProgramId,curChannelId);
		}
	};
	
	Ti.App.addEventListener('tvprogramsTitlesLoaded', function() {
		fetchProgramsAllCheckins();
	});
	
	Ti.App.addEventListener('doneGettingNumCheckinsOfProgramId', function(e) {
		var targetedProgramId = e.targetedProgramId; 
		var numCheckins = e.numCheckins;
		var channelId = e.channelId;
		TVProgramModel.TVProgramModel_updateCheckins(targetedProgramId, numCheckins,channelId);
		numProgramsToLoadCheckins--;
		isEverythingReady();
	});
	
	Ti.App.addEventListener('updatePopularProgramAtTime', function(e){
		var myUserId = acs.getUserId();
		var timeIndex = e.timeIndex;
				
		TVProgramACS.tvprogramACS_fetchProgramsShowingAt(timeIndex);
		showPreloader(self,'Loading...');
		//add in loading... screen
	});

	Ti.App.addEventListener('timeIndexDoneGettingNumCheckinsOfProgramId', function(e) {
		var targetedProgramId = e.targetedProgramId; 
		var numCheckins = e.numCheckins;
		var channelId = e.channelId;

		TVProgramModel.TVProgramModel_updateCheckins(targetedProgramId, numCheckins,channelId);
		numProgramsToLoadCheckinsTimeIndex--;
		if(numProgramsToLoadCheckinsTimeIndex === 0) {
			var timeIndex = e.timeIndex;
			var selectedShowtime = TVProgramModel.TVProgramModel_fetchShowtimeSelection(timeIndex); 		
			selectedShowtime.sort(sortByNumberCheckins);
			var viewRowsData = [];
			var myUserId = acs.getUserId();
			for (var i=0;i<selectedShowtime.length;i++) {
				var curTVProgram = selectedShowtime[i];
				var numFriendsCheckins = CheckinModel.checkin_fetchNumFriendsCheckinsOfProgram(curTVProgram.id, myUserId);
				var row = new PopularWindowTableViewRow(curTVProgram, numFriendsCheckins);
				viewRowsData.push(row);
			}
			programListTable.setData(viewRowsData);	
			hidePreloader(self);
		}
	});
	
	Ti.App.addEventListener('tvprogramsAtTimeIndexLoaded', function(e) {
		var programsAtTimeIndex = e.fetchedPrograms;
		var timeIndex = e.timeIndex;
		
		//insert to db
		TVProgramModel.TVProgramModel_insertPrograms(programsAtTimeIndex);
		numProgramsToLoadCheckinsTimeIndex = programsAtTimeIndex.length;
		for(var i = 0; i < programsAtTimeIndex.length; i++) {
			CheckinACS.checkinACS_timeIndexGetTotalNumCheckinOfProgram(programsAtTimeIndex[i].id, programsAtTimeIndex[i].channel_id,timeIndex);
		}
	});
	 
	Ti.App.addEventListener('showDiscoveryPage', function(){
		var myUserId = acs.getUserId();
		var currentTVPrograms = TVProgramModel.TVProgramModel_fetchPopularPrograms(); 
		currentTVPrograms.sort(sortByNumberCheckins);
		var viewRowsData = [];
		for (var i=0;i<currentTVPrograms.length;i++) {
			var curTVProgram = currentTVPrograms[i];
			var numFriendsCheckins = CheckinModel.checkin_fetchNumFriendsCheckinsOfProgram(curTVProgram.id, myUserId);
			var row = new PopularWindowTableViewRow(curTVProgram, numFriendsCheckins);
			viewRowsData.push(row);
		}
		programListTable.setData(viewRowsData);
		
		//set timeSelectionScrollView to make sure it sync too
		timeSelectionScrollView.syncTimeSelection();
		
		//signify pull2refresh to be done [if it comes from Pull2Refresh] 
		if(usingPull2Refresh) {
			Ti.API.info('using pull to refresh..finish up');
			programListTable.refreshFinished();
			usingPull2Refresh = false;
			//CacheHelper.resetCacheTime('cachesomething here'+_programId);
		}
	});

	var friendsDbUpdatedCallback = function() {
		//Send allTVProgramID and allFriends to data from ACS then pull data

		var myUserId = acs.getUserId();

		//Get all friends from DB
		var friendsList = [];
		allMyFriends = FriendModel.friendModel_fetchFriend(myUserId);
		for(var i = 0; i < allMyFriends.length; i++){
			var friends = allMyFriends[i].friend_id;
			friendsList.push(friends);
		}
	
		//Get All TVProgram Id that we are currently have
		var programsList = [];
		allTVPrograms = TVProgramModel.TVProgramModel_fetchPrograms();
		for(var i = 0; i<allTVPrograms.length;i++){
			var programs = allTVPrograms[i].id;
			programsList.push(programs);
		}
		FriendsACS.friendsCheckins([friendsList,programsList]);
	}
	Ti.App.addEventListener('friendsDbUpdated',friendsDbUpdatedCallback); //event fire from ApplicationTabGroup

	Ti.App.addEventListener('friendsCheckInLoaded',function(e) {
		var myUserId = acs.getUserId();
		var friendsCheckinWithPrograms = e.fetchedAllFriendsCheckins;
		
		//Ti.API.info('friendsCheckinWithPrograms data: '+JSON.stringify(friendsCheckinWithPrograms));
		CheckinModel.checkin_insertFriendsCheckinsToday(friendsCheckinWithPrograms, myUserId);
	
		//will also need to add friend user data to the user table!
		for(var i=0; i < friendsCheckinWithPrograms.length; i++) {
			var curFriendUser = friendsCheckinWithPrograms[i].friend;
			var curFriendFbId = UserACS.userACS_extractUserFbId(curFriendUser);
			UserModel.userModel_addUser(curFriendUser.id, curFriendUser.username, curFriendFbId, curFriendUser.first_name, curFriendUser.last_name)
		}	
		areFriendCheckinsReady = true; 
		isEverythingReady();
	});	
		
	programListTable.addEventListener('click',function(e){
		var CheckinMainWindow = require('ui/common/Cs_CheckinMainWindow');
		//Ti.API.info('program_type = '+e.row.tvprogram.program_type);
		checkinmainwin = new CheckinMainWindow({
			eventId: e.row.tvprogram.id, //id of the particular show (one-time)
			programId: e.row.tvprogram.program_id, //overall id of program id
			programTitle: e.row.tvprogram.name,
			programSubname: e.row.tvprogram.subname,
			programImage: e.row.tvprogram.photo,
			programChannel: e.row.tvprogram.channel_id,
			programType: e.row.tvprogram.program_type,
			programStarttime: e.row.tvprogram.start_time,
			programEndtime: e.row.tvprogram.recurring_until,
			programNumCheckin: e.row.tvprogram.number_checkins
		}, _parent.containingTab);
		_parent.containingTab.open(checkinmainwin);
	});
	
	self.add(timeSelectionView);
	self.add(programListTable);
	self.hideNavBar();
	
	showPreloader(self,'Loading...');
	setTimeout(function() {
		Ti.API.info('force close loading screen');
		hidePreloader(self);
	}, 8000);

	PullToRefresh.addASyncPullRefreshToTableView(programListTable, function() {
			usingPull2Refresh = true;
			areAllProgramsTitlesLoaded = false;
			numProgramsToLoadCheckins = -1;
			TVProgramACS.tvprogramACS_fetchProgramsShowingNow();
//			TVProgramACS.tvprogramACS_fetchAllProgramShowingToday();
//			CacheHelper.getTimeLastFetchedTVProgramACS();
		}, {
			backgroundColor: '#959595', 
			statusLabel: {
				color: 'white'
			},
			updateLabel: {
				color: 'white'
			}
		}
	);	

	TVProgramACS.tvprogramACS_fetchProgramsShowingNow();
//	CacheHelper.fetchACSDataOrCache('tvprogramACS_fetchAllProgramShowingToday', TVProgramACS.tvprogramACS_fetchAllProgramShowingToday, [], 'tvprogramsTitlesLoaded', CACHE_TIMEOUT_SHORT);
//	CacheHelper.setTimeLastFetchedTVProgramACS();
	BadgeShowPermissionACS.badgeShowPermissionACS_fetchedPermission();

	return self;
}

module.exports = PopularWindow;