const Product = require('../models/product.model')

// ADMIN tạo sản phẩm
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body)
  res.status(201).json(product)
}

// Lấy danh sách sản phẩm (public)
exports.getProducts = async (req, res) => {
  const products = await Product.find()
    .populate('brand', 'name')
    .sort({ createdAt: -1 })

  res.json(products)
}

// Lấy chi tiết sản phẩm
exports.getProductDetail = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('brand', 'name')

  if (!product)
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })

  res.json(product)
}

// ADMIN cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(product)
}

// ADMIN xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ message: 'Xóa sản phẩm thành công' })
}
