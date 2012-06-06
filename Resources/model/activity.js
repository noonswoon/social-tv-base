var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS activity(id INTEGER PRIMARY KEY, activity_acs_id TEXT, user_id TEXT, targetedUserID TEXT, category TEXT, targetedObjectID TEXT, additionalData TEXT, updated_at TEXT);');
db.close();

/* 
 * local_id
 * id TEXT PRIMARY KEY
 * user_id TEXT
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
	//db.execute('DELETE FROM activity');
	for(var i=0;i < _activityCollection.length; i++) {
		var curActivity = _activityCollection[i];
		db.execute("INSERT INTO activity(id,activity_acs_id,user_id,targetedUserID,category,targetedObjectID,additionalData,updated_at) VALUES(NULL,?,?,?,?,?,?)", curActivity.id,curActivity.user.id,curActivity.targetedUserID,curActivity.category,curActivity.targetedObjectID,curActivity.additionalData,curActivity.updated_at);
	}
	db.close();
	//Ti.App.fireEvent("activityDbUpdated");
};
//fetch
exports.activityModel_fetchActivity = function(_id) {
	var fetchedActivity = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM activity WHERE user_id = ? ORDER BY updated_at DESC', _id);
	while(result.isValidRow()) {
		fetchedActivity.push({
			id: result.fieldByName('id'),
			activity_acs_id: result.fieldByName('activity_acs_id'),
			user_id: result.fieldByName('user_id'),
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
exports.activityModel_create = function(_activity,_type){
	var now = moment().format('YYYY-MM-DDTHH:mm:ss');
	var db = Ti.Database.open('Chatterbox'); 
	//type = checkin
	var curActivity = _activity;
	//TODO
	db.execute("INSERT INTO activity(id,activity_acs_id,user_id,targetedUserID,category,targetedObjectID,additionalData,updated_at) VALUES(NULL,NULL,?,?,?,?,?,?)", acs.getUserLoggedIn().id,acs.getUserLoggedIn().id,_type,curActivity.programId,curActivity.programTitle,now);
	//
	db.close();
	//Ti.App.fireEvent("createActivityDbUpdated",_activity);
};
