
function ApplicationWindow(_isCaptured) {
	var LoginWindow = require('ui/common/LoginWindow');
	
	var self = Titanium.UI.createWindow({
		backgroundColor: 'transparent',
		backgroundImage: '/images/grain.png',
		title: (_isCaptured)? 'captured': 'fugitives',
		barColor: "#6d0a0c",
		activity : {
			onCreateOptionsMenu : function(e) {
				var menu = e.menu;
				var m1 = menu.add({ title : 'add' });
				m1.addEventListener('click', function(e) {
				//open in tab group to get free title bar (android)
					alert("open Add window in the tab");
					//self.containingTab.open(new AddWindow);
				});
			}
		}
	});

	var BountyTable = require('ui/common/BountyTable');
	var bountyTable = new BountyTable(_isCaptured);
	
	bountyTable.addEventListener('click', function(_e) {
		alert("show detail window");
		var LoginWin = require('ui/common/LoginWindow');
		var loginwindow = new LoginWin();
		self.containingTab.open(loginwindow);
		
		//self.containingTab.open(new LoginWindow);
	});
	
	self.add(bountyTable);

	if(Ti.Platform.osname === 'iphone') {
		var b = Titanium.UI.createButton({
			title: L('add'),
			style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});

		b.addEventListener('click',function() {
			//self.containingTab.open(new AddWindow);
			alert("open Add window in the tab");
		});
		self.setRightNavButton(b);
	}
	return self;
};

module.exports = ApplicationWindow;