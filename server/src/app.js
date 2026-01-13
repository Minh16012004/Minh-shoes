require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const app = express()

connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/brands', require('./routes/brand.route'))
app.use('/api/products', require('./routes/product.route'))


module.exports = app
