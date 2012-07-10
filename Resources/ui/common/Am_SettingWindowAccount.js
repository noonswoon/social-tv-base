var Am_SettingWindowAccount = function(){
	
	var UserACS = require('acs/userACS');
	var UserModel = require('model/user');
	
	var userInfo = acs.getUserLoggedIn();
	var curUserId = userInfo.id;
	
	var dataForSetting = [];

	var backButton = Ti.UI.createButton({
        backgroundImage:'images/back_button.png',
        width:57,height:34
	});

	var self = Ti.UI.createWindow({
		backgroundImage: '/images/admin/cb_back.png',
		barImage: 'images/nav_bg_w_pattern.png',
		title: 'Account Setting',
		leftNavButton: backButton
	});

	backButton.addEventListener('click', function(){
   		self.close();
	});
	
	var accountTableView = Ti.UI.createTableView({
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'transparent',
		rowBackgroundColor:'white',
		scrollable:false,
		separatorColor: '#ebebeb'
	});
	
	//FirstName
	var firstName = Ti.UI.createTableViewRow({
		selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		height: 50
	});
	
	var firstNameLabel = Ti.UI.createLabel({
		text: 'First Name',
		font:{fontWeight:'bold',fontSize:16},
		left: 10
	});
	firstName.add(firstNameLabel);
	
	var firstNameTextfield = Ti.UI.createTextField({
		color:'#336699',
		height:35,
		right:10,
		width:180,
		value: userInfo.first_name,
		editable: true,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	firstName.add(firstNameTextfield);
	
	//LastName
	var lastName = Ti.UI.createTableViewRow({
		selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		height: 50
	});
	
	var lastNameLabel = Ti.UI.createLabel({
		text: 'Last Name',
		font:{fontWeight:'bold',fontSize:16},
		left: 10
	});
	lastName.add(lastNameLabel);
	
	var lastNameTextfield = Ti.UI.createTextField({
		color:'#336699',
		height:35,
		right:10,
		width:180,
		value: userInfo.last_name,
		editable: true,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	lastName.add(lastNameTextfield);
	
	//Button
	var text = [];
	
	var saveButtonTableViewRow = Ti.UI.createTableViewRow({
		height: 40
	});
	
	var saveButtonLabel = Ti.UI.createLabel({
		text: 'Save Changes',
		font:{fontWeight:'bold',fontSize:16}
	});
	saveButtonTableViewRow.add(saveButtonLabel);
	
	var saveButton = Ti.UI.createTableView({
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'transparent',
		rowBackgroundColor:'white',
		scrollable:false,
		top: 160,
		separatorColor: 'white'
	});
	text.push(saveButtonTableViewRow);
	saveButton.setData(text);

	//Data in textfield is changed or not
	saveButton.addEventListener('click',function(){
		var newFirstName = firstNameTextfield.value;
		var newLastName = lastNameTextfield.value;
		UserACS.userACS_updatedUser(newFirstName,newLastName);
		UserModel.userModel_updateFirstNameLastName(newFirstName,newLastName,curUserId);
	});
	
	Ti.App.addEventListener('updateComplete',function(e){
		alert('Save Complete');
		acs.getUserLoggedIn().first_name = e.firstName;
		acs.getUserLoggedIn().last_name = e.lastName;
	});
	
	

	dataForSetting.push(firstName);
	dataForSetting.push(lastName);
	accountTableView.setData(dataForSetting);
	self.add(accountTableView);
	self.add(saveButton);
	
	return self;
	
}
module.exports = Am_SettingWindowAccount;
