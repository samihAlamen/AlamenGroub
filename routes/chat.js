const express = require('express');
const router = express.Router();
const { ensureAuth, ensureRole } = require('../middlewares/auth'); // تحديث مع الـ middleware الخاص بك
const Conversation = require('../models/Conversation');
const Message = require('../models/ChatMessage');

// صفحة الدردشة العامة
router.get('/chat', ensureAuth, ensureRole('user'), async (req, res) => {
  const userId = req.user.id;
  let conversation = await Conversation.findOne({ user: userId }).populate('messages');
  if (!conversation) {
    conversation = new Conversation({ user: userId, messages: [] });
    await conversation.save();
  }
  res.render('chat', { conversation });
});

router.get('/admin-chat', ensureAuth, ensureRole('admin'), async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate('user') // تأكد من جلب بيانات المستخدم أيضًا
      .populate('messages'); // جلب الرسائل المرتبطة بالمحادثة

    // التأكد من أن كل المحادثات تحتوي على المستخدم
    const validConversations = conversations.filter(conversation => conversation.user);

    res.render('admin-chat', { conversations: validConversations });
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).send('خطأ في تحميل المحادثات');
  }
});


module.exports = router;



