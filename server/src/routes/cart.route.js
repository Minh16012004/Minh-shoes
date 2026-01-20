// server/src/routes/cart.route.js
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.middleware')
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cart.controller')

// Test xem các function có tồn tại không
console.log('getCart:', typeof getCart)
console.log('addToCart:', typeof addToCart)
console.log('updateCartItem:', typeof updateCartItem)
console.log('removeFromCart:', typeof removeFromCart)
console.log('clearCart:', typeof clearCart)

router.get('/', auth, getCart)
router.post('/add', auth, addToCart)
router.put('/update', auth, updateCartItem)
router.delete('/remove/:itemId', auth, removeFromCart)
router.delete('/clear', auth, clearCart)

module.exports = router
// ```

// ## 🔧 Thực hiện:

// 1. **Copy 2 file trên** (cart.controller.js và cart.route.js)
// 2. **Restart backend**
// 3. **Xem terminal** - sẽ thấy log:
// ```
//    getCart: function
//    addToCart: function
//    updateCartItem: function
//    removeFromCart: function
//    clearCart: function