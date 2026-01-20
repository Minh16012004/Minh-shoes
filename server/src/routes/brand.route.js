const router = require('express').Router()
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')
const {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand
} = require('../controllers/brand.controller')

// Public
router.get('/', getBrands)

// Admin
router.post('/', auth, role('admin'), createBrand)
router.put('/:id', auth, role('admin'), updateBrand)
router.delete('/:id', auth, role('admin'), deleteBrand)

module.exports = router
