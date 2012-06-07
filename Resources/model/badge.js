/*badgeID TEXT PRIMARY KEY
 *title TEXT
 *desc TEXT
 *path TEXT 
 *url TEXT*/

var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS badges(badgeID TEXT PRIMARY KEY, title TEXT, desc TEXT, path TEXT, url TEXT);');
db.close();

exports.badgesLoadedFromACS = function(_badgesCollection){
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('DELETE FROM badges');
	for(var i=0;i < _badgesCollection.length; i++) {
		var curBadge = _badgesCollection[i];
		Ti.API.info('_badgesCollection[i].path' + _badgesCollection[i].path);
		db.execute("INSERT INTO badges(badgeID, title, desc, path, url) VALUES(?,?,?,?,?)", _badgesCollection[i].custom_fields.badgeID, _badgesCollection[i].custom_fields.title, _badgesCollection[i].custom_fields.desc, _badgesCollection[i].path, _badgesCollection[i].urls.original);
	}
	db.close();
	Ti.App.fireEvent("badgesDBLoaded");
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
			path: result.fieldByName('path'),
			url: result.fieldByName('url')
		});
		result.next();
	}
	result.close();
	db.close();
	return fetchedBadges;
};

