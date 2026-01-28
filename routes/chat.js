const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { ensureAuth, ensureRole } = require('../middlewares/auth');

router.get('/', ensureAuth, async (req, res) => {
  let conversation = await Conversation.findOne({ student: req.user._id });
  if (!conversation) {
    conversation = await Conversation.create({ student: req.user._id });
  }

  const messages = await Message.find({ conversation: conversation._id })
    .populate('sender', 'name role')
    .sort({ createdAt: 1 });

  res.render('chat/student', { conversation, messages, user: req.user });
});

module.exports = router;
