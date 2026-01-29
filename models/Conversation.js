const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },  // إضافة حقل للطالب
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Conversation', conversationSchema);
