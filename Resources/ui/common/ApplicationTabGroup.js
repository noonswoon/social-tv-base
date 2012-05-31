function ApplicationTabGroup() {
    // create tab group, create module instance
    var self = Titanium.UI.createTabGroup();

	var ChannelSelectionMainWindow = require('ui/common/Cs_ChannelSelectionMainWindow');
	var ChatMainWindow = require('ui/common/Ct_ChatMainWindow'); 
	var MessageboardMainWindow = require('ui/common/Mb_MessageboardMainWindow');
	var ProductMainWindow = require('ui/common/Pd_ProductMainWindow');
	var ProfileMainWindow = require('ui/common/Pf_ProfileMainWindow');
	var SettingWindow = require('ui/common/Am_SettingWindow');
    
	var selectionMainWin = new SettingWindow();//new ChannelSelectionMainWindow();
	
	var programDummy = {
				programId: '4fb3618c0020442a2b0186c0', 
				programTitle:'Khun Suuk', 
				programSubname:'Fighting!',
				programImage: 'dummy.png',
				programChannel: 'C3',
				programNumCheckin: 25345
			};
	var chatwin = new ChatMainWindow(programDummy);
	var messageboardwin =  new MessageboardMainWindow(1);		
	var productwin = new SettingWindow();//new ProductMainWindow();
	var profilewin =  new SettingWindow();//new ProfileMainWindow();

	var tabIndexToComeBack = 0;
	var selectionTab = Ti.UI.createTab({
		title: 'Selection',
		icon: '/images/tv.png',
		window: selectionMainWin
	});
	selectionMainWin.containingTab = selectionTab;
	selectionTab.addEventListener('focus', function() {
		tabIndexToComeBack = 0;	 //for redirecting when chat window is close
	});
	
    var chatTab = Titanium.UI.createTab({  
        icon:'/images/icon/Chat-Bubble.png',
        title:'Chat',
       // window:chatwin
    });
    chatwin.containingTab = chatTab;
    
    chatTab.addEventListener('focus', function() {
    	var w = Ti.UI.createWindow({backgroundColor:"red"});
		var b = Ti.UI.createButton({
			title:"Close with Animation",
			width:180,
			height:40
		});
		w.add(b);
		b.addEventListener('click',function()
		{
			w.close({animated:true});
//			Ti.API.info('prevTab: '+tabIndex);
			self.setActiveTab(self.tabs[tabIndexToComeBack]);
		});
		w.open();
    });
    
    var messageboardTab = Titanium.UI.createTab({  
        icon:'/images/captured.png',
        title:'Board',
        window:messageboardwin
    });
    messageboardwin.containingTab = messageboardTab;
	messageboardTab.addEventListener('focus', function() {
		tabIndexToComeBack = 2;	
	});
	
	var productTab = Ti.UI.createTab({
		icon: '/images/captured.png',
		title: 'Product',
		window: productwin
	});
	productwin.containingTab = productTab;
	productTab.addEventListener('focus', function() {
		tabIndexToComeBack = 3;	
	});
	
	var profileTab = Ti.UI.createTab({
		icon: '/images/fugitives.png',
		title: 'Profile',
		window: profilewin
 	});
	profilewin.containingTab = profileTab;
	profileTab.addEventListener('focus', function() {
		tabIndexToComeBack = 4;	
	});
	
	self.addTab(selectionTab);
    self.addTab(chatTab);  
    self.addTab(messageboardTab);  
    self.addTab(productTab);
    self.addTab(profileTab);
    //save 1-clcik, direct to message board functionality
   	self.setActiveTab(self.tabs[2]);
    return self;
};

module.exports = ApplicationTabGroup;