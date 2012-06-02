ProductMainWindowTableViewRow = function(_product){
	
	var row = Ti.UI.createTableViewRow();
	
	var productName = Ti.UI.createLabel({
		text: _product.product_name,
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
		text: _product.description,
		color: 'gray',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 33,
		left:145
	});
	row.add(productDescription);
	
	var productPrice = Ti.UI.createLabel({
		text: 'Price: '+_product.price,
		color: 'gray',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 70,
		left:145
	});
	row.add(productPrice);
	
	var productContact = Ti.UI.createLabel({
		text: 'Tel: '+_product.contact,
		color: 'gray',
		textAlign:'left',
		font:{fontWeight:'bold',fontSize:13},
		top: 87,
		left:145
	});
	row.add(productContact);
	
	var productImage = Ti.UI.createImageView({
		image: _product.product_image,
		left: 5,
		width: 150,
		height: 100,
		bottom: 10,
		top: 10
	});
	row.add(productImage);

	return row;
}
module.exports = ProductMainWindowTableViewRow;
