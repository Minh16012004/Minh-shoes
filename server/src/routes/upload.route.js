const express = require('express');
const router = express.Router();
const upload = require('../config/upload');

// Upload 1 ảnh
router.post('/single', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Vui lòng chọn file' });
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/uploads/products/${req.file.filename}`;

  res.json({
    message: 'Upload thành công',
    url: fileUrl
  });
});


// Upload nhiều ảnh
router.post('/multiple', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Vui lòng chọn file' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const fileUrls = req.files.map(file => 
      `${baseUrl}/uploads/products/${file.filename}`
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