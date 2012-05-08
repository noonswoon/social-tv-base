var ProfileDetailView = function(){
	var profileDetail = Ti.UI.createView({
		height: 198,
		backgroundColor: '#fff',
		});

	profileDetail.details = Ti.UI.createView({
		height: 190,
		width: 312,
		borderRadius: 5,
		scrollable: true,
		backgroundColor: '#999'});

profileDetail.add(profileDetail.details);	

	return profileDetail;
	}

module.exports = ProfileDetailView;