// routes/index.js - الراوتر الرئيسي لجميع الصفحات العامة

const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middlewares/auth');
const Scholarship = require('../models/Scholarship');

// الصفحة الرئيسية
router.get('/', async (req, res) => {
    try {
        const scholarships = await Scholarship.find().sort({ createdAt: -1 }).limit(6);
        res.render('index', { title: 'الرئيسية', scholarships });
    } catch (err) {
        console.error(err);
        
        res.render('index', { title: 'الرئيسية', scholarships: [] });
    }
});

// لوحة التحكم (Dashboard) - فقط للمستخدمين المسجلين
router.get('/dashboard', ensureAuth, async (req, res) => {
    const user = req.session.user;
    res.render('dashboard', { title: 'لوحة التحكم', user });
});

// صفحة 404
router.get('/404', (req, res) => {
    res.status(404).render('404', { title: 'الصفحة غير موجودة' });
});

module.exports = router;
