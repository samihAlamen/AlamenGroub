const socketio = require('socket.io');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

module.exports = function (server) {
    const io = socketio(server);
    let users = {};  // لتخزين المستخدمين المتصلين

    io.on('connection', (socket) => {
        // عند الاتصال، تخزين الـ socketId للمستخدم
        socket.on('userConnected', (userId) => {
            users[userId] = socket.id;
        });

        // إرسال رسالة جديدة
        socket.on('sendMessage', async (data) => {
            const { senderId, receiverId, messageText } = data;

            // تخزين الرسالة في قاعدة البيانات
            const message = new Message({
                text: messageText,
                sender: senderId,
                receiver: receiverId,
                createdAt: new Date(),
            });

            await message.save();

            // التحقق من وجود محادثة بين المرسل والمستقبل
            let conversation = await Conversation.findOne({
                'participants.user': { $all: [senderId, receiverId] },
            });

            if (!conversation) {
                // إنشاء محادثة جديدة إذا لم توجد
                conversation = new Conversation({
                    participants: [
                        { user: senderId, role: 'admin' }, // أو 'user' بناءً على الدور
                        { user: receiverId, role: 'user' }  // 'user' للطرف الآخر
                    ],
                    student: receiverId,
                    admin: senderId,
                    messages: [message._id],
                });
            } else {
                // إضافة الرسالة إلى المحادثة الحالية
                conversation.messages.push(message._id);
            }

            await conversation.save();

            // إرسال الرسالة إلى المستقبل عبر WebSocket
            const receiverSocketId = users[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', message);
            }
        });

        // عند قطع الاتصال
        socket.on('disconnect', () => {
            for (let userId in users) {
                if (users[userId] === socket.id) {
                    delete users[userId];
                }
            }
        });
    });
};
