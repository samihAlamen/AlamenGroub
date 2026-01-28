const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 User connected');

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('sendMessage', async ({ conversationId, senderId, content }) => {
      const message = await Message.create({ conversation: conversationId, sender: senderId, content });
      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: content });

      io.to(conversationId).emit('newMessage', {
        content,
        sender: senderId,
        createdAt: message.createdAt
      });
    });

    socket.on('disconnect', () => console.log('🔴 User disconnected'));
  });
};
