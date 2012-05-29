var EnterUsernameWindow = function() {
		
	//UI STUFF
	var lWin = Ti.UI.createWindow({
		title: "Login",
		backgroundColor: 'gray',
		barColor: '#6d0a0c',
		layout: 'vertical'
	});
		
	var usernameTextField = Ti.UI.createTextField({
		hintText: 'Choose your username',
		width: 200,
		height: 40,
		top: 5,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue' },
		borderRadius: 5,
		backgroundColor: 'white'
	})
	
	var enterUsername = Ti.UI.createButton({
		title:'Register',
		top:5,
		width:200,
		height:40,
	});
	
	
	//ADDING UI COMPONENTS TO WINDOW
	lWin.add(usernameTextField);
	lWin.add(enterUsername);

	
	//CALLBACK FUNCTIONS
	
	
	//EVENTS REGISTERING		
	enterUsername.addEventListener('click', function() {
		alert('attempt to register username: '+usernameTextField.value);
	});
	
	
	return lWin;
	
};

module.exports = EnterUsernameWindow;