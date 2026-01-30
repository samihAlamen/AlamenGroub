const socketIO = require('socket.io');
const Conversation = require('../models/Conversation');
const Message = require('../models/ChatMessage');

let io;

const initSocket = (server) => {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('Connected:', socket.id);

    // الانضمام أو إنشاء محادثة
    socket.on('join-conversation', async ({ userId, adminId }) => {
      let conversation = await Conversation.findOne({
        participants: { $all: [userId, adminId] }
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [userId, adminId]
        });
        await conversation.save();
      }

      socket.join(conversation.id);
      socket.emit('conversation-joined', conversation);
    });

    // إرسال رسالة
    socket.on('send-message', async ({ conversationId, senderId, text }) => {
      const message = new Message({
        conversation: conversationId,
        sender: senderId,
        text
      });

      await message.save();

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text,
        updatedAt: new Date()
      });

      io.to(conversationId).emit('receive-message', message);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
    });
  });
};

module.exports = initSocket;
