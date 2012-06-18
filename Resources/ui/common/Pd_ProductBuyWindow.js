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
	
	var scrollView = Ti.UI.createScrollView({
		contentWidth: 'auto',
  		contentHeight: 'auto',
 		showVerticalScrollIndicator: true,
  		showHorizontalScrollIndicator: false,
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
	
	var buyButton = Ti.UI.createButton({
		top: 300,
		backgroundImage: 'images/product/buynow.png',
		width: 149,
		height: 35
	});
	
	var productDetailView = Ti.UI.createView({
		top:300,
		bottom: 10,
		width: 298,
		height: 264,
		left: 10,
		right: 10,
		
		backgroundImage: 'images/product/productdetail.png'
	});
	
	var productName = Ti.UI.createLabel({
		top: 60,
		text: _product.product_name,
		font: { fontSize: 26, fontFamily: 'Helvetica Neue', fontWeight: 'bold'},
		left: 15
	});
	productDetailView.add(productName);
	
	var productDescription = Ti.UI.createLabel({
		top: 100,
		text: 'Description: '+_product.description,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		left: 15
	});
	productDetailView.add(productDescription);
	
	var productPrice = Ti.UI.createLabel({
		top: 120,
		text: 'Price: '+_product.price,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		left: 15
	});
	productDetailView.add(productPrice);
	
	var productContact = Ti.UI.createLabel({
		top: 140,
		text: 'Contact: '+_product.contact,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		left: 15
	});
	productDetailView.add(productContact);
	
	self.add(scrollView);
	scrollView.add(barOfProduct);
	scrollView.add(productImage);
	scrollView.add(productDetailView);
	
	return self;
	
}
module.exports = ProductBuyWindow;
