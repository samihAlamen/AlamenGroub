const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
