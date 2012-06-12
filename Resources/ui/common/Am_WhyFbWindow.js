var WhyFbWindow = function() {
		
	//UI STUFF
	var win = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/admin/cb_back.png',
		title: "Chatterbox",
		barColor: '#398bb0',
		layout: 'vertical',
		tabBarHidden: true,
		navBarHidden: false
	});
	
	var fbExplHeader = Ti.UI.createLabel({
		top: 5,
		left: 5,
		color: '#fff',
		textAlign: 'center',
		font: { fontSize: 20, fontFamily: 'Helvetica Neue', fontWeight:'bold'},
		text: 	'Why we use Facebook'
	});
	
	var fbExplPrelim = Ti.UI.createLabel({
		top: 15,
		left: 5,
		color: '#fff',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 	'Using Facebook as our login system helps improve the user experience in a number of ways:'
	});
	
	var fbExplFirst = Ti.UI.createLabel({
		top: 15,
		left: 20,
		color: '#fff',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 	'1.) It makes it super fast to sign up and create a Chatterbox profile'
	});
	
	var fbExplSecond = Ti.UI.createLabel({
		top: 15,
		left: 20,
		color: '#fff',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 	'2.) It allows you to see what friends you have in common with other Chatterbox users'
	});
	
	var fbExplThird = Ti.UI.createLabel({
		top: 15,
		left: 20,
		color: '#fff',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 	'3.) It helps ensure that people are using their real identities'
	});
	
	var fbExplConclude = Ti.UI.createLabel({
		top: 15,
		left: 5,
		color: '#fff',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 	'We really want to earn your trust and we will not auto-post to your account or misuse your personal information in any way.'
	});
	
	var fbExplContact = Ti.UI.createLabel({
		top: 15,
		left: 5,
		color: '#fff',
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		text: 'Please let us know if you\'d like more login options or have feedback on this. Thanks!'
	});
	
	win.add(fbExplHeader);
	win.add(fbExplPrelim);
	win.add(fbExplFirst);
	win.add(fbExplSecond);
	win.add(fbExplThird);
	win.add(fbExplConclude);
	win.add(fbExplContact);
	
	//ADDING UI COMPONENTS TO WINDOW
	
	
	//FUNCTIONS CALLBACK
	
	return win;
};

module.exports = WhyFbWindow;

