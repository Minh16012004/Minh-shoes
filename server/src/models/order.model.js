// server/src/models/order.model.js
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  // Thông tin khách hàng
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Thông tin giao hàng
  shippingInfo: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: String,
    ward: String,
    note: String
  },

  // Sản phẩm đặt mua
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: String,
      price: Number,
      quantity: Number,
      size: Number,
      image: String
    }
  ],

  // Thanh toán
  paymentMethod: {
    type: String,
    enum: ['COD', 'VNPay', 'MoMo', 'Banking'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['Chưa thanh toán', 'Đã thanh toán', 'Hoàn tiền'],
    default: 'Chưa thanh toán'
  },

  // Giá
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },

  // Trạng thái đơn hàng
  orderStatus: {
    type: String,
    enum: ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Hủy'],
    default: 'Chờ xác nhận'
  },

  // Thời gian
  deliveredAt: Date,
  cancelledAt: Date
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)