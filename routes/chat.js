const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const auth = require('../middlewares/auth');

// صفحة الدردشة للطالب
router.get('/', auth, async (req, res) => {
    try {
        // جلب المحادثة الخاصة بالطالب
        let conversation = await Conversation.findOne({ participants: req.user._id });
        if (!conversation) {
            conversation = await Conversation.create({ participants: [req.user._id] });
        }

        const messages = await Message.find({ conversation: conversation._id }).populate('sender');

        res.render('chat/student', { conversation, messages, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
