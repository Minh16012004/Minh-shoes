// server/src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

module.exports = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.header('Authorization')
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Không có token, vui lòng đăng nhập!' 
      })
    }
    
    // Loại bỏ "Bearer " để lấy token
    const token = authHeader.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token không hợp lệ!' 
      })
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Hỗ trợ cả "id" và "userId" (để tương thích với code cũ)
    const userId = decoded.userId || decoded.id
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Token không chứa thông tin user!' 
      })
    }
    
    // Tìm user
    const user = await User.findById(userId).select('-password')
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User không tồn tại!' 
      })
    }
    
    // Gán user vào request
    req.user = user
    
    next()
    
  } catch (error) {
    console.error('Auth middleware error:', error.message)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token không hợp lệ!' 
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token đã hết hạn, vui lòng đăng nhập lại!' 
      })
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Lỗi xác thực!' 
    })
  }
}