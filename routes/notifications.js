// routes/notifications.js - إشعارات النظام

const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { ensureAuth } = require('../middlewares/auth');

// عرض كل الإشعارات الخاصة بالمستخدم
router.get('/', ensureAuth, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.session.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.render('notifications', { title: 'الإشعارات', notifications, user: req.session.user });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء جلب الإشعارات');
        res.redirect('/dashboard');
    }
});

// إنشاء إشعار جديد (يمكن استدعاؤه من أي مكان في المشروع)
router.post('/create', ensureAuth, async (req, res) => {
    const { userId, message, type = 'info' } = req.body;
    try {
        const notification = new Notification({
            user: userId,
            message,
            type,
            read: false
        });
        await notification.save();
        res.send({ success: true, notification });
    } catch (err) {
        console.error(err);
        res.send({ success: false });
    }
});

// تعليم إشعار كمقروء
router.post('/mark-read/:id', ensureAuth, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.send({ success: true });
    } catch (err) {
        console.error(err);
        res.send({ success: false });
    }
});

module.exports = router;
