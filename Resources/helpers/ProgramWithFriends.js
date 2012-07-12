ProgramWithFriends = function(_checkin){
	this.programId = _checkin.id;
	this.programName = _checkin.name;
	this.programImage = _checkin.photo.urls.medium_640;
	this.programChannel = _checkin.custom_fields.channel_id;
	this.friends = [];
	
}
module.exports = ProgramWithFriends;