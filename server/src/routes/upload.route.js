const express = require('express');
const router = express.Router();
const upload = require('../config/upload');

// Upload 1 ảnh
router.post('/single', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn file' });
    }
    
    const fileUrl = `http://localhost:5000/uploads/products/${req.file.filename}`;
    res.json({ 
      message: 'Upload thành công',
      url: fileUrl 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload nhiều ảnh
router.post('/multiple', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Vui lòng chọn file' });
    }
    
    const fileUrls = req.files.map(file => 
      `http://localhost:5000/uploads/products/${file.filename}`
    );
    
    res.json({ 
      message: 'Upload thành công',
      urls: fileUrls 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;