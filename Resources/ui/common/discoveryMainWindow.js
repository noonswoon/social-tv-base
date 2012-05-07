function DiscoveryMainWindow(){
	
	var self = Ti.UI.createWindow({
		title: 'Discovery',
		backgroundColor: 'white'
	});
	

	var tabbar = Ti.UI.createTabbedBar({
		labels: ['Popular','Guide','Friends'],
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height:35,
		width:200,
	});
	self.add(tabbar);
	
	var tabHeader = Ti.UI.createView({
		top: 0,
		height: 50,
		backgroundColor: 'orange'
	});
	
	tabHeader.add(tabbar);
	self.add(tabHeader);
	
	var info = [];
	// var rowsArray = [];		
	for(var c=0;c<5;c++){
		
		var row = Ti.UI.createTableViewRow({
			height: 100
		});
		
		var mockLabel = Ti.UI.createLabel({
			text: 'Hawaii Five-O',
			textAlign: 'right',
			right: 50,
			font:{fontWeight:'bold',fontSize:18},
			top: 10
		});
		row.add(mockLabel);
		
		var mockLabel2 = Ti.UI.createLabel({
			text: "Season"+(c+1),
			color: '#420404',
			textAlign:'right',
			font:{fontWeight:'bold',fontSize:13},
			top: 30,
			right:115
		});
		row.add(mockLabel2);
		
		var mockImage = Ti.UI.createImageView({
			image: "http://www.weloveshopping.com/shop/mildmovies/o-207.jpg",
			top: 5,
			left: 10,
			bottom: 5,
			width:125,
			height:89
		});
		row.add(mockImage);
		// rowsArray.push(row);		
		info[c] = row;
	}
	
	var programListTable = Ti.UI.createTableView({
		top: 50,
		data: info
	});
	// programListTable.setData(rowsArray);
	self.add(programListTable);
	
	self.hideNavBar();
	return self;
}
module.exports = DiscoveryMainWindow;
