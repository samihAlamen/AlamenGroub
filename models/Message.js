const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema({
  sender: { type: ObjectId, required: true },
  receiver: { type: ObjectId, required: true },
  conversation: { type: ObjectId, required: true },
  message: { type: String, required: false },
  sentimentScore: { type: Number },
  emotion: { type: String }, // ✅ إضافة هذا السطر
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  attachmentPath: String,
attachmentType: { type: String, enum: ['image', 'video', 'file'], default: null } , 

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
