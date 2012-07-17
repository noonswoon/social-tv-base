ProgramWithFriends = function(_checkin){

	var photoImage = 'http://storage.cloud.appcelerator.com/Za6GkEHPsBrL0y22LT1XibgwazZTVhnE/photos/ee/ca/4fc858ac0020443e8c003d9a/Screen%20Shot%202555-06-01%20at%2012.49.59%20PM_original.png';
	var channelId = 'CTB_PUBLIC';
	var subName = '';
	var programId = '';
	
	if(_checkin.custom_fields !== undefined && _checkin.custom_fields.subname !== undefined)
		subName = _checkin.custom_fields.subname;
		
	if(_checkin.photo !== undefined && _checkin.photo.urls !== undefined && _checkin.photo.urls.medium_640 !== undefined)
		photoImage = _checkin.photo.urls.medium_640;
	
	if(_checkin.custom_fields !== undefined && _checkin.custom_fields.channel_id !== undefined)
		channelId = _checkin.custom_fields.channel_id;
	
	if(_checkin.custom_fields !== undefined && _checkin.custom_fields.program_id !== undefined)
		programId = _checkin.custom_fields.program_id;
	
	this.eventId = _checkin.id;
	this.programId = programId;
	this.programName = _checkin.name;
	this.subName = subName;
	this.programImage = photoImage;
	this.programChannel = channelId;
	this.programStarttime = _checkin.start_time;
	this.programEndtime = _checkin.recurring_until;
	this.friends = [];
}
module.exports = ProgramWithFriends;