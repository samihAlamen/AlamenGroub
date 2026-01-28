const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { ensureAuth } = require('../middlewares/auth');

// الحصول على محادثات المستخدم
router.get('/conversations', ensureAuth, async (req, res) => {
    const userId = req.user.id;  // استخدم الـ session للحصول على id المستخدم

    const conversations = await Conversation.find({
        participants: userId,
    }).populate('participants', 'name email').populate('messages');

    res.render('chat/conversations', { conversations });
});

// عرض محادثة معينة
router.get('/conversation/:id', ensureAuth, async (req, res) => {
    const conversationId = req.params.id;
    const conversation = await Conversation.findById(conversationId)
        .populate('participants')
        .populate('messages');

    res.render('chat/detail', { conversation });
});

// إرسال رسالة
router.post('/send', ensureAuth, async (req, res) => {
    const { receiverId, messageText } = req.body;
    const senderId = req.user.id;

    // تأكد أن المرسل والمستقبل يختلفان
    if (senderId === receiverId) {
        return res.status(400).send('لا يمكن إرسال رسالة لنفسك');
    }

    // إنشاء رسالة جديدة
    const message = new Message({
        text: messageText,
        sender: senderId,
        receiver: receiverId,
    });

    await message.save();

    // التحقق من وجود محادثة
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
        conversation = new Conversation({
            participants: [senderId, receiverId],
            messages: [message._id],
        });
    } else {
        conversation.messages.push(message._id);
    }

    await conversation.save();

    // إعادة توجيه إلى صفحة المحادثة
    res.redirect(`/chat/conversation/${conversation._id}`);
});

module.exports = router;
