const express = require('express');
const router = express.Router();
const multer = require('multer');
const { imageStorage, videoStorage } = require('../config/cloudinary');
const chatController = require('../controllers/chatController');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');


// عرض المحادثات
router.get('/conversations', chatController.list);

// عرض شات معين
router.get('/chat/:userId', chatController.show);



module.exports = router;

