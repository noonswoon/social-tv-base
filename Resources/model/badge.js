/*badgeID TEXT PRIMARY KEY
 *title TEXT
 *desc TEXT
 * path TEXT
*/

var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS badges(badgeID TEXT PRIMARY KEY, title TEXT, desc TEXT, path TEXT);');
db.close();

exports.badgesLoadedFromACS = function(_badgesCollection){
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('DELETE FROM badges');
	for(var i=0;i < _badgesCollection.length; i++) {
		var curBadge = _badgesCollection[i];
		db.execute("INSERT INTO badges(badgeID, title, desc, path) VALUES(?,?,?,?)", _badgesCollection[i].custom_fields.badgeID, _badgesCollection[i].custom_fields.title, _badgesCollection[i].custom_fields.desc, _badgesCollection[i].path);
	}
	db.close();
	Ti.App.fireEvent("badgesLoaded");
}

exports.badge_fetchBadges = function(){
	var fetchedBadges = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM badges');
	while(result.isValidRow()) {
		fetchedBadges.push({
			badgeID: result.fieldByName('badgeID'),
			title: result.fieldByName('title'),
			desc: result.fieldByName('desc'),
			path: result.fieldByName('path')
		});
		result.next();
	}
	result.close();
	db.close();
	return fetchedBadges;
};

