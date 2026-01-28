const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// التحقق من أن الـ sender هو ObjectId صالح عند حفظ الرسالة
MessageSchema.pre('save', function(next) {
    if (!mongoose.Types.ObjectId.isValid(this.sender)) {
        return next(new Error('Invalid sender ObjectId'));
    }
    next();
});

module.exports = mongoose.model('Message', MessageSchema);
