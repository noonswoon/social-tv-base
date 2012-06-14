/*
 *acs_user_id TEXT,
 *username TEXT,
 * fb_id TEXT,
 *first_name TEXT, last_name TEXT);
*/

var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS users(acs_user_id TEXT PRIMARY KEY, username TEXT, fb_id TEXT, first_name TEXT, last_name TEXT);');
db.close();

// create each user data for local database
exports.userModel_updateUserFromACS = function(_userProfile) {
	var db = Ti.Database.open('Chatterbox');
	var curUser = _userProfile;
	var result = db.execute('SELECT * FROM users WHERE acs_user_id = ?', curUser.id);
	while(result.isValidRow()) {
		db.execute('DELETE FROM users WHERE acs_user_id = ?', curUser.id);
		break;
	};
	db.execute('INSERT INTO users(acs_user_id,username,fb_id,first_name,last_name) VALUES (?,?,?,?,?)',curUser.id,curUser.username,curUser.external_accounts[0].external_id,curUser.first_name,curUser.last_name);
	Ti.API.info('Insert User Profile in to database, User: ' + curUser.first_name+ ' '+curUser.last_name);
	result.close();
	db.close();
	Ti.API.info('Users database has been updated: ' + db.lastInsertRowId);
	//Ti.App.fireEvent("userDbUpdated");
};

exports.userModel_fetchUserProfile = function(_id) {
	var fetchUserProfile;
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM users where acs_user_id = ?', _id);
	while(result.isValidRow()){
		fetchUserProfile = {
			id: result.fieldByName('acs_user_id'),
			username: result.fieldByName('username'),
			fb_id: result.fieldByName('fb_id'),
			first_name: result.fieldByName('first_name'),
			last_name: result.fieldByName('last_name')
		};
		result.next();
	}
	result.close();
	db.close();
	return fetchUserProfile;
};
