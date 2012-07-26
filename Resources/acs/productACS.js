exports.productACS_fetchedProductsOfProgramId = function(_paramsArray) {
	programId = _paramsArray[0];
	Cloud.Objects.query({
		classname: 'Product',	
    	page: 1,
    	per_page: 20,
    	response_json_depth: 1,
    	where:{
    		program_id: programId
    	}
	}, function (e) {
		if (e.success) {
	    	var product =[];
	        for (var i = 0; i < e.Product.length; i++) {
	        	 product.push(e.Product[i]);
	         }
	         Ti.App.fireEvent('productsLoadedComplete',{targetedProgramId: programId, fetchedProductsOfProgramId:product});
	    } 
	    else {
	    	Debug.debug_print('productACS_fetchedProductsOfProgramId Error: ' + JSON.stringify(e));
	        ErrorHandling.showNetworkError();
	    }
	});
};