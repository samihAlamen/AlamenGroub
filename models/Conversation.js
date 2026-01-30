const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // تأكد من تعريف هذا الحقل

  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }]
});

module.exports = mongoose.model('Conversation', conversationSchema);

