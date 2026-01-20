// server/src/controllers/auth.controller.js
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * REGISTER
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body

    // 1. Kiểm tra dữ liệu
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Thiếu dữ liệu' })
    }

    // 2. Check email tồn tại
    const userExist = await User.findOne({ email })
    if (userExist) {
      return res.status(400).json({ message: 'Email đã tồn tại' })
    }

    // 3. Mã hóa mật khẩu
    const hashPassword = await bcrypt.hash(password, 10)

    // ==============================
    // 4. XỬ LÝ ROLE ADMIN ĐẦU TIÊN
    // ==============================

    let role = 'user'

    // Đếm số admin hiện có trong hệ thống
    const adminCount = await User.countDocuments({ role: 'admin' })

    /**
     * CHỈ KHI:
     * - Chưa có admin nào
     * - Client gửi đúng adminSecret
     * → mới cho tạo admin
     */
    if (
      adminCount === 0 &&
      adminSecret === process.env.ADMIN_SECRET
    ) {
      role = 'admin'
    }

    // ========================================
    // 5. XỬ LÝ AVATAR UPLOAD - THÊM PHẦN NÀY
    // ========================================
    let avatarPath = ''
    if (req.file) {
      // Nếu có upload file, lưu đường dẫn
      avatarPath = `/uploads/avatars/${req.file.filename}`
    }

    // 6. Tạo user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      avatar: avatarPath, // ← THÊM dòng này
      role
    })

    res.status(201).json({
      message: 'Đăng ký thành công',
      role: user.role
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


/**
 * LOGIN
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' })

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar, // ← Avatar đã có sẵn
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * USER - GET PROFILE
 */
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  res.json(user)
}

/**
 * ADMIN - GET ALL USERS
 */
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password')
  res.json(users)
}

/**
 * ADMIN - UPDATE USER
 */
exports.updateUser = async (req, res) => {
  const { name, role } = req.body

  if (role && !['user', 'admin'].includes(role))
    return res.status(400).json({ message: 'Role không hợp lệ' })

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, role },
    { new: true }
  ).select('-password')

  res.json(user)
}

/**
 * ADMIN - DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id)

    if (!userToDelete) {
      return res.status(404).json({ message: 'User không tồn tại' })
    }

    // ==============================
    // NGĂN KHÔNG CHO XÓA ADMIN CUỐI CÙNG
    // ==============================
    if (userToDelete.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' })

      // Nếu chỉ còn 1 admin
      if (adminCount <= 1) {
        return res.status(400).json({
          message: 'Không thể xóa admin cuối cùng'
        })
      }
    }

    await User.findByIdAndDelete(req.params.id)

    res.json({ message: 'Xóa user thành công' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * ADMIN - CREATE ADMIN
 */
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Thiếu dữ liệu' })
    }

    // Check email
    const exist = await User.findOne({ email })
    if (exist) {
      return res.status(400).json({ message: 'Email đã tồn tại' })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const admin = await User.create({
      name,
      email,
      password: hashPassword,
      role: 'admin'
    })

    res.status(201).json({
      message: 'Tạo admin thành công',
      admin: {
        id: admin._id,
        email: admin.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}