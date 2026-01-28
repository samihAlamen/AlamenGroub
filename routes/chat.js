const express = require('express');
const router = express.Router();
const multer = require('multer');
const { imageStorage, videoStorage } = require('../config/cloudinary');
const chatController = require('../controllers/chatController');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// حماية الدخول
router.use((req, res, next) => {
  if (!req.user) return res.redirect('/login');
  next();
});

// عرض المحادثات
router.get('/conversations', chatController.list);

// عرض شات معين
router.get('/chat/:userId', chatController.show);

// حذف محادثة
router.delete('/delete/:userId', async (req, res) => {
  try {
    const userId = req.user._id;
    const otherId = req.params.userId;
    const conv = await Conversation.findOne({ participants: { $all: [userId, otherId] } });
    if (!conv) return res.status(404).json({ message: 'Conversation not found' });
    await Conversation.deleteOne({ _id: conv._id });
    await Message.deleteMany({ conversation: conv._id });
    res.json({ message: 'Conversation deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// أرشفة محادثة
router.post('/archive/:id', async (req, res) => {
  try {
    const conv = await Conversation.findOne({ participants: { $all: [req.user._id, req.params.id] } });
    if (!conv) return res.status(404).json({ message: 'Not found' });
    conv.archived = true;
    await conv.save();
    res.json({ message: 'Archived' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error archiving' });
  }
});

// إرسال صورة
// unified upload route
const storage = {
  _handleFile(req, file, cb) {
    const selectedStorage = file.mimetype.startsWith('video/')
      ? videoStorage
      : imageStorage;
    selectedStorage._handleFile(req, file, cb);
  },
  _removeFile(req, file, cb) {
    const selectedStorage = file.mimetype.startsWith('video/')
      ? videoStorage
      : imageStorage;
    selectedStorage._removeFile(req, file, cb);
  }
};

const upload = multer({ storage });

router.post('/chat/upload/:userId', upload.single('attachment'), async (req, res) => {
  try {
    const { userId } = req.params;
    const fileType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const conv = await Conversation.findOneAndUpdate(
      { participants: { $all: [req.user._id, userId] } },
      {},
      { new: true, upsert: true }
    );
    await Message.create({
      sender: req.user._id,
      receiver: userId,
      conversation: conv._id,
      message: req.body.message || '',
      attachmentPath: req.file?.path || null,
      attachmentType: fileType
    });
    res.redirect(`/chat/${userId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
});

module.exports = router;
