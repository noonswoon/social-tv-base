
function ApplicationTabGroup() {

    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup();

    var Window = require('ui/handheld/ApplicationWindow');

    var fugitiveWin = new Window(false);
    var capturedWin = new Window(true);

    var tab1 = Titanium.UI.createTab({  
        icon:'/images/fugitives.png',
        title:L('fugitives'),
        window:fugitiveWin
    });
    fugitiveWin.containingTab = tab1;

    var tab2 = Titanium.UI.createTab({  
        icon:'/images/captured.png',
        title:L('captured'),
        window:capturedWin
    });
    capturedWin.containingTab = tab2

    self.addTab(tab1);  
    self.addTab(tab2);  

    // open tab group
    return self;
};

module.exports = ApplicationTabGroup;