const socketIO = require('socket.io');
const Conversation = require('../models/Conversation');
const Message = require('../models/ChatMessage');

let io;

const initSocket = (server) => {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // عندما يبدأ الطالب الدردشة مع الادمن
    socket.on('start-chat', async (userId) => {
  let conversation = await Conversation.findOne({ participants: userId });
  if (!conversation) {
    conversation = new Conversation({ participants: [userId], messages: [] });
    await conversation.save();
  }
  socket.join(conversation.id.toString());
});


   socket.on('send-message', async (data) => {
  const { userId, message } = data;
  const conversation = await Conversation.findOne({ participants: userId });

  if (conversation) {
    const newMessage = new Message({
      conversation: conversation.id,
      sender: userId,
      content: message,
      sentAt: new Date(),
    });
    await newMessage.save();
    io.to(conversation.id.toString()).emit('receive-message', newMessage);
  }
});


    // عندما يقوم المدير بالرد
    socket.on('admin-send-message', async (data) => {
      const { conversationId, message } = data;
      const newMessage = new Message({
        conversation: conversationId,
        sender: 'admin', // لا يوجد ID للادمن
        content: message,
        sentAt: new Date(),
      });
      await newMessage.save();
      io.to(conversationId).emit('receive-message', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected: ' + socket.id);
    });
  });
};

module.exports = initSocket;


