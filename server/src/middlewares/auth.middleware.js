const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' })
  }
}
const auth = require('../middlewares/auth.middleware')

router.get('/profile', auth, (req, res) => {
  res.json(req.user)
})
