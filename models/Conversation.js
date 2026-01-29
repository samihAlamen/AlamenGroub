const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // المشاركين في المحادثة
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },  // الطالب
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // الادمن
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],  // الرسائل المتعلقة بالمحادثة
  createdAt: { type: Date, default: Date.now }  // تاريخ إنشاء المحادثة
});

module.exports = mongoose.model('Conversation', conversationSchema);
