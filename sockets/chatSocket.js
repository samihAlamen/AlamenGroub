const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const mongoose = require('mongoose');  // إضافة mongoose للتحقق من الـ ObjectId

const chatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New user connected:', socket.id);

        // الانضمام لغرفة المحادثة
        socket.on('joinConversation', (conversationId) => {
            socket.join(conversationId);
        });

        // إرسال رسالة
        socket.on('sendMessage', async ({ conversationId, senderId, text }) => {
            try {
                // التحقق من صحة senderId (يجب أن يكون ObjectId صالح)
                if (!mongoose.Types.ObjectId.isValid(senderId)) {
                    console.error('Invalid senderId:', senderId);
                    return;
                }

                // إرسال الرسالة بعد التحقق
                const message = await Message.create({ conversation: conversationId, sender: senderId, text });
                const populatedMessage = await message.populate('sender');

                // إرسال الرسالة للجميع في نفس المحادثة
                io.to(conversationId).emit('newMessage', populatedMessage);
            } catch (err) {
                console.error('Error saving message:', err);
            }
        });
    });
};

module.exports = chatSocket;
