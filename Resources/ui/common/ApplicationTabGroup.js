
function ApplicationTabGroup() {

    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup();

    var LoginWindow = require('ui/common/LoginWindow');
	var SignupWindow = require('ui/common/SignupWindow');

    var loginwin = new LoginWindow();
    var signupwin = new SignupWindow();

    var tab1 = Titanium.UI.createTab({  
        icon:'/images/fugitives.png',
        title:'Login',
        window:loginwin
    });
    loginwin.containingTab = tab1;

    var tab2 = Titanium.UI.createTab({  
        icon:'/images/captured.png',
        title:'Signup',
        window:signupwin
    });
    signupwin.containingTab = tab2

    self.addTab(tab1);  
    self.addTab(tab2);  

    // open tab group
    return self;
};

module.exports = ApplicationTabGroup;