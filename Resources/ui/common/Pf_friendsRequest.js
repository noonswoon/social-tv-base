FriendsAddNewView = function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		title: "Friend Request",
	});
	var requestTableView = Ti.UI.createTableView({
	});
//USER TABLE/////////////////////////////////////////
	var tableViewRow = require('ui/common/Pf_friendsTableViewRow');
	var friendsACS = require('acs/friendsACS');
	var userID = acs.getUserId();
	
	friendsACS.showFriendsRequest();
	Ti.App.addEventListener('requestsLoaded',function(e){
		var requestUsers = []; //data to show in the table view
		for(var i=0; i< e.fetchedRequests.length; i++){
			var curRequest = e.fetchedRequests[i];
			var reqRow = new tableViewRow(curRequest,'request');
			requestUsers.push(reqRow);
		};
		requestTableView.setData(requestUsers);
	});

/*		requestTableView.addEventListener('click',function(e){
		if(e.source.title==="Approve")
		//alert("delete row");
		requestTableView.deleteRow(e.index);
		//need to check if e.source..xxx has the content of 'x' or not
		//if it is, remove that row
	});*/
////////////////////////////////////////////////////		
	self.add(requestTableView);
	return self;
};
module.exports = FriendsAddNewView;