FriendsAddNewView = function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		title: "Add Friends",
	});
	var addNewTableView = Ti.UI.createTableView({
	});
//USER TABLE/////////////////////////////////////////
	var userName = 'titaniummick';
	var tableViewRow = require('ui/common/Pf_friendsTableViewRow');
	var userACS = require('acs/userACS');
	userACS.userACS_fetchAllUser(userName);
	var tempUsers = []; //data to show in the table view
	
	Ti.App.addEventListener('userLoaded',function(e){
	for(var i=0;i<e.fetchedUsers.length; i++){
		var curUser = e.fetchedUsers[i];
		//alert('username: ' + curUser.username);
		var userRow = new tableViewRow(curUser);
		//alert('push data');
		tempUsers.push(userRow);
		};
	//alert('setData');
	addNewTableView.setData(tempUsers);
	});
	
	addNewTableView.addEventListener('click',function(e){
//		alert(e.index);
		if(e.source.text === "+")
			addNewTableView.deleteRow(e.index);
		//need to check if e.source..xxx has the content of 'x' or not
		//if it is, remove that row
	});

////////////////////////////////////////////////////		
	self.add(addNewTableView);
	return self;
};
module.exports = FriendsAddNewView;