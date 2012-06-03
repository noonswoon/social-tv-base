exports.productACS_fetchedAllProducts = function() {
	Cloud.Objects.query({
	classname: 'Product',	
    page: 1,
    per_page: 20
}, function (e) {
    if (e.success) {
    	var product =[];
        for (var i = 0; i < e.Product.length; i++) {
        	 var allProducts = e.Product[i];
             product.push(allProducts);
         }
        Ti.App.fireEvent('fetchedAllProduct',{fetchedAllProduct:product});
    } 
    else {
        alert('Error:\\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    	 }
			});
};