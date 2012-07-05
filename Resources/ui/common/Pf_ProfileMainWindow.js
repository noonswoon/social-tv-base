function ProfileMainWindow(_id,_status) {
	var myUserId = acs.getUserId(); 
	var ProfileHeader = require('ui/common/Pf_ProfileHeader');
	var ProfileDetail = require('ui/common/Pf_ProfileDetails');
	var UserACS = require('acs/userACS');
	var UserModel = require('model/user');
	
	//Google Analytics
	Titanium.App.Analytics.trackPageview('/Profile');
	
	var settingButton = Titanium.UI.createButton({
		backgroundImage: 'images/setting.png',
		width: 39,
		height: 32
	});
	
	var self = Titanium.UI.createWindow({
		barImage: 'images/nav_bg_w_pattern.png',
		rightNavButton: settingButton,
		barColor:'#489ec3'
	});			
	
	var nav = Ti.UI.iPhone.createNavigationGroup({
		window: self
	});			
	
	var headerView = Ti.UI.createView({
		height: 120
	});		
	
	var userProfileTable = Ti.UI.createTableView({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		scrollable: false,
	});
	
	var userProfile = UserModel.userModel_fetchUserProfile(_id);
			
	var createProfileView = function(userProfile){
		Ti.API.info('createProfileView: ' + userProfile.first_name +' ' + userProfile.last_name);	
		if(_status==="me"){
			self.title = 'My Profile';
		}
		else self.title = userProfile.first_name + ' ' + userProfile.last_name;
			
		var header = Ti.UI.createTableViewSection();
		var profileHeader = new ProfileHeader(self, userProfile, _status);
		var profileDetail = new ProfileDetail(self, userProfile, _status);
		var userProfileData=[];
		
		headerView.add(profileHeader);
		header.headerView = headerView;
		userProfileData.push(header);
		userProfileData.push(profileDetail);
		userProfileTable.setData(userProfileData);
		self.add(userProfileTable);		
	}; //end of function: createProfileView
	

	if(userProfile === undefined) {
		UserACS.userACS_fetchCurrentUser(_id);
	} else createProfileView(userProfile);		//user data from database	

	var userLoadedCallBack = function(e){
		UserModel.userModel_updateUserFromACS(e.fetchedUser); //insert to db
		userProfile = UserModel.userModel_fetchUserProfile(_id); //select from db
		Ti.App.fireEvent('userProfileLoaded'+_id,{userProfile:userProfile});
	};
	
	Ti.App.addEventListener('userLoaded'+_id, userLoadedCallBack);
	
	Ti.App.addEventListener('userProfileLoaded'+_id, function(e) {
		userProfile = e.userProfile;
		createProfileView(userProfile);
	});
	
	settingButton.addEventListener('click',function(){
		var SettingWindow = require('ui/common/Am_SettingWindow');					
		var settingwin = new SettingWindow(self.containingTab);
		self.containingTab.open(settingwin);
	});
	
	//remove event listeners for all the children of ProfileMainWindow
	self.addEventListener('close', function() {
		Ti.API.info("closing profile main window");
		Ti.App.fireEvent('profileMainWindowClosing'+_id);
	});
	
	// self.addEventListener('focus', function() {
		// profileHeader.setProfileName();
	// });
	
	return self;
}

module.exports = ProfileMainWindow;