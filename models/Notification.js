const mongoose = require('mongoose');

// Schema for the Notification model
const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (recipient of the notification)
        required: true,
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'success', 'error'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false, // Default is 'false' (notification is unread)
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the Notification model
module.exports = mongoose.model('Notification', notificationSchema);
