// server/src/routes/order.route.js
const router = require('express').Router()
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

const {
  createOrder,
  getMyOrders,
  getOrderDetail,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/order.controller')

// User routes
router.post('/', auth, createOrder)
router.get('/my-orders', auth, getMyOrders)
router.get('/:id', auth, getOrderDetail)
router.put('/:id/cancel', auth, cancelOrder)

// Admin routes
router.get('/admin/all', auth, role('admin'), getAllOrders)
router.put('/admin/:id/status', auth, role('admin'), updateOrderStatus)

module.exports = router