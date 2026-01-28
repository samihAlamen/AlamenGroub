// routes/auth.js - تسجيل دخول / تسجيل مستخدم جديد

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ensureGuest } = require('../middlewares/auth');

// صفحة تسجيل الدخول
router.get('/login', ensureGuest, (req, res) => {
    res.render('login', { title: 'تسجيل الدخول' });
});

// صفحة تسجيل مستخدم جديد
router.get('/register', ensureGuest, (req, res) => {
    res.render('register', { title: 'تسجيل مستخدم جديد' });
});

// معالجة تسجيل المستخدم
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            req.flash('error_msg', 'البريد الإلكتروني مستخدم بالفعل');
            return res.redirect('/auth/register');
        }

       user = new User({
  name,
  email,
  password, // خام — المودل يشفره
  role: 'user'
});


        await user.save();
        req.flash('success_msg', 'تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء إنشاء الحساب');
        res.redirect('/auth/register');
    }
});

// معالجة تسجيل الدخول
// معالجة تسجيل الدخول
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'البريد الإلكتروني غير مسجل');
      return res.redirect('/auth/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'كلمة المرور غير صحيحة');
      return res.redirect('/auth/login');
    }

    // حفظ المستخدم في السيشن
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // 🔥 تحويل حسب الدور
    if (user.role === 'admin') {
      return res.redirect('/admin');
    }

    if (user.role === 'staff') {
      return res.redirect('/staff/dashboard');
    }

    // مستخدم عادي
    res.redirect('/profile');

  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'حدث خطأ أثناء تسجيل الدخول');
    res.redirect('/auth/login');
  }
});


// تسجيل الخروج
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.redirect('/');
    });
});

module.exports = router;
