const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  lastMessage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
