const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middlewares/auth'); // استيراد الميدلوير
const chatController = require('../controllers/chatController');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// عرض المحادثات
router.get('/conversations', chatController.list);

// عرض محادثة معينة
router.get('/chat/:userId', chatController.show);

// إرسال رسالة
router.post('/chat/send/:userId', ensureAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(400).send('User not authenticated.');
    }

    // العثور على المحادثة بين المستخدمين
    let conv = await Conversation.findOne({
      'participants.user': { $all: [req.user.id, userId] }
    });

    if (!conv) {
      // إنشاء محادثة جديدة بين الطالب والأدمن
      conv = await Conversation.create({
        participants: [
          { user: req.user.id, role: 'admin' },
          { user: userId, role: 'user' }
        ],
        student: userId,
        admin: req.user.id
      });
    }

    // إرسال الرسالة
    await Message.create({
      sender: req.user.id,
      receiver: userId,
      conversation: conv.id,
      message: req.body.message || '',
      createdAt: new Date(),
    });

    // إعادة توجيه المستخدم إلى صفحة المحادثة
    res.redirect(`/chat/${userId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Message sending failed');
  }
});

module.exports = router;


module.exports = router;







