var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS activity(id INTEGER PRIMARY KEY, activity_acs_id TEXT, user_id TEXT,user_name TEXT, targetedUserID TEXT, category TEXT, targetedObjectID TEXT, additionalData TEXT, updated_at TEXT);');
db.close();

/* 
 * local_id
 * id TEXT PRIMARY KEY
 * user_id TEXT
 * user_name TEXT
 * targetedUserID TEXT
 * category TEXT
 * targetedObjectID TEXT
 * additionalData TEXT
 * updated_at TEXT
 */

// create data for local database
exports.activityModel_fetchedActivityFromACS = function(_activityCollection,_id) {
	var db = Ti.Database.open('Chatterbox');
	if(_id === acs.getUserId()) db.execute('DELETE FROM activity');
	db.execute('DELETE FROM activity WHERE targetedUserID = ?', _id);
	for(var i=0;i < _activityCollection.length; i++) {
		var curActivity = _activityCollection[i];
		var name = curActivity.user.username; 
		db.execute("INSERT INTO activity(id,activity_acs_id,user_id,user_name,targetedUserID,category,targetedObjectID,additionalData,updated_at) VALUES(NULL,?,?,?,?,?,?,?,?)", curActivity.id,curActivity.user.id,name,curActivity.targetedUserID,curActivity.category,curActivity.targetedObjectID,curActivity.additionalData,curActivity.updated_at);
	}
	db.close();
	Ti.App.fireEvent("activityDbUpdated");
};
//fetch
exports.activityModel_fetchActivity = function(_id) {
	var fetchedActivity = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM activity WHERE targetedUserID = ? ORDER BY updated_at DESC', _id);
	while(result.isValidRow()) {
		fetchedActivity.push({
			id: result.fieldByName('id'),
			activity_acs_id: result.fieldByName('activity_acs_id'),
			user_id: result.fieldByName('user_id'),
			user_name: result.fieldByName('user_name'),
			targetedUserID: result.fieldByName('targetedUserID'),
			category: result.fieldByName('category'),
			targetedObjectID: result.fieldByName('targetedObjectID'),
			additionalData: result.fieldByName('additionalData'),
			updated_at: result.fieldByName('updated_at')
		});
		result.next();
	}
	result.close();
	db.close();
	return fetchedActivity;
};
//create temporary activity into database
exports.activityModel_create = function(_activity){
	var now = moment().format('YYYY-MM-DDTHH:mm:ss');
	var db = Ti.Database.open('Chatterbox'); 
	var curActivity = _activity;
	db.execute("INSERT INTO activity(id,activity_acs_id,user_id,targetedUserID,category,targetedObjectID,additionalData,updated_at) VALUES(NULL,NULL,?,?,?,?,?,?)", curActivity.user_id,curActivity.targetedUserID,curActivity.category,curActivity.targetedObjectID,curActivity.additionalData,now);
	var newId = db.lastInsertRowId;
	db.close(); 
	return newId;
};

exports.activity_updateOne = function(_activity){
	var db = Ti.Database.open('Chatterbox'); 
	var curActivity = _activity;
	db.execute("UPDATE activity SET activity_acs_id = ? WHERE id= ?", curActivity.id,curActivity.custom_fields.local_id);
	Ti.API.info("activity_updateOne success");
	db.close();
};