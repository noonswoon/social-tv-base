var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS product(id TEXT PRIMARY KEY, program_id TEXT, product_name TEXT, product_image TEXT, description TEXT, price INTEGER, link TEXT, contact TEXT);');
db.close();

exports.productModel_insertProductsOfProgramId = function(_programId, _allProducts) {
	var db = Ti.Database.open('Chatterbox'); 
	
	db.execute('DELETE FROM product WHERE program_id = ?', _programId);
	for(var i =0;i<_allProducts.length;i++) {
		db.execute('INSERT INTO product(id, program_id, product_name, product_image, description, price, link, contact) VALUES(?,?,?,?,?,?,?,?)',
		_allProducts[i].id,_allProducts[i].program_id,_allProducts[i].product_name,_allProducts[i].product_image,_allProducts[i].description,_allProducts[i].price,_allProducts[i].link,_allProducts[i].contact);
	}
	db.close();
	
	Ti.App.fireEvent("productDbLoaded"+_programId);
};

exports.productModel_fetchProductsOfProgramId = function(_programId) {
	var fetchedProducts = [];
	var db = Ti.Database.open('Chatterbox'); 
	var result = db.execute('SELECT * FROM product WHERE program_id = ? ORDER BY program_id ASC',_programId);
	
	while(result.isValidRow()) {
		//Ti.API.info('from comments, id: '+result.fieldByName('id')+', acs_object_id: '+result.fieldByName('acs_object_id')+', content: '+result.fieldByName('content'));
		fetchedProducts.push({
			id: result.fieldByName('id'),
			programId: _programId,
			productName: result.fieldByName('product_name'),
			productImage: result.fieldByName('product_image'),
			description: result.fieldByName('description'),
			price: Number(result.fieldByName('price')),
			link: result.fieldByName('link'),
			contact: result.fieldByName('contact')
		});
		result.next();
	}	
	result.close();
	db.close();
	return fetchedProducts;
};


