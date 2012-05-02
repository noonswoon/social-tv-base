//bootstrap database
var db = Ti.Database.open('TiBountyHunter');
db.execute('CREATE TABLE IF NOT EXISTS fugitives(id INTEGER PRIMARY KEY, name TEXT, captured INTEGER, url TEXT, capturedLat REAL, capturedLong REAL);');
db.close();

exports.list = function(_isCaptured) {
	var fugitiveList = [];
	var db = Ti.Database.open('TiBountyHunter'); 
	var result = db.execute('SELECT * FROM fugitives WHERE captured = ? ORDER BY name ASC',(_isCaptured)? 1:0);
	while(result.isValidRow()) {
		fugitiveList.push({
			title: result.fieldByName('name'),
			id: result.fieldByName('id'),
			hasChild:true,
			color: '#fff',
			name: result.fieldByName('name'),
			captured: (Number(result.fieldByName('captured')) ===1 ),
			url: result.fieldByName('url'),
			capturedLat: Number(result.fieldByName('capturedLat')),
			capturedLong: Number(result.fieldByName('capturedLong'))
		});
		result.next();
	}	
	result.close();
	db.close();
	return fugitiveList;
};

var add = function(_name) {
	var db = Ti.Database.open('TiBountyHunter');
	db.execute("INSERT INTO fugitives(name,captured) VALUES(?,?)", _name,0);
	db.close();
	
	//fire message to let others know that database has changed
	Ti.App.fireEvent("databaseUpdated");
};
exports.add = add;

exports.del = function(_id) {
	var db = Ti.Database.open('TiBountyHunter');
	db.execute("DELETE FROM fugitives WHERE id = ?",_id);
	db.close();
	
	Ti.App.fireEvent("databaseUpdated");
};

exports.bust  = function(_id,_lat,_long) {
	var db = Ti.Database.open('TiBountyHunter');
	db.execute("UPDATE fugitives SET captured = 1, capturedLat = ?, capturedLong = ? WHERE id = ?",_lat,_long,_id);
	db.close();
	
	Ti.App.fireEvent("databaseUpdated");
};

exports.addPhoto = function(_id,_photoUrl) {
	var db = Ti.Database.open('TiBountyHunter');
	db.execute("UPDATE fugitives SET url = ? WHERE id = ? ", _photoUrl,_id);
	db.close();
	
	//fire message to let others know that database has changed
	Ti.App.fireEvent("databaseUpdated");
};

if(!Ti.App.Properties.hasProperty('seeded')) {
	var networkFn = require('/lib/network');
	networkFn.getFugitives(function(list) {
		for(var i=0;i<list.length;i++) {
			var name = list[i]['name'];
			add(name);
		}
		Ti.App.Properties.setString('seeded','already');
	});
}