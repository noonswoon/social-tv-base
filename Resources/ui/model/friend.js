/*number INTEGER PRIMARY KEY,
 *my_id TEXT,
 *friend_id TEXT,
 *username TEXT,
 *first_name TEXT, last_name TEXT, email TEXT);
*/
var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS friends(number INTEGER PRIMARY KEY, my_id TEXT, friend_id TEXT, username TEXT, first_name TEXT, last_name TEXT, email TEXT);');
db.close();

// create data for local database
exports.friendModel_updateFriendsFromACS = function(_friendsCollection) {
	var db = Ti.Database.open('Chatterbox');
	db.execute('DELETE FROM friends');
	for(var i=0;i < _friendsCollection.length; i++) {
		var curFriend = _friendsCollection[i];
		db.execute("INSERT INTO friends(number,my_id,friend_id,username,first_name,last_name,email) VALUES(?,?,?,?,?,?,?)", null,curFriend.my_id,curFriend.friend_id,curFriend.username,curFriend.first_name,curFriend.last_name,curFriend.email);
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
			username: result.fieldByName('username'),
			first_name: result.fieldByName('first_name'),
			last_name: result.fieldByName('last_name'),
			email: result.fieldByName('email')	
		});
		result.next();
	}
	result.close();
	db.close();
	return fetchedFriend;
};

//update one friend from approving
exports.friend_create = function(_friendsCollection){
	var db = Ti.Database.open('Chatterbox'); 
	var curFriend = _friendsCollection;
	db.execute("INSERT INTO friends(number,my_id,friend_id,username,first_name,last_name,email) VALUES(?,?,?,?,?,?,?)", null,String(acs.getUserLoggedIn().id),curFriend.friend_id,curFriend.username,String(curFriend.first_name),String(curFriend.last_name),curFriend.email);
	db.close();
	Ti.App.fireEvent("friendsDbUpdated",curFriend);
};

exports.friendModel_removeFriend = function(_friendID){
	var db = Ti.Database.open('Chatterbox');
	db.execute('DELETE FROM friends where friend_id = ?',_friendID);
	db.close();
	Ti.App.fireEvent('removedFriend');
};	

exports.friendModel_count = function(_myID){
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT COUNT(*) as friends_count from friends where my_id = ?', _myID);
	var friends = Number(result.fieldByName('friends_count'));
	result.close();
	db.close();
	return friends;
};
