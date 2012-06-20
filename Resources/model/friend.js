/*id INTEGER PRIMARY KEY,
 *my_id TEXT,
 *friend_id TEXT,
 *username TEXT,
 *first_name TEXT, last_name TEXT, email TEXT);
*/
var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY, my_id TEXT, friend_id TEXT,fb_id TEXT, username TEXT, first_name TEXT, last_name TEXT, email TEXT);');
db.close();

// create data for local database
exports.friendModel_updateFriendsFromACS = function(_friendsCollection) {
	var db = Ti.Database.open('Chatterbox');
	db.execute('DELETE FROM friends');
	for(var i=0;i < _friendsCollection.length; i++) {
		var curFriend = _friendsCollection[i];
		Ti.API.info("FACSBOOK ID: "+curFriend.fb_id);
		db.execute("INSERT INTO friends(id,my_id,friend_id,fb_id,username,first_name,last_name,email) VALUES(null,?,?,?,?,?,?,?)", curFriend.my_id,curFriend.friend_id,curFriend.fb_id,curFriend.username,curFriend.first_name,curFriend.last_name,curFriend.email);
	}
	db.close();
	Ti.App.fireEvent("friendsDbUpdated");
};

//select data from local database where my ID = _myID (parameter)
exports.friendModel_fetchFriend = function(_myID) {
	var fetchedFriend = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM friends where my_id = ?', _myID);
	while(result.isValidRow()) {
		fetchedFriend.push({
			friend_id: result.fieldByName('friend_id'),
			fb_id: result.fieldByName('fb_id'),
			username: result.fieldByName('username'),
			first_name: result.fieldByName('first_name'),
			last_name: result.fieldByName('last_name'),
			email: result.fieldByName('email')	
		});
		result.next();
	}
	result.close();
	db.close();
	Ti.API.info('fetchedFriend.length = '+fetchedFriend.length);
	return fetchedFriend;
};

exports.friendModel_findMyFriend = function(_myId,_friendId) {
	isFriend = false;
	var db = Ti.Database.open('Chatterbox');
	var result = db.excute('SELECT * FROM friends where my_id = ? and friend_id = ?', _myID, _friendId);
	while(result.isValidRow()) {	
		isFriend = true;
		break;
	}	
	result.close();
	db.close();
	//return only true or false
	return isFriend;	
};

//update one friend from approving
exports.friend_create = function(_friend,fb_id){
	var db = Ti.Database.open('Chatterbox'); 
	var curFriend = _friend;
	var friend_id = curFriend.friend_id;
	if(curFriend.friend_id) friendId = curFriend.friend_id;
	else friend_id = curFriend.id;
	alert(friend_id);
	db.execute("INSERT INTO friends(id,my_id,friend_id,fb_id,username,first_name,last_name,email) VALUES(?,?,?,?,?,?,?,?)", null,String(acs.getUserLoggedIn().id),friend_id,fb_id,curFriend.username,String(curFriend.first_name),String(curFriend.last_name),curFriend.email);
	db.close();
	Ti.API.info('fireEvent friendsDbUpdated');
	Ti.App.fireEvent("friendsDbUpdated");
};

exports.friendModel_removeFriend = function(_friendID){
	var db = Ti.Database.open('Chatterbox');
	db.execute('DELETE FROM friends where friend_id = ?',_friendID);
	db.close();
	Ti.App.fireEvent('removedFriend');
};	

// exports.friendModel_count = function(_myID){
	// var db = Ti.Database.open('Chatterbox'); 
	// var result = db.execute('SELECT COUNT(*) as friends_count from friends where my_id = ?', _myID);
	// var friends = Number(result.fieldByName('friends_count'));
	// result.close();
	// db.close();
	// return friends;
// };
