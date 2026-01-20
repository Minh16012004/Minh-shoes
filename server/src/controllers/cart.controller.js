// server/src/controllers/cart.controller.js
const Cart = require('../models/cart.model')
const Product = require('../models/product.model')

// ✅ Helper function tính tổng tiền
const calculateTotalPrice = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

// ✅ Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] })
    }
    
    // ✅ Đảm bảo totalPrice luôn được tính đúng
    cart.totalPrice = calculateTotalPrice(cart.items)
    await cart.save()
    
    res.json({ success: true, data: cart })
  } catch (error) {
    console.error('Get cart error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Thêm sản phẩm vào giỏ
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body
    
    console.log('=== ADD TO CART ===')
    console.log('User:', req.user?._id)
    console.log('Body:', req.body)
    
    if (!productId || !quantity || !size) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin sản phẩm!' 
      })
    }
    
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sản phẩm không tồn tại!' 
      })
    }
    
    const sizeItem = product.sizes.find(s => s.size === Number(size))
    if (!sizeItem) {
      return res.status(400).json({ 
        success: false, 
        message: 'Size không hợp lệ!' 
      })
    }
    
    if (sizeItem.stock < Number(quantity)) {
      return res.status(400).json({ 
        success: false, 
        message: `Chỉ còn ${sizeItem.stock} sản phẩm!` 
      })
    }
    
    let cart = await Cart.findOne({ user: req.user._id })
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }
    
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === Number(size)
    )
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += Number(quantity)
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        size: Number(size),
        price: product.price
      })
    }
    
    // ✅ Tính lại totalPrice (nếu không dùng pre-save hook)
    // cart.totalPrice = calculateTotalPrice(cart.items)
    
    await cart.save() // Pre-save hook sẽ tự động tính totalPrice
    await cart.populate('items.product')
    
    console.log('✅ Cart saved - Total:', cart.totalPrice)
    
    res.json({ 
      success: true, 
      message: 'Đã thêm vào giỏ hàng!',
      data: cart 
    })
  } catch (error) {
    console.error('Add to cart error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Cập nhật số lượng
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Số lượng không hợp lệ!' 
      })
    }
    
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Giỏ hàng không tồn tại!' 
      })
    }
    
    const item = cart.items.id(itemId)
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sản phẩm không có trong giỏ!' 
      })
    }
    
    item.quantity = quantity
    
    // ✅ Tính lại totalPrice (nếu không dùng pre-save hook)
    // cart.totalPrice = calculateTotalPrice(cart.items)
    
    await cart.save() // Pre-save hook sẽ tự động tính totalPrice
    await cart.populate('items.product')
    
    console.log('✅ Cart updated - Total:', cart.totalPrice)
    
    res.json({ 
      success: true, 
      message: 'Đã cập nhật!',
      data: cart 
    })
  } catch (error) {
    console.error('Update cart error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Xóa sản phẩm
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params
    
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Giỏ hàng không tồn tại!' 
      })
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId)
    
    // ✅ Tính lại totalPrice (nếu không dùng pre-save hook)
    // cart.totalPrice = calculateTotalPrice(cart.items)
    
    await cart.save() // Pre-save hook sẽ tự động tính totalPrice
    await cart.populate('items.product')
    
    console.log('✅ Item removed - Total:', cart.totalPrice)
    
    res.json({ 
      success: true, 
      message: 'Đã xóa!',
      data: cart 
    })
  } catch (error) {
    console.error('Remove cart error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Xóa toàn bộ giỏ
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Giỏ hàng không tồn tại!' 
      })
    }
    
    cart.items = []
    cart.totalPrice = 0
    await cart.save()
    
    console.log('✅ Cart cleared')
    
    res.json({ 
      success: true, 
      message: 'Đã xóa toàn bộ!',
      data: cart 
    })
  } catch (error) {
    console.error('Clear cart error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}