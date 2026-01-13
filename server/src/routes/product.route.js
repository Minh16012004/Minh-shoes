const router = require('express').Router()
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

const {
  createProduct,
  getProducts,
  getProductDetail,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller')

// Public
router.get('/', getProducts)
router.get('/:id', getProductDetail)

// Admin
router.post('/', auth, role('admin'), createProduct)
router.put('/:id', auth, role('admin'), updateProduct)
router.delete('/:id', auth, role('admin'), deleteProduct)

module.exports = router
