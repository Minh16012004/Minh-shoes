// server/src/controllers/order.controller.js
const Order = require('../models/order.model')
const Product = require('../models/product.model')

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    } = req.body

    // Kiểm tra dữ liệu
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' })
    }

    // Kiểm tra tồn kho và trừ số lượng
    for (let item of orderItems) {
      const product = await Product.findById(item.product)
      
      if (!product) {
        return res.status(404).json({ 
          message: `Sản phẩm ${item.name} không tồn tại` 
        })
      }

      // Tìm size trong product.sizes
      const sizeItem = product.sizes.find(s => s.size === item.size)
      
      if (!sizeItem || sizeItem.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Size ${item.size} của ${product.name} không đủ hàng` 
        })
      }

      // Trừ số lượng tồn kho
      sizeItem.stock -= item.quantity
      await product.save()
    }

    // Tạo đơn hàng
    const order = await Order.create({
      user: req.user.id,
      shippingInfo,
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    })

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      order
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Lấy đơn hàng của user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      orders
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Lấy chi tiết 1 đơn hàng
exports.getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name images brand')

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }

    // Kiểm tra quyền xem đơn hàng
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xem đơn hàng này' })
    }

    res.json({
      success: true,
      order
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ADMIN - Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })

    const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0)

    res.json({
      success: true,
      orders,
      totalAmount
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ADMIN - Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }

    order.orderStatus = orderStatus

    if (orderStatus === 'Đã giao') {
      order.deliveredAt = Date.now()
      order.paymentStatus = 'Đã thanh toán'
    }

    if (orderStatus === 'Hủy') {
      order.cancelledAt = Date.now()
      
      // Hoàn lại số lượng tồn kho
      for (let item of order.orderItems) {
        const product = await Product.findById(item.product)
        if (product) {
          const sizeItem = product.sizes.find(s => s.size === item.size)
          if (sizeItem) {
            sizeItem.stock += item.quantity
            await product.save()
          }
        }
      }
    }

    await order.save()

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      order
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// User hủy đơn hàng
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền hủy đơn này' })
    }

    if (order.orderStatus !== 'Chờ xác nhận') {
      return res.status(400).json({ 
        message: 'Chỉ có thể hủy đơn hàng đang chờ xác nhận' 
      })
    }

    order.orderStatus = 'Hủy'
    order.cancelledAt = Date.now()

    // Hoàn lại tồn kho
    for (let item of order.orderItems) {
      const product = await Product.findById(item.product)
      if (product) {
        const sizeItem = product.sizes.find(s => s.size === item.size)
        if (sizeItem) {
          sizeItem.stock += item.quantity
          await product.save()
        }
      }
    }

    await order.save()

    res.json({
      success: true,
      message: 'Hủy đơn hàng thành công',
      order
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}