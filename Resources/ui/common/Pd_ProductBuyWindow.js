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
	
	var productImageView = Ti.UI.createView({
		top: 20,
		width: 241,
		height: 237,
		zIndex: 3
	});
	
	var productImage = Ti.UI.createImageView({
		image: _product.product_image,
		top: 0,
		width: 181,
		height: 237,
		borderColor: 'white',
		borderWidth: 5
	});
	productImageView.add(productImage);
	
	var priceView = Ti.UI.createView({
		top: 10,
		right: 0,
		width: 62,
		height: 62,
		backgroundImage: 'images/product/price.png'
	});
	productImageView.add(priceView);
	
	var price = Ti.UI.createLabel({
		top: 20,
		right: 5,
		text: _product.price,
		font: { fontSize: 18, fontFamily: 'Helvetica Neue', fontWeight: 'bold' },
		shadowColor:'#666666',
		shadowOffset:{x:1,y:1},
		color: 'white'
	});
	priceView.add(price);
	
	var barOfProduct = Ti.UI.createImageView({
		image: 'images/product/barofproduct.png',
		top: 252
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
	
	var productDetailButton = Ti.UI.createImageView({
		image: 'images/product/productdetail_button.png',
		width: 110,
		height: 32,
		top: 13,
		left: 15
	});
	productDetailView.add(productDetailButton);
	
	var buyNowButton = Ti.UI.createButton({
		backgroundImage: 'images/product/buynow_button.png',
		width: 72,
		height: 32,
		top: 13,
		left: 125
	});
	productDetailView.add(buyNowButton);
	
	buyNowButton.addEventListener('click',function(){
		Ti.Platform.openURL('http://www.google.com');		
	});
	
	var productName = Ti.UI.createLabel({
		top: 60,
		text: _product.product_name,
		font: { fontSize: 24, fontFamily: 'Helvetica Neue', fontWeight: 'bold'},
		left: 15
	});
	productDetailView.add(productName);
	
	var productNameWidth = productName.toImage().width; 
	var productNameHeight = productName.toImage().height; 
	var numLines = Math.ceil(productNameWidth / ONE_LINE_LENGTH); 
	var productDescTopIndent = numLines * productNameHeight;

	var productDescription = Ti.UI.createLabel({
		top: productDescTopIndent+70,
		width: 270,
		height: 50,
		text: 'Description: '+_product.description,
		font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		left: 15
	});
	productDetailView.add(productDescription);
	
	// var productDescWidth = productDescription.toImage().width; 
	// var productDescHeight = productDescription.toImage().height; 
	// var numLines = Math.ceil(productDescWidth / ONE_LINE_LENGTH); 
	// var productLinkTopIndent = numLines * productDescHeight;
// 	
	// var productLink = Ti.UI.createLabel({
		// top: productLinkTopIndent+50,
		// text: 'Link: http://www.google.com',
		// font: { fontSize: 14, fontFamily: 'Helvetica Neue'},
		// left: 15
	// });
	// productDetailView.add(productLink);
	
	// productLink.addEventListener('click',function(){
		// Ti.Platform.openURL('http://www.google.com');
	// });
	
	self.add(scrollView);
	scrollView.add(productImageView);
	scrollView.add(barOfProduct);
	scrollView.add(productDetailView);
	
	return self;
	
}
module.exports = ProductBuyWindow;
