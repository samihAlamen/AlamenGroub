const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: { type: String, enum: ['admin', 'user'] } }],
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // معرف الطالب
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // معرف الأدمن
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // الرسائل المرتبطة بالمحادثة
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
