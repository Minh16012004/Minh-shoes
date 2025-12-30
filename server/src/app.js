const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
require('dotenv').config()

const app = express()

connectDB()
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth.route'))

module.exports = app
