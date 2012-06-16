ProductBuyWindow = function(_product){
	
	var backButton = Ti.UI.createButton({
        backgroundImage:'images/Backbutton.png',
        width:57,height:34
	});
	
	var self = Ti.UI.createWindow({
		title: 'Product',
		barImage: 'images/NavBG.png',
		backgroundImage: 'images/bg.png',
		leftNavButton: backButton
	});

	backButton.addEventListener('click', function(){
   		self.close();
	});
	
	var productImage = Ti.UI.createImageView({
		image: _product.product_image,
		top: 20,
		width: 181,
		height: 237,
		borderColor: 'white',
		borderWidth: 5
	});
	
	var barOfProduct = Ti.UI.createImageView({
		image: 'images/product/barofproduct.png',
		top: 254
	});
	
	var productName = Ti.UI.createLabel({
		text: _product.product_name,
	});
	
	self.add(barOfProduct);
	self.add(productImage);
	self.add(productName);
	
	return self;
	
}
module.exports = ProductBuyWindow;
