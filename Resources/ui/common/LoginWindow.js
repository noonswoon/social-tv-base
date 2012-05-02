var LoginWindow = function() {
	var acs = require('lib/acs');
	var action = 'login'; //action switcher between create/login
	
	var lWin = Ti.UI.createWindow({
		backgroundColor: '#333'
	});
	
	var lwDialog = Ti.UI.createView({
		top:20,
		width:'300dp',
		height:'300dp',
		borderWidth:2,
		borderRadius: 6, 
		borderColor:'#ddd',
		backgroundColor:'#999',
		layout:'vertical'
	});
	
	var title = Ti.UI.createLabel({
		text:'Login',
		top:5,
		width:Ti.UI.FILL,
		height:Ti.UI.SIZE,
		font: {
			fontWeight: 'bold',
			fontSize: '24'
		},
		textAlign: 'center',
		color:'#ddd'
	});
	lwDialog.add(title);
	
	var username = Ti.UI.createTextField({
		hintText:'Username',
		autocorrect:false,
		autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		top:5,
		width:'90%',
		height:40,
		font: {
			fontWeight: 'normal',
			fontSize: '17'
		},
		textAlign: 'center',
		color:'#333',
		backgroundColor: '#ddd',
		borderRadius:3,
		paddingLeft:2, 
		paddingRight:2
	});
	lwDialog.add(username);
	
	var password = Ti.UI.createTextField({
		hintText:'Password',
		passwordMask:true,
		autocorrect:false,
		autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		top:5,
		width:'90%',
		height:40,
		font: {
			fontWeight: 'normal',
			fontSize: '17'
		},
		textAlign: 'center',
		color:'#333',
		backgroundColor: '#ddd',
		borderRadius:3,
		paddingLeft:2, 
		paddingRight:2
	});
	lwDialog.add(password);
	
	var confirm = Ti.UI.createTextField({
		hintText:'Confirm Password',
		passwordMask:true,
		autocorrect:false,
		autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		top:5,
		width:'90%',
		height:40,
		font: {
			fontWeight: 'normal',
			fontSize: '17'
		},
		textAlign: 'center',
		color:'#333',
		backgroundColor: '#ddd',
		borderRadius:3,
		paddingLeft:2, 
		paddingRight:2,
		visible: false
	});
	lwDialog.add(confirm);
	
	var loginButton = Ti.UI.createButton({
		title:'Login',
		top:15,
		width: 200,
		height: Ti.UI.SIZE
	});
	
	function cb() {
		if(acs.isLoggedIn()===true) {
			lWin.close();
		} else {
			alert('Something is wrong..cannot login');
			loginButton.title = 'Login';
			loginButton.enabled = true;
		}
	}
	
	loginButton.addEventListener('click',function() {
		loginButton.title = 'Please wait...';
		loginButton.enabled = false;
			
		if(action==='login') {
			acs.login(username.value,password.value,cb);
		} else {
			acs.createUser(username.value,password.value,cb);
		}
	});
	lwDialog.add(loginButton);
	
	var switchAction = Ti.UI.createLabel({
		text:'Create User',
		top:15,
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		font: {
			fontWeight: 'normal',
			fontSize:'17'
		},
		textAlign: 'center',
		color: 'red',
		touchEnabled: true
	});
	
	switchAction.addEventListener('click',function() {
		if(action=='login') { //do the swap if login go to create user and vice versa
			title.text = 'Create User';
			switchAction.text = 'Login';
			loginButton.title = 'Create User';
			lWin.title = 'Create User';
			confirm.visible = true;
			action = 'createuser';
		} else {
			title.text = 'Login';
			switchAction.text = 'Create User';
			loginButton.title = 'Login';
			lWin.title = 'Login';
			confirm.visible = false;
			action = 'login';
		}
	});
	lwDialog.add(switchAction);
	
	lWin.addEventListener('click',function() {
		for(var i=0, j=lwDialog.children.length;i<j;i++) {
			try {
				lwDialog.children[i].blur();
			} catch(err) { }
		}
	});
	
	lWin.add(lwDialog);
	return lWin;
	
};

module.exports = LoginWindow;
