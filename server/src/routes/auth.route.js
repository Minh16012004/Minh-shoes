const express = require('express')
const router = express.Router()
const upload = require('../config/upload')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

const {
  register,
  login,
  getProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  createAdmin 
} = require('../controllers/auth.controller')

// Auth
router.post('/register', upload.single('avatar'), register)
router.post('/login', login)

// User
router.get('/profile', auth, getProfile)

// Admin
router.get('/users', auth, role('admin'), getAllUsers)
router.put('/users/:id', auth, role('admin'), updateUser)
router.delete('/users/:id', auth, role('admin'), deleteUser)
// Admin tạo admin khác
router.post(
  '/admin/create',
  auth,
  role('admin'),
  createAdmin
)


module.exports = router
