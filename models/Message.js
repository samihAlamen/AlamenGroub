const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema({
  sender: { type: ObjectId, required: true, ref: 'User' },    // المرسل (الطالب أو الادمن)
  receiver: { type: ObjectId, required: true, ref: 'User' },  // المستقبل (الطالب أو الادمن)
  conversation: { type: ObjectId, required: true, ref: 'Conversation' }, // معرّف المحادثة
  message: { type: String, required: false },  // محتوى الرسالة
  sentimentScore: { type: Number },  // تقييم الشعور
  emotion: { type: String }, // الشعور
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // معرّف رسالة مرجعية
  attachmentPath: String,  // مسار المرفق (إن وجد)
  attachmentType: { type: String, enum: ['image', 'video', 'file'], default: null },  // نوع المرفق
  createdAt: { type: Date, default: Date.now }  // تاريخ إنشاء الرسالة
});

module.exports = mongoose.model('Message', messageSchema);
