/**
 * @author Mickey Asavanant
 */
var BountyTableView = function(_isCaptured) {
	var tv = Titanium.UI.createTableView({
		backgroundColor: 'transparent',
		title: (_isCaptured)? L('captured')+"d-d": L('fugitivies')+"s-s"
	});

	function populateData() {
		var db = require('lib/db');
		var results = db.list(_isCaptured);
		tv.setData(results);
	}
	Ti.App.addEventListener('databaseUpdated',populateData);

	populateData();
	return tv;
};

module.exports = BountyTableView;