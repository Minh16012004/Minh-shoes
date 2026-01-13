const Brand = require('../models/brand.model')

// ADMIN tạo brand
exports.createBrand = async (req, res) => {
  try {
    const brand = await Brand.create({ name: req.body.name })
    res.status(201).json(brand)
  } catch (err) {
    res.status(400).json({ message: 'Brand đã tồn tại' })
  }
}

// Lấy tất cả brand (public)
exports.getBrands = async (req, res) => {
  const brands = await Brand.find().sort({ createdAt: -1 })
  res.json(brands)
}

// ADMIN sửa brand
exports.updateBrand = async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(brand)
}

// ADMIN xóa brand
exports.deleteBrand = async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id)
  res.json({ message: 'Xóa brand thành công' })
}
