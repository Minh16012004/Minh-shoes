// server/src/models/product.model.js
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    images: [String],

    sizes: [
      {
        size: Number,
        stock: {
          type: Number,
          default: 0,
          min: 0
        }
      }
    ],

    description: {
      type: String,
      default: ''
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true
    },

    // ========== THÊM MỚI ==========
    category: {
      type: String,
      enum: [
        'Giày Nam',
        'Giày Nữ', 
        'Giày Thể Thao',
        'Giày Chạy Bộ',
        'Giày Sneaker',
        'Dép/Sandal',
        ''  // Cho phép trống
      ],
      default: ''
    },

    gender: {
      type: String,
      enum: ['nam', 'nữ', 'unisex'],
      default: 'unisex'
    }
    // ==============================
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)