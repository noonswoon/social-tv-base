var Am_SettingWindowAccount = function(){
	
	var dataForSetting = [];

	var backButton = Ti.UI.createButton({
        backgroundImage:'images/Backbutton.png',
        width:57,height:34
	});

	var self = Ti.UI.createWindow({
		backgroundImage: '/images/admin/cb_back.png',
		barImage: 'images/NavBG.png',
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
	self.add(saveButton);

	dataForSetting.push(firstName);
	dataForSetting.push(lastName);
	accountTableView.setData(dataForSetting);
	self.add(accountTableView);
	
	return self;
	
}
module.exports = Am_SettingWindowAccount;
