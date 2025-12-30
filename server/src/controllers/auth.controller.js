const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const userExist = await User.findOne({ email })
    if (userExist)
      return res.status(400).json({ message: 'Email đã tồn tại' })

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashPassword
    })

    res.status(201).json({ message: 'Đăng ký thành công' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

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
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ error })
  }
}
