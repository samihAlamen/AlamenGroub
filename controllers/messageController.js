const Message = require('../models/Message');
const User = require('../models/User');

// 📩 Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    // Basic validation
    if (!receiverId || !message?.trim()) {
      return res.status(400).json({ error: 'Receiver and message content are required.' });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully.',
      data: newMessage
    });
  } catch (err) {
    console.error('Send Message Error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};

// 📜 Fetch conversation between current user and another user
exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    // Validate input
    if (!otherUserId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id }
      ]
    }).sort('createdAt');

    res.status(200).json(messages);
  } catch (err) {
    console.error('Get Conversation Error:', err);
    res.status(500).json({ error: 'Failed to load conversation.' });
  }
};

// 📬 Fetch recent chats (last message per user) for the current user
exports.getUserChats = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const chats = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserId },
            { receiver: currentUserId }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', currentUserId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);

    const results = [];

    for (let chat of chats) {
      const user = await User.findById(chat._id).select('username avatar email');
      if (user) {
        results.push({
          user,
          message: chat.lastMessage.message,
          time: chat.lastMessage.createdAt
        });
      }
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('Get User Chats Error:', err);
    res.status(500).json({ error: 'Failed to load recent chats.' });
  }
};

// 📥 Helper: Fetch user chats (for internal use or rendering views)
exports.getUserChatsForView = async (currentUserId) => {
  try {
    const chats = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserId },
            { receiver: currentUserId }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', currentUserId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);

    const results = [];

    for (let chat of chats) {
      const user = await User.findById(chat._id).select('username avatar email');
      if (user) {
        results.push({
          user,
          message: chat.lastMessage.message,
          time: chat.lastMessage.createdAt
        });
      }
    }

    return results;
  } catch (err) {
    console.error('getUserChatsForView Error:', err);
    return [];
  }
};
