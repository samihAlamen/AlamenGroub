const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { ensureAuth, ensureRole } = require('../middlewares/auth');

router.get('/', ensureAuth, ensureRole('admin'), async (req, res) => {
  const conversations = await Conversation.find().populate('student', 'name email');
  res.render('chat/admin-list', { conversations });
});

router.get('/:id', ensureAuth, ensureRole('admin'), async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('Conversation ID غير صحيح');

  const conversation = await Conversation.findById(id).populate('student');
  if (!conversation) return res.status(404).send('Conversation غير موجود');

  const messages = await Message.find({ conversation: conversation._id })
    .populate('sender', 'name role')
    .sort({ createdAt: 1 });

  res.render('chat/admin-chat', { conversation, messages, user: req.user });
});

module.exports = router;
