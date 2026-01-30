const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { isAdmin, isStudent } = require('../middlewares/roles');
const Conversation = require('../models/Conversation');
const Message = require('../models/ChatMessage');

// صفحة الدردشة العامة
router.get('/chat', auth, isStudent, async (req, res) => {
  const userId = req.user._id;
  let conversation = await Conversation.findOne({ user: userId }).populate('messages');
  if (!conversation) {
    conversation = new Conversation({ user: userId, messages: [] });
    await conversation.save();
  }
  res.render('chat', { conversation });
});

// دردشة المدير مع الطالب
router.get('/admin-chat', auth, isAdmin, async (req, res) => {
  const conversations = await Conversation.find().populate('messages');
  res.render('admin-chat', { conversations });
});

module.exports = router;
