ProgramWithFriends = function(_checkin){
	
	this.programId = _checkin.id;
	this.programName = _checkin.name;
	this.programImage = 'http://storage.cloud.appcelerator.com/Za6GkEHPsBrL0y22LT1XibgwazZTVhnE/photos/ee/ca/4fc858ac0020443e8c003d9a/Screen%20Shot%202555-06-01%20at%2012.49.59%20PM_original.png';
	this.programChannel = _checkin.custom_fields.channel_id;
	this.friends = [];
	
}
module.exports = ProgramWithFriends;