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
exports.activityModel_fetchedActivityFromACS = function(_activityCollection) {
//	Ti.API.info('checkinModel_updateCheckinsFromACS');
	var db = Ti.Database.open('Chatterbox'); 
	db.execute('DELETE FROM activity');
	Ti.API.info('_activityCollection.length: '+ _activityCollection.length);
	for(var i=0;i < _activityCollection.length; i++) {
		var curActivity = _activityCollection[i];
		var name = curActivity.user.first_name + ' ' + curActivity.user.last_name; 
		//curActivity.updated_at = xxcurActivity.updated_at;//
		db.execute("INSERT INTO activity(id,activity_acs_id,user_id,user_name,targetedUserID,category,targetedObjectID,additionalData,updated_at) VALUES(NULL,?,?,?,?,?,?,?,?)", curActivity.id,curActivity.user.id,name,curActivity.targetedUserID,curActivity.category,curActivity.targetedObjectID,curActivity.additionalData,curActivity.updated_at);
		Ti.API.info(db.lastInsertRowId);	
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
	var now = convertACSTimeToLocalTime(moment().format('YYYY-MM-DDTHH:mm:ss'));
	var db = Ti.Database.open('Chatterbox'); 
	var curActivity = _activity;
	//curActivity.updated_at = convertACSTimeToLocalTime(curActivity.updated_at);
	Ti.API.info('activityModel_create: ' +curActivity.user_id + ' has been ' + curActivity.category + ' at ' + curActivity.additionalData + ': ' + curActivity.targetedObjectID + ' at '+now);
	db.execute("INSERT INTO activity(id,activity_acs_id,user_id,targetedUserID,category,targetedObjectID,additionalData,updated_at) VALUES(NULL,NULL,?,?,?,?,?,?)", curActivity.user_id,curActivity.targetedUserID,curActivity.category,curActivity.targetedObjectID,curActivity.additionalData,now);
	var newId = db.lastInsertRowId;
	Ti.API.info('activityModel_create / db.lastInsertRowId: '+ newId);
	db.close(); 
	//Ti.App.fireEvent("createActivityDbUpdated",_activity);
	return newId;
};

exports.activity_updateOne = function(_activity){
	var db = Ti.Database.open('Chatterbox'); 
	var curActivity = _activity;
	db.execute("UPDATE activity SET activity_acs_id = ? WHERE id= ?", curActivity.id,curActivity.custom_fields.local_id);
	Ti.API.info("activity_updateOne success");
	Ti.API.info("activity database row: " + curActivity.custom_fields.local_id + " activity acs id: " + curActivity.id);
	//Ti.API.fireEvent('activityDbUpdated');
	db.close();
};