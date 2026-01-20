// routes/chatbot.route.js
const express = require('express');
const { chatWithBot } = require('../controllers/chatbot.controller.js');

const router = express.Router();

// Route để chat với bot
router.post('/chat', chatWithBot);

module.exports = router; // ← Dùng module.exports thay vì export default