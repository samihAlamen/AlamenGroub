const express = require('express');
const router = express.Router();
const ChatMessage = require('../../models/ChatMessage');
const { ensureAuth, ensureRole } = require('../../middlewares/auth');

router.get('/', ensureAuth, ensureRole('admin'), async (req, res) => {
    try {
        const messages = await ChatMessage.find({
            $or: [
                { receiver: req.user.id }, // رسائل واصلة للأدمن
                { sender: req.user.id }    // ردود الأدمن
            ]
        })
        .populate('sender', 'name role')
        .populate('receiver', 'name role')
        .sort({ createdAt: 1 });

        console.log('ADMIN CHAT MESSAGES:', messages.length);

        res.render('admin/chat', {
            title: 'رسائل الطلاب',
            messages,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
});

// رد الأدمن على الطالب
router.post('/reply', ensureAuth, ensureRole('admin'), async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        await ChatMessage.create({
            sender: req.user.id,
            receiver: receiverId,
            content
        });

        res.redirect('/admin/chat');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/chat');
    }
});

module.exports = router;
