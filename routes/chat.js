const express = require('express');
const router = express.Router();
const multer = require('multer');
const { imageStorage, videoStorage } = require('../config/cloudinary');
const chatController = require('../controllers/chatController');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { ensureAuth } = require('../middlewares/auth'); // استيراد الميدلوير


// عرض المحادثات
router.get('/conversations', chatController.list);

// عرض شات معين
router.get('/chat/:userId', chatController.show);


router.post('/chat/send/:userId', ensureAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    // تأكد أن req.user موجود قبل المتابعة
    if (!req.user || !req.user.id) {
      return res.status(400).send('User not authenticated.');
    }

    // العثور على المحادثة أو إنشائها إذا لم تكن موجودة
    const conv = await Conversation.findOneAndUpdate(
      { participants: { $all: [req.user.id, userId] } },
      {},
      { new: true, upsert: true }
    );
    
    // إرسال الرسالة النصية فقط
    await Message.create({
      sender: req.user.id,
      receiver: userId,
      conversation: conv.id,
      message: req.body.message || ''
    });
    
    // إعادة توجيه المستخدم إلى صفحة الدردشة مع الشخص الآخر
    res.redirect(`/chat/${userId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Message sending failed');
  }
});


module.exports = router;




