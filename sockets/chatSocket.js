const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

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
                const message = await Message.create({ conversation: conversationId, sender: senderId, text });
                const populatedMessage = await message.populate('sender');

                io.to(conversationId).emit('newMessage', populatedMessage);
            } catch (err) {
                console.error(err);
            }
        });
    });
};

module.exports = chatSocket;
