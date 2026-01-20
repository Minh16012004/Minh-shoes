// server/app.js
const express = require('express');
const cors = require('cors');
const path = require('path'); 

// Import routes
const authRoutes = require('./src/routes/auth.route');
const productRoutes = require('./src/routes/product.route');
const brandRoutes = require('./src/routes/brand.route');
const uploadRoutes = require('./src/routes/upload.route');
const cartRoutes = require('./src/routes/cart.route');
const orderRoutes = require('./src/routes/order.route');
const chatbotRoute = require('./src/routes/chatbot.route'); // ← Đã có

const app = express();

// Middleware
app.use(cors({
  origin:[ 'http://localhost:5173',
  "https://minh-shoes-37dt.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoutes);

// ============ ĐĂNG KÝ TẤT CẢ ROUTES Ở ĐÂY ============
app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chatbot', chatbotRoute); // ← DI CHUYỂN LÊN ĐÂY

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ============ 404 HANDLER PHẢI Ở CUỐI ============
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling middleware (LUÔN LUÔN Ở CUỐI CÙNG)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;