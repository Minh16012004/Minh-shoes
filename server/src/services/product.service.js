const Product = require('../models/product.model');

// Tìm sản phẩm theo tên
exports.searchProductByName = async (query) => {
  try {
    const products = await Product.find({
      name: { $regex: query, $options: 'i' } // Tìm kiếm không phân biệt hoa thường
    })
    .select('name price brand sizes images')
    .limit(5);
    
    return products;
  } catch (error) {
    console.error('Search product error:', error);
    return [];
  }
};

// Lấy tất cả sản phẩm (cho context)
exports.getAllProductsSimple = async () => {
  try {
    const products = await Product.find()
      .select('name price brand')
      .limit(20);
    
    return products;
  } catch (error) {
    console.error('Get products error:', error);
    return [];
  }
};