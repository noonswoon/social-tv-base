ProductMainWindowTableViewRow = function(){
	
	var row = Ti.UI.createTableViewRow();
	
	var productName = Ti.UI.createLabel({
		text: 'Reya Dress',
		textAlign: 'left',
		color: '#333',
		left: 145,
		height: 30,
		width: 142,
		font:{fontWeight:'bold',fontSize:17},
		top: 5
	});
	row.add(productName);
	
	var productDescription = Ti.UI.createLabel({
		text: 'Chom wear this dress in lakorn ka',
		color: 'gray',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 33,
		left:145
	});
	row.add(productDescription);
	
	var productPrice = Ti.UI.createLabel({
		text: 'Price: 200 Baht',
		color: 'gray',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 70,
		left:145
	});
	row.add(productPrice);
	
	var productContact = Ti.UI.createLabel({
		text: 'Tel: 0-2555-5555',
		color: 'gray',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 87,
		left:145
	});
	row.add(productContact);
	
	var productImage = Ti.UI.createImageView({
		image: 'http://storage.cloud.appcelerator.com/Za6GkEHPsBrL0y22LT1XibgwazZTVhnE/photos/98/5c/4fc9a618e421372344000018/Screen%20Shot%202555-06-02%20at%2012.34.20%20PM_original.png',
		left: 5,
		width:150,
		height:125,
	});
	row.add(productImage);

	return row;
}
module.exports = ProductMainWindowTableViewRow;
