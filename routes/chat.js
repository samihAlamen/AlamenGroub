const express = require('express');
const router = express.Router();
const { ensureAuth, ensureRole } = require('../middlewares/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/ChatMessage');

// صفحة المستخدم
router.get('/chat', ensureAuth, ensureRole('user'), async (req, res) => {
  const admin = await req.app.locals.adminUser; // أو احصل عليه بطريقتك

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, admin._id] }
  });

  if (!conversation) {
    conversation = new Conversation({
      participants: [req.user._id, admin._id]
    });
    await conversation.save();
  }

  const messages = await Message.find({ conversation: conversation._id });

  res.render('chat', { conversation, messages });
});

// صفحة الأدمن
router.get('/admin-chat', ensureAuth, ensureRole('admin'), async (req, res) => {
  const conversations = await Conversation.find()
    .populate('participants')
    .sort({ updatedAt: -1 });

  res.render('admin-chat', { conversations });
});

module.exports = router;
