//check if you reach new badge or not!
var getNumCheckinsOfType = function(_programType) {
	if(!Ti.App.Properties.hasProperty(_programType+'Count')) { //do some caching
		Ti.App.Properties.setInt(_programType+'Count',1);
		return 1;
	} else {
		var numCheckInsSoFar = Ti.App.Properties.getInt(_programType+'Count');
		var newNumCheckins = numCheckInsSoFar + 1
		Ti.App.Properties.setString(_programType+'Count',newNumCheckins);
		return newNumCheckins;
	}	
}
exports.getNumCheckinsOfType = getNumCheckinsOfType;

var getNumCheckinsOfProgramId = function(_programId) {
	if(!Ti.App.Properties.hasProperty(_programId+'Count')) { //do some caching
		Ti.App.Properties.setInt(_programId+'Count',1);
		return 1;
	} else {
		var numCheckInsSoFar = Ti.App.Properties.getInt(_programId+'Count');
		var newNumCheckins = numCheckInsSoFar + 1
		Ti.App.Properties.setString(_programId+'Count',newNumCheckins);
		Ti.API.info('getNumCheckinsOfProgramId: '+_programId+'//'+newNumCheckins);
		return newNumCheckins;
	}	
}
exports.getNumCheckinsOfProgramId = getNumCheckinsOfProgramId;

////////////////////////////////////////////////////////////////////////
var checkCountCondition = function(e) {
	var checkinCount = e.result;
	//badge desc: i'm loving it		
	//condition: 20th check in
	//badge id: 2
	if(checkinCount >= 20) Ti.App.fireEvent('badgeConditionUpdate'+acs.getUserId(), {badgeID: 2});
	//badge desc: fall for you	
	//condition: 10th check in	
	//badge id: 1
	else if(checkinCount >= 10) Ti.App.fireEvent('badgeConditionUpdate'+acs.getUserId(),{badgeID: 1});	
	//badge desc: nice to meet you
	//condition: 1st check in
	//badge id: 0
	else if(checkinCount >= 1)
		Ti.App.fireEvent('badgeConditionUpdate'+acs.getUserId(),{badgeID: 0});
}

exports.checkFriendCondition = function(_friendCheckIn) {
	//badge desc: love sharing		
	//condition: checkin with more than 5 friends
	//badge id: 3	
	if(_friendCheckIn >= 3) {
		Ti.App.fireEvent('badgeConditionUpdate'+acs.getUserId(), {badgeID: 3});
		return true;
	} else {
		return false;
	}
}	
	
var checkTypeCondition = function(_type) {
	var checkinCount = getNumCheckinsOfType(_type);
	Ti.API.info('checkinCount// '+_type+' = '+checkinCount);
	var badgeEarn = false;
	if(checkinCount==5) {
		switch (_type){
			//badge desc: sports fan		
			//condition: 4 checkins in sport
			//badge id: 4
			case 'sport': {
				Ti.App.fireEvent('badgeConditionUpdate'+acs.getUserId(), {badgeID: 4});
				badgeEarn = true;
				break;
			};
			//badge desc: drama queen		
			//condition: 4 checkins in drama
			//badge id: 5
			case 'drama': {
				Ti.App.fireEvent('badgeConditionUpdate'+acs.getUserId(), {badgeID: 5});
				badgeEarn = true;
				break;
			};
			//badge desc: game show addict		
			//condition: 4 checkins in gameshow
			//badge id: 6
			case 'gameshow': {
				Ti.App.fireEvent('badgeConditionUpdate'+acs.getUserId(), {badgeID: 6});
				badgeEarn = true;
				break;
			};			
		}
	}
	return badgeEarn;
}
		
var checkTimeCondition = function() {
	var badgeEarn = false;
	var now = moment().format('HH');
	//badge desc: early bird	
	//condition: checkin 5.00-7.59 am
	//badge id: 7
	if(now === '05' || now === '06' || now === '07') {
		Ti.App.fireEvent('badgeConditionUpdate'+acs.getUserId(),{badgeID: 7});
		badgeEarn = true;
	}
	//badge desc: insomnia		
	//condition: checkin 1.00 - 3.59 am
	//badge id: 8
	if(now === '01' || now === '02' || now === '03') {
		Ti.App.fireEvent('badgeConditionUpdate'+acs.getUserId(),{badgeID: 8});
		badgeEarn = true;
	}
	return badgeEarn;
}

var determineShowBadgeId = function(_programId,_numCheckins) {
	Ti.API.info('_programId: '+_programId+'/_numCheckin: '+_numCheckins);
	if(_programId === "CH3_ATTEN") {
		//badge desc: At-Ten Fan LV3; condition: 10 checkins in At-Ten; badge id: 11
		if(_numCheckins >= 10) return 11;
	
		//badge desc: At-Ten Fan LV2; condition: 4 checkins in At-Ten; badge id: 10
		if(_numCheckins >= 4) return 10;
		
		//badge desc: At-Ten Fan LV1; condition: 1 checkins in At-Ten; badge id: 9
		if(_numCheckins >= 1) return 9;
	} else if(_programId === "CH3_TNSHO") {
		//badge desc: At-Ten Fan LV3; condition: 10 checkins in At-Ten; badge id: 14			
		if(_numCheckins >= 10) return 14;

		//badge desc: At-Ten Fan LV2; condition: 4 checkins in At-Ten; badge id: 13	
		if(_numCheckins >= 4) return 13;
				
		//badge desc: At-Ten Fan LV1; condition: 1 checkins in At-Ten; badge id: 12		
		if(_numCheckins >= 1) return 12;
	} else if(_programId === "CH3_WMTWM") {
		//badge desc: Woman to Woman Fan LV3; condition: 10 checkins in Woman to Woman; badge id: 17			
		if(_numCheckins >= 10) return 17;

		//badge desc: Woman to Woman Fan LV2; condition: 4 checkins in Woman to Woman; badge id: 16	
		if(_numCheckins >= 4) return 16;
				
		//badge desc: Woman to Woman Fan LV1; condition: 1 checkins in Woman to Woman; badge id: 15		
		if(_numCheckins >= 1) return 15;
	} else if(_programId === "CH3_MNEWS") {
		//badge desc: Morning News Fan LV3; condition: 10 checkins in Morning News; badge id: 20	
		if(_numCheckins >= 10) return 20;
		
		//badge desc: Morning News Fan LV2; condition: 4 checkins in Morning News; badge id: 19
		if(_numCheckins >= 4) return 19;
		
		//badge desc: Morning News Fan LV1; condition: 1 checkins in Morning News; badge id: 18
		if(_numCheckins >= 1) return 18;
	} else if(_programId === "CH3_STSNE") {
		//badge desc: Sat-Sun News Fan LV3; condition: 10 checkins in Sat-Sun News; badge id: 23	
		if(_numCheckins >= 10) return 23;
		
		//badge desc: Sat-Sun News Fan LV2; condition: 4 checkins in Sat-Sun News; badge id: 22
		if(_numCheckins >= 4) return 22;
		
		//badge desc: Sat-Sun News Fan LV1; condition: 1 checkins in Sat-Sun News; badge id: 21
		if(_numCheckins >= 1) return 21;
	} else if(_programId === "CH5_JOJAI") {
		//badge desc: Jor Jai Fan LV3; condition: 10 checkins in Jor Jai; badge id: 26	
		if(_numCheckins >= 10) return 26;
		
		//badge desc: Jor Jai Fan LV2; condition: 4 checkins in Jor Jai; badge id: 25
		if(_numCheckins >= 4) return 25;
		
		//badge desc: Jor Jai Fan LV1; condition: 1 checkins in Jor Jai; badge id: 24
		if(_numCheckins >= 1) return 24;
	} else if(_programId === "CH5_SABUD") {
		//badge desc: Sabud Show Fan LV3; condition: 10 checkins in Sabud Show; badge id: 29	
		if(_numCheckins >= 10) return 29;
		//badge desc: Sabud Show Fan LV2; condition: 4 checkins in Sabud Show; badge id: 28
		if(_numCheckins >= 4) return 28;
		//badge desc: Sabud Show Fan LV1; condition: 1 checkins in Sabud Show; badge id: 27
		if(_numCheckins >= 1) return 27;
		
	} else if(_programId === "CH9_WDYKU") {
		//badge desc: Woody Talk Show Fan LV3; condition: 10 checkins in Woody Talk Show; badge id: 32	
		if(_numCheckins >= 10) return 32;
		
		//badge desc: Woody Talk Show Fan LV2; condition: 4 checkins in Woody Talk Show; badge id: 31
		if(_numCheckins >= 4) return 31;
		
		//badge desc: Woody Talk Show Fan LV1; condition: 1 checkins in Woody Talk Show; badge id: 30
		if(_numCheckins >= 1) return 30;
	} else if(_programId === "CH9_WDYMN") {
		//badge desc: Morning Woody Fan LV3; condition: 10 checkins in  Morning Woody; badge id: 35	
		if(_numCheckins >= 10) return 35;
		
		//badge desc: Morning Woody Fan LV2; condition: 4 checkins in  Morning Woody; badge id: 34
		if(_numCheckins >= 4) return 34;
		
		//badge desc: Morning Woody Fan LV1; condition: 1 checkins in  Morning Woody; badge id: 33
		if(_numCheckins >= 1) return 33;
	} else if(_programId === "CH7_IRCHF") {
		//badge desc: Iron Chef Thailand Fan LV3; condition: 10 checkins in  Iron Chef Thailand; badge id: 38	
		if(_numCheckins >= 10) return 38;
		
		//badge desc: Iron Chef Thailand Fan LV2; condition: 4 checkins in  Iron Chef Thailand; badge id: 37
		if(_numCheckins >= 4) return 37;
		
		//badge desc: Iron Chef Thailand Fan LV1; condition: 1 checkins in  Iron Chef Thailand; badge id: 36
		if(_numCheckins >= 1) return 36;
	}
	return undefined;
}

var checkProgramCondition = function(_programId) {
	var BadgeShowPermissionACS = require('acs/badgeShowPermissionACS');
	var checkinCount = getNumCheckinsOfProgramId(_programId);
	Ti.API.info('checkinCount/'+_programId+' = '+checkinCount);
	if(BadgeShowPermissionACS.getBadgeOfShowPermission(_programId)) {
		var badgeId = determineShowBadgeId(_programId,checkinCount);
	}
	if(badgeId !== undefined) {
		Ti.App.fireEvent('badgeConditionUpdate'+acs.getUserId(), {badgeID: badgeId});
		return true;
	} else return false;
}

Ti.App.addEventListener('UserTotalCheckInsFromACS'+acs.getUserId(), checkCountCondition);

/////////////////////////////////////////////////////////////////////

exports.checkinEvent = function(_checkinData){
	
	var r1 = checkTimeCondition();
	var r2 = checkTypeCondition(_checkinData.program_type);
	var r3 = checkProgramCondition(_checkinData.program_id);
	return (r1 || r2 || r3);
}

exports.badgeCondition_createBadgeUnlocked = function(_badgeID,_userID){
	var myBadgeACS = require('acs/myBadgeACS');
	var my_id = acs.getUserId();
	if(my_id===_userID) myBadgeACS.myBadgeACS_createNewBadge(my_id,_badgeID);
};
