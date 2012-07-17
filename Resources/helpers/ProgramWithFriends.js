ProgramWithFriends = function(_checkin){
	var TVProgramModel = require('model/tvprogram');
	var photoImage = 'http://storage.cloud.appcelerator.com/Za6GkEHPsBrL0y22LT1XibgwazZTVhnE/photos/ee/ca/4fc858ac0020443e8c003d9a/Screen%20Shot%202555-06-01%20at%2012.49.59%20PM_original.png';

	
	var checkinProgram = TVProgramModel.TVProgramModel_fetchProgramOfEventId(_checkin.event_id);
	
	if(checkinProgram.programImage === null || checkinProgram.programImage === undefined)
		checkinProgram.programImage = photoImage;
								
	this.eventId = checkinProgram.eventId;
	this.programName = checkinProgram.programName;
	this.programSubName = checkinProgram.programSubName;
	this.programImage = checkinProgram.programImage;
	this.programStartTime = checkinProgram.programStartTime;
	this.programEndTime = checkinProgram.programEndTime;
	this.numberCheckins = checkinProgram.numberCheckins;
	this.programChannelId = checkinProgram.programChannelId;
	this.programId = checkinProgram.programId;
	this.programType = checkinProgram.programType;
	this.friends = [];
}
module.exports = ProgramWithFriends;