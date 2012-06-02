var db = Ti.Database.open('Chatterbox');
db.execute('CREATE TABLE IF NOT EXISTS product(id TEXT PRIMARY KEY, program_id TEXT, product_name TEXT, description TEXT, price INTEGER, contact TEXT);');
db.close();

exports.productModel_insertAllProducts = function(_allProducts) {
	var fetchedProducts = [];
	var db = Ti.Database.open('Chatterbox'); 
	
	db.execute('DELETE FROM product');
	
	for(var i =0;i<_allProducts.length;i++) {
		db.execute('INSERT INTO product(id,program_id,product_name,description,price,contact) VALUES(?,?,?,?,?,?)',
		_allProducts[i].id,_allProducts[i].program_id,_allProducts[i].product_name,_allProducts[i].description,_allProducts[i].price,_allProducts[i].contact);
	}
	db.close();
	Ti.App.fireEvent("AllProductsAreLoaded");
};