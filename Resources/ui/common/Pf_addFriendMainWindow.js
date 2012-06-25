AddFriendsMainView = function(_parentWindow) {
	var FriendModel = require('model/friend');
	var AddFriendTableViewRow = require('ui/common/Pf_AddFriendTableViewRow');
	var self = Titanium.UI.createWindow({
		barColor:'#489ec3',
		barImage: 'images/NavBG.png',
		title: 'Add Friends'
	});		

	var nav = Ti.UI.iPhone.createNavigationGroup({
		window: self
	});			
	var settingButton = Titanium.UI.createButton({
		image: 'images/icon/19-gear.png'
	});
	settingButton.addEventListener('click',function(){	
		var PlaceholderWindow = require('ui/common/PlaceholderWindow');			
		var placeholderWindow = new PlaceholderWindow();
		_parentWindow.containingTab.open(placeholderWindow);
	});
//////////////////////////////////////////////////////////////////
	var mainView = Ti.UI.createView({
		top: 0,
		backgroundColor: '#fff'
	});
//////////////////////////////////////////////////////////////////
	var friendTab = Titanium.UI.iOS.createTabbedBar({
		labels: ['Friend with App', 'Invite'],
		backgroundColor: '#43a5cf',
		style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height: 40,
		width: 300,
		top: 5,
		index: 0
	});		

	var friendScrollView = Ti.UI.createScrollView({
		contentWidth: 320,
		contentHeight: 'auto',
		top: 50,
		showVerticalScrollIndicator: true,
		showHorizontalScrollIndicator: false,
		width: 320,
		height: 317
	});	
			
	var appFriend = Ti.UI.createTableView();
	var facebookFriend = Ti.UI.createTableView();
	
	var appFriendSearch = Titanium.UI.createSearchBar({
		barColor:'#43a5cf',
		showCancel:false,
		hintText:'Search...',
		backgroundImage: 'images/searchbar_white.png',
		borderWidth: 0,
	});
		
	var facebookFriendSearch = Titanium.UI.createSearchBar({
		barColor:'#43a5cf',
		showCancel:false,
		hintText:'Search...',
		backgroundImage: 'images/searchbar_white.png',
		borderWidth: 0,
	});
		
	appFriendSearch.addEventListener('change', function(e) {
		e.value; // search string as user types
	});
	appFriendSearch.addEventListener('return', function(e) {
		appFriendSearch.blur();
	});
	appFriendSearch.addEventListener('cancel', function(e) {
		appFriendSearch.blur();
	});

	facebookFriendSearch.addEventListener('change', function(e) {
		e.value; // search string as user types
	});
	facebookFriendSearch.addEventListener('return', function(e) {
		facebookFriendSearch.blur();
	});
	facebookFriendSearch.addEventListener('cancel', function(e) {
		facebookFriendSearch.blur();
	});		
			
	friendTab.addEventListener('click',function(e) {
		for (var i in friendScrollView.children) {
			if (friendScrollView.children.hasOwnProperty(i)) {
				friendScrollView.remove(friendScrollView.children[i]);
			}
		}			
		
		if(e.index==0) {
			friendScrollView.add(appFriend);
		}	
		else if (e.index==1) {
			friendScrollView.add(facebookFriend);
		}
	});

//////////////////////////////////////////////////////////////////////////////////////
	
	var attachFbId = function(_friendList) {
		for (var i = 0; i < _friendList.length; i++) {
			if(_friendList.length==0) break;
			var user = _friendList[i];
			//find facebook id
			user.fb_id = 0;
			var numExternalAccounts = _friendList[i].external_accounts.length;		
			for(var j=0;j < numExternalAccounts; j++) {
				var curExternalAccount = _friendList[i].external_accounts[j];
				if(curExternalAccount.external_type === "facebook") {
					user.fb_id = curExternalAccount.external_id;
				break;
				}
			}
		}
		return _friendList;	
	}
	
	var facebookFriendQuery = function() {
		if (!Titanium.Facebook.loggedIn) Ti.UI.createAlertDialog({title:'Chatterbox', message:'Login before running query'}).show();
		//run query
		else{	
			// run query, populate table view and open window
			var query = "SELECT uid, name, pic_square, status FROM user ";
			query +=  "where uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Titanium.Facebook.uid + ")";
			query += "order by first_name";
			Titanium.Facebook.request('fql.query', {query: query},  function(r) {
				if (!r.success) {
					if (r.error) Ti.API.info(r.error);
					else Ti.API.info("Call was unsuccessful");
				}
				var result = JSON.parse(r.result);
				var friendWithApp =[];
				//find friend who has no app!	
				Cloud.SocialIntegrations.searchFacebookFriends(function (e) {
			    	if (e.success) {
			    		friendWithApp = e.users;
			    		friendWithApp = attachFbId(friendWithApp);
			    		var friendWithNoApp = [];
				    	for(i=0;i<result.length;i++) {
							for(j=0;j<friendWithApp.length;j++) {
								if(String(friendWithApp[j].fb_id) !== String(result[i].uid)) {
									friendWithNoApp.push(result[i]);
									break;
								}
							}
						}
						var friendOnFbRows = createFriendTable(friendWithNoApp,"facebook");
						facebookFriend.setData(friendOnFbRows);
						facebookFriend.setSearch(facebookFriendSearch);
						facebookFriend.setFilterAttribute('filter');
			    	}
					else Ti.API.info('SearchFriendsWithApp Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
				});					
			});
		}	
	};
	
	var checkAlreadyFriend = function(_friendList,friend_id){
		var isFriend = false;
		for(i=0;i<_friendList.length;i++) {
			if(_friendList[i].friend_id===friend_id) {
				isFriend = true;
				break;	
			}
		}
		return isFriend;
	}
	
	var appFriendQuery = function(){
		Cloud.SocialIntegrations.searchFacebookFriends(function (e) {
		    if (e.success) {
				var friendWithApp = e.users;
				var my_id = acs.getUserId();
				var myfriends = FriendModel.friendModel_fetchFriend(my_id);
				
				for(i=0; i<friendWithApp.length;i++) {
					var isFriend = checkAlreadyFriend(myfriends,friendWithApp[i].id);
					if(isFriend) friendWithApp.splice(i,1);
				}
				Ti.API.info('Friends Count: ' + friendWithApp.length);
				var friendWithAppRows = createFriendTable(friendWithApp,"withApp");
				appFriend.setData(friendWithAppRows);
				appFriend.setSearch(appFriendSearch);
				appFriend.setFilterAttribute('filter');
			} else {
				Ti.API.info('SearchFriendsWithApp Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
			}
		});
	}
	
	var createFriendTable = function(_friendList,_category){
		var tableData = [];
		
		if(_category==="withApp") _friendList = attachFbId(_friendList);
		
		for(var i = 0; i<_friendList.length;i++){
			var curUser = _friendList[i];
			var userRow = new AddFriendTableViewRow(curUser,_category);
			 tableData.push(userRow);
		};
		return tableData;
	}

	var appFriend = Ti.UI.createTableView();		
	var facebookFriend = Ti.UI.createTableView();
	
	facebookFriend.addEventListener('click',function(e) {
		if(String(e.source) ==="[object TiUIButton]") {
			Ti.API.info('Invite friend: '+ e.rowData.uid);
			facebookFriend.deleteRow(e.index);
		}
	});

	appFriend.addEventListener('click',function(e) {
		if(String(e.source) ==="[object TiUIButton]") appFriend.deleteRow(e.index);
	});

////////////////////////////
	appFriendQuery();
	facebookFriendQuery();
	
	friendScrollView.add(appFriend); //index: 0 -> default tab
	mainView.add(friendTab);
	mainView.add(friendScrollView);
	self.add(mainView);	
	self.setRightNavButton(settingButton);	
	return self;
}
module.exports = AddFriendsMainView;