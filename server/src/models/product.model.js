const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    images: [String],

    sizes: [
      {
        size: Number,
        stock: Number
      }
    ],

    description: String,

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
