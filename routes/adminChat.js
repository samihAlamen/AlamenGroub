const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');

// صفحة الدردشة للإدمن
router.get('/', auth, roles('admin'), async (req, res) => {
    try {
        const conversations = await Conversation.find().populate('participants');
        res.render('chat/admin-list', { conversations });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// تفاصيل محادثة محددة
router.get('/:conversationId', auth, roles('admin'), async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.conversationId).populate('participants');
        const messages = await Message.find({ conversation: conversation._id }).populate('sender');
        res.render('chat/admin-chat', { conversation, messages });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
