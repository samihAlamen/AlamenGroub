const mongoose = require('mongoose');

// Schema for Message
const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // مرجع إلى موديل المستخدم
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now  // التاريخ والوقت الحاليين
    }
  }
);

// Schema for Chat
const chatSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // مرجع إلى موديل الأدمن
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // مرجع إلى موديل المستخدم
      required: true
    },
    messages: [messageSchema],  // مصفوفة تحتوي على الرسائل
  },
  {
    timestamps: true  // تلقائيًا يضيف createdAt و updatedAt
  }
);

// إنشاء موديل الشات
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
