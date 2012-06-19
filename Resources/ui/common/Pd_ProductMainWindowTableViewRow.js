ProductMainWindowTableViewRow = function(_parent){
	
	var ProductBuyWindow = require('ui/common/Pd_ProductBuyWindow');
	
	var row = Ti.UI.createTableViewRow({
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	var barOfProduct = Ti.UI.createImageView({
		image: 'images/product/barofproduct.png',
		bottom: 0
	});
	
	var productLeftImage = Ti.UI.createImageView({
		left: 30,
		width: 115,
		height: 151,
		bottom: 23,
		top: 10,
		borderColor: 'white',
		borderWidth: 5
	});

	var productRightImage = Ti.UI.createImageView({
		right: 30,
		width: 115,
		height: 152,
		bottom: 23,
		top: 10
	});

	
	row._setProductOnLeftColumn = function(_leftProduct){
		productLeftImage.image = _leftProduct.product_image;
		productLeftImage.addEventListener('click',function(){
			var productBuyWindow = new ProductBuyWindow(_leftProduct);
			_parent.containingTab.open(productBuyWindow);	
		});
	}
	
	row._setProductOnRightColumn = function(_rightProduct){
		productRightImage.image = _rightProduct.product_image;
		productRightImage.borderColor = 'white';
		productRightImage.borderWidth = 5;
		
		productRightImage.addEventListener('click',function(){
			productBuyWindow = new ProductBuyWindow(_rightProduct);
			_parent.containingTab.open(productBuyWindow);	
		});
	}

		
	row.add(barOfProduct);
	row.add(productLeftImage);
	row.add(productRightImage);
	
	return row;
}
module.exports = ProductMainWindowTableViewRow;
