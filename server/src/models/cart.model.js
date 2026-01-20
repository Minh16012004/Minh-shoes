// server/src/models/cart.model.js
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1
        },
        size: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

// ✅ PRE-SAVE HOOK - Tự động tính totalPrice trước khi lưu
// KHÔNG CẦN next() - Mongoose tự động xử lý khi không có callback
cartSchema.pre('save', function() {
  // Tính tổng tiền từ tất cả items
  this.totalPrice = this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
  
  console.log('💰 Cart totalPrice calculated:', this.totalPrice)
})

module.exports = mongoose.model('Cart', cartSchema)